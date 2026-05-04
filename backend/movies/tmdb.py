import requests
from django.conf import settings

BASE = settings.TMDB_BASE_URL
KEY = settings.TMDB_API_KEY


def get(endpoint, params=None):
    params = params.copy() if params else {}
    params['api_key'] = KEY
    res = requests.get(f"{BASE}{endpoint}", params=params, timeout=10)
    res.raise_for_status()
    return res.json()


# Weekly trending movies
def fetch_trending():
    return get('/trending/movie/week').get('results', [])


# Popular movies
def fetch_popular():
    return get('/movie/popular').get('results', [])


# Movie detail by TMDB ID
def fetch_movie_details(tmdb_id):
    return get(f'/movie/{tmdb_id}')


# Cast and crew
def fetch_credits(tmdb_id):
    return get(f'/movie/{tmdb_id}/credits')


# YouTube trailers
def fetch_videos(tmdb_id):
    videos = get(f'/movie/{tmdb_id}/videos').get('results', [])
    return [v for v in videos if v.get('site') == 'YouTube' and v.get('type') == 'Trailer']


# Search movies
def search_movies(query):
    return get('/search/movie', {'query': query}).get('results', [])


# Similar movies
def fetch_similar(tmdb_id):
    return get(f'/movie/{tmdb_id}/similar').get('results', [])


# Now playing in cinemas
def fetch_now_playing():
    return get('/movie/now_playing').get('results', [])


# Top rated
def fetch_top_rated():
    return get('/movie/top_rated').get('results', [])
