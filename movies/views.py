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
    search = request.GET.get('q', '')
    if search:
        movies = Movie.objects.filter(title__icontains=search)[:20]
    else:
        movies = Movie.objects.order_by('-popularity')[:20]
    serializer = MovieSerializer(movies, many=True)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def movie_detail(request, movie_id):
    try:
        movie = Movie.objects.get(id=movie_id)
    except Movie.DoesNotExist:
        return Response({'error': 'Movie not found'}, status=404)
    serializer = MovieSerializer(movie)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([AllowAny])
def trending(request):
    movies = Movie.objects.order_by('-popularity')[:10]
    serializer = MovieSerializer(movies, many=True)
    return Response(serializer.data)


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