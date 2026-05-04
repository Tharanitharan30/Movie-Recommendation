from django.db import models
from django.contrib.auth.models import User

class Movie(models.Model):
    tmdb_id       = models.IntegerField(unique=True)
    title         = models.CharField(max_length=255)
    overview      = models.TextField(blank=True)
    genres        = models.JSONField(default=list)   # ["Action", "Drama"]
    cast          = models.JSONField(default=list)   # ["Leo DiCaprio", ...]
    poster_path   = models.CharField(max_length=255, blank=True)
    vote_average  = models.FloatField(default=0.0)
    vote_count    = models.IntegerField(default=0)
    release_date  = models.CharField(max_length=20, blank=True)
    popularity    = models.FloatField(default=0.0)

    def __str__(self):
        return self.title

class Rating(models.Model):
    user       = models.ForeignKey(User, on_delete=models.CASCADE)
    movie      = models.ForeignKey(Movie, on_delete=models.CASCADE)
    score      = models.IntegerField()   # 1 to 5
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'movie')  # one rating per user per movie

    def __str__(self):
        return f"{self.user.username} → {self.movie.title} ({self.score}★)"