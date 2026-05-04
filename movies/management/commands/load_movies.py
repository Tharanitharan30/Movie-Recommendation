import os
import json
import pandas as pd
from django.core.management.base import BaseCommand
from movies.models import Movie

class Command(BaseCommand):
    help = 'Load movies from TMDB CSV'

    def handle(self, *args, **kwargs):
        DATA_DIR = r'D:\Movie Recommendation\data'

        movies_df  = pd.read_csv(os.path.join(DATA_DIR, 'tmdb_5000_movies.csv'))
        credits_df = pd.read_csv(os.path.join(DATA_DIR, 'tmdb_5000_credits.csv'))

        df = movies_df.merge(credits_df, on='title')
        self.stdout.write(f"Loading {len(df)} movies...")

        for _, row in df.iterrows():
            try:
                genres = [g['name'] for g in json.loads(row['genres'])]
            except:
                genres = []

            try:
                cast = [c['name'] for c in json.loads(row['cast'])[:5]]
            except:
                cast = []

            Movie.objects.update_or_create(
                tmdb_id=row['id'],
                defaults={
                    'title':        row['title'],
                    'overview':     row.get('overview', ''),
                    'genres':       genres,
                    'cast':         cast,
                    'poster_path':  row.get('poster_path', ''),
                    'vote_average': row.get('vote_average', 0.0),
                    'vote_count':   row.get('vote_count', 0),
                    'release_date': str(row.get('release_date', '')),
                    'popularity':   row.get('popularity', 0.0),
                }
            )
        self.stdout.write(self.style.SUCCESS('✅ Movies loaded successfully!'))