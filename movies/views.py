import sys, os
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Movie, Rating
from .serializers import (
    MovieSerializer, RatingSerializer,
    UserSerializer, RegisterSerializer
)
from ML.recommend import get_recommendations
from .tmdb import (
    fetch_trending, fetch_popular, fetch_movie_details,
    fetch_credits, fetch_videos, search_movies,
    fetch_now_playing , fetch_top_rated,fetch_now_playing, fetch_top_rated
)


# ─── AUTH ────────────────────────────────────────────────

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


# ─── MOVIES ──────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([AllowAny])
def movie_list(request):
    q = request.GET.get('q', '')
    if q:
        results = search_movies(q)
    else:
        results = fetch_popular()
    return Response(results)


@api_view(['GET'])
@permission_classes([AllowAny])
def movie_detail(request, movie_id):
    # Fetch TMDB details + credits + videos
    details = fetch_movie_details(movie_id)
    credits = fetch_credits(movie_id)
    videos = fetch_videos(movie_id)
    details['cast'] = [c['name'] for c in credits.get('cast', [])[:6]]
    details['trailer'] = videos[0]['key'] if videos else None
    return Response(details)


@api_view(['GET'])
@permission_classes([AllowAny])
def trending(request):
    return Response(fetch_trending())


@api_view(['GET'])
@permission_classes([AllowAny])
def now_playing(request):
    return Response(fetch_now_playing())


@api_view(['GET'])
@permission_classes([AllowAny])
def top_rated(request):
    return Response(fetch_top_rated())


# ─── RECOMMENDATIONS ─────────────────────────────────────

@api_view(['GET'])
@permission_classes([AllowAny])
def recommend(request, movie_id):
    user_id = request.user.id if request.user.is_authenticated else None
    data = get_recommendations(movie_id=movie_id, user_id=user_id)
    return Response(data)


# ─── RATINGS ─────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def rate_movie(request):
    movie_id = request.data.get('movie_id')
    score    = request.data.get('score')

    if not movie_id or not score:
        return Response({'error': 'movie_id and score required'}, status=400)

    if not (1 <= int(score) <= 5):
        return Response({'error': 'Score must be between 1 and 5'}, status=400)

    try:
        movie = Movie.objects.get(id=movie_id)
    except Movie.DoesNotExist:
        return Response({'error': 'Movie not found'}, status=404)

    rating, created = Rating.objects.update_or_create(
        user=request.user,
        movie=movie,
        defaults={'score': score}
    )
    return Response({
        'message': 'Rating saved!',
        'score': score,
        'created': created
    })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_ratings(request):
    ratings = Rating.objects.filter(user=request.user).select_related('movie')
    data = [
        {
            'movie_id':    r.movie.id,
            'title':       r.movie.title,
            'poster_path': r.movie.poster_path,
            'score':       r.score,
        }
        for r in ratings
    ]
    return Response(data)

@api_view(['GET'])
@permission_classes([AllowAny])
def movie_list(request):
    q = request.GET.get('q', '')
    if q:
        results = search_movies(q)
    else:
        results = fetch_popular()

    # ← Fallback to local DB if TMDB returns empty
    if not results:
        movies = Movie.objects.order_by('-popularity')[:20]
        return Response(MovieSerializer(movies, many=True).data)

    return Response(results)


@api_view(['GET'])
@permission_classes([AllowAny])
def trending(request):
    results = fetch_trending()

    # ← Fallback to local DB if TMDB returns empty
    if not results:
        movies = Movie.objects.order_by('-popularity')[:10]
        return Response(MovieSerializer(movies, many=True).data)

    return Response(results)