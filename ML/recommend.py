from ML.content_filter import get_similar_movies
from ML.collab_filter import get_user_recommendations
from movies.models import Movie

def get_recommendations(movie_id=None, user_id=None, top_n=10):
    results = {
        'content_based': [],
        'collaborative': [],
    }

    # Content-based — similar to a movie
    if movie_id:
        similar = get_similar_movies(movie_id, top_n)
        results['content_based'] = similar

    # Collaborative — based on user ratings
    if user_id:
        movie_ids = get_user_recommendations(user_id, top_n)
        movies = Movie.objects.filter(id__in=movie_ids).values(
            'id', 'title', 'poster_path', 'vote_average'
        )
        results['collaborative'] = list(movies)

    return results