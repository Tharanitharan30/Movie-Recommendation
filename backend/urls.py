from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from movies import views

urlpatterns = [
    path('admin/', admin.site.urls),

    # Auth
    path('api/auth/register/',      views.register),
    path('api/auth/login/',         TokenObtainPairView.as_view()),
    path('api/auth/refresh/',       TokenRefreshView.as_view()),
    path('api/auth/profile/',       views.profile),

    # Movies
    path('api/movies/',             views.movie_list),
    path('api/movies/trending/',    views.trending),
    path('api/movies/now-playing/', views.now_playing),
    path('api/movies/top-rated/',   views.top_rated),
    path('api/movies/<int:movie_id>/', views.movie_detail),

    # Recommendations
    path('api/recommend/<int:movie_id>/', views.recommend),

    # Ratings
    path('api/ratings/',            views.rate_movie),
    path('api/ratings/mine/',       views.my_ratings),
    
]