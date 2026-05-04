import json
import numpy as np
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from movies.models import Movie

def build_content_model():
    # Load all movies from DB
    movies = Movie.objects.all().values(
        'id', 'title', 'overview', 'genres', 'cast'
    )
    df = pd.DataFrame(list(movies))

    # Combine genres + cast + overview into one text "soup"
    def make_soup(row):
        genres = ' '.join(row['genres']) if row['genres'] else ''
        cast   = ' '.join(row['cast'])   if row['cast']   else ''
        overview = row['overview']        if row['overview'] else ''
        return f"{genres} {cast} {overview}"

    df['soup'] = df.apply(make_soup, axis=1)

    # Build TF-IDF matrix
    tfidf = TfidfVectorizer(stop_words='english')
    matrix = tfidf.fit_transform(df['soup'])

    # Compute cosine similarity
    sim_matrix = cosine_similarity(matrix, matrix)

    return df, sim_matrix


def get_similar_movies(movie_id, top_n=10):
    df, sim_matrix = build_content_model()

    # Find index of the movie
    matches = df[df['id'] == movie_id]
    if matches.empty:
        return []

    idx = matches.index[0]

    # Get similarity scores
    scores = list(enumerate(sim_matrix[idx]))
    scores = sorted(scores, key=lambda x: x[1], reverse=True)

    # Skip the movie itself (index 0)
    top_indices = [i[0] for i in scores[1:top_n+1]]

    return df.iloc[top_indices][['id', 'title']].to_dict('records')