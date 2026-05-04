from django.contrib import admin
from .models import Movie, Rating

@admin.register(Movie)
class MovieAdmin(admin.ModelAdmin):
    list_display = ('title', 'vote_average', 'popularity', 'release_date')
    search_fields = ('title',)

admin.site.register(Rating)