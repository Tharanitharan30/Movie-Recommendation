from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.contrib.auth.models import User

from .models import Movie, Rating
from .serializers import MovieSerializer, UserSerializer, RegisterSerializer
from ML.recommend import get_recommendations
from .tmdb import (
    fetch_trending,
    fetch_popular,
    fetch_movie_details,
    fetch_credits,
    fetch_videos,
    search_movies,
    fetch_now_playing,
    fetch_top_rated,
    fetch_similar,
)


@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'User created!'}, status=201)
    return Response(serializer.errors, status=400)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def movie_list(request):
    q = request.GET.get('q', '').strip()
    if q:
        results = search_movies(q)
    else:
        results = fetch_popular()

    # Fallback to local DB if TMDB returns empty.
    if not results:
        movies = Movie.objects.order_by('-popularity')[:20]
        return Response(MovieSerializer(movies, many=True).data)

    return Response(results)


@api_view(['GET'])
@permission_classes([AllowAny])
def movie_detail(request, movie_id):
    details = fetch_movie_details(movie_id)
    credits = fetch_credits(movie_id)
    videos = fetch_videos(movie_id)

    # Keep payload simple for frontend while preserving credits/videos too.
    details['cast'] = [c.get('name') for c in credits.get('cast', [])[:6] if c.get('name')]
    details['credits'] = credits
    details['videos'] = {'results': videos}
    details['trailer'] = videos[0].get('key') if videos else None
    return Response(details)


@api_view(['GET'])
@permission_classes([AllowAny])
def trending(request):
    results = fetch_trending()
    if not results:
        movies = Movie.objects.order_by('-popularity')[:10]
        return Response(MovieSerializer(movies, many=True).data)
    return Response(results)


@api_view(['GET'])
@permission_classes([AllowAny])
def now_playing(request):
    results = fetch_now_playing()
    return Response(results)


@api_view(['GET'])
@permission_classes([AllowAny])
def top_rated(request):
    results = fetch_top_rated()
    return Response(results)


@api_view(['GET'])
@permission_classes([AllowAny])
def recommend(request, movie_id):
    user_id = request.user.id if request.user.is_authenticated else None

    # Always provide TMDB recommendations for TMDB ids used by frontend.
    tmdb_similar = fetch_similar(movie_id)

    # ML model uses local Movie.id; map TMDB id -> local id when available.
    local_movie = Movie.objects.filter(tmdb_id=movie_id).only('id').first()
    local_movie_id = local_movie.id if local_movie else None

    ml = get_recommendations(movie_id=local_movie_id, user_id=user_id)
    ml_based = ml.get('content_based', [])

    return Response({
        'tmdb_similar': tmdb_similar,
        'ml_based': ml_based,
        'collaborative': ml.get('collaborative', []),
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def rate_movie(request):
    movie_id = request.data.get('movie_id')
    score = request.data.get('score')

    if not movie_id or score is None:
        return Response({'error': 'movie_id and score required'}, status=400)

    try:
        score = int(score)
    except (TypeError, ValueError):
        return Response({'error': 'Score must be an integer'}, status=400)

    if not (1 <= score <= 5):
        return Response({'error': 'Score must be between 1 and 5'}, status=400)

    # Ratings are stored against local Movie records.
    movie = Movie.objects.filter(id=movie_id).first()
    if not movie:
        movie = Movie.objects.filter(tmdb_id=movie_id).first()
    if not movie:
        return Response({'error': 'Movie not found in local database'}, status=404)

    rating, created = Rating.objects.update_or_create(
        user=request.user,
        movie=movie,
        defaults={'score': score},
    )

    return Response({
        'message': 'Rating saved!',
        'score': score,
        'created': created,
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_ratings(request):
    ratings = Rating.objects.filter(user=request.user).select_related('movie')
    data = [
        {
            'movie_id': r.movie.id,
            'tmdb_id': r.movie.tmdb_id,
            'title': r.movie.title,
            'poster_path': r.movie.poster_path,
            'score': r.score,
        }
        for r in ratings
    ]
    return Response(data)
