import numpy as np
import pandas as pd
from sklearn.decomposition import TruncatedSVD
from movies.models import Rating

def get_user_recommendations(user_id, top_n=10):
    # Load all ratings from DB
    ratings = Rating.objects.all().values('user_id', 'movie_id', 'score')
    df = pd.DataFrame(list(ratings))

    if df.empty or user_id not in df['user_id'].values:
        return []  # fallback to content-based

    # Build user-movie matrix
    matrix = df.pivot_table(
        index='user_id',
        columns='movie_id',
        values='score',
        fill_value=0
    )

    # Apply SVD (matrix factorization)
    svd = TruncatedSVD(n_components=20, random_state=42)
    latent = svd.fit_transform(matrix)

    # Reconstruct full matrix
    reconstructed = np.dot(latent, svd.components_)
    predicted_df = pd.DataFrame(
        reconstructed,
        index=matrix.index,
        columns=matrix.columns
    )

    # Get predictions for this user
    user_row = predicted_df.loc[user_id]

    # Remove already rated movies
    already_rated = df[df['user_id'] == user_id]['movie_id'].tolist()
    user_row = user_row.drop(index=already_rated, errors='ignore')

    # Return top N movie IDs
    top_movie_ids = user_row.nlargest(top_n).index.tolist()
    return top_movie_ids