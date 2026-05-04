import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry
from django.conf import settings

BASE = settings.TMDB_BASE_URL
KEY  = settings.TMDB_API_KEY

# ─── Create session with retry + SSL fix ─────────────────
def create_session():
    session = requests.Session()
    retry = Retry(
        total=3,
        backoff_factor=1,
        status_forcelist=[429, 500, 502, 503, 504]
    )
    adapter = HTTPAdapter(max_retries=retry)
    session.mount('https://', adapter)
    session.mount('http://', adapter)
    return session

def get(endpoint, params={}):
    params['api_key'] = KEY
    session = create_session()
    try:
        res = session.get(
            f"{BASE}{endpoint}",
            params=params,
            timeout=10,
            verify=True
        )
        res.raise_for_status()
        return res.json()
    except requests.exceptions.SSLError:
        # Fallback without SSL verification
        res = session.get(
            f"{BASE}{endpoint}",
            params=params,
            timeout=10,
            verify=False
        )
        return res.json()
    except requests.exceptions.ConnectionError as e:
        print(f"TMDB Connection Error on {endpoint}: {e}")
        return {}
    except requests.exceptions.HTTPError as e:
        print(f"TMDB API Error on {endpoint}: {e}")
        return {}

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
    return [v for v in videos if v['site'] == 'YouTube' and v['type'] == 'Trailer']

# Search movies
def search_movies(query):
    return get('/search/movie', {'query': query}).get('results', [])

# Similar movies
def fetch_similar(tmdb_id):
    return get(f'/movie/{tmdb_id}/similar').get('results', [])

# Now playing
def fetch_now_playing():
    return get('/movie/now_playing').get('results', [])

# Top rated
def fetch_top_rated():
    return get('/movie/top_rated').get('results', [])