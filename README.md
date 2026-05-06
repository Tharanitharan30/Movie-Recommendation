# 🎬 Movie Recommendation System

A full-stack AI-powered movie recommendation web app built with **React + Django + Machine Learning**.

![Python](https://img.shields.io/badge/Python-3.11-blue)
![Django](https://img.shields.io/badge/Django-REST_Framework-green)
![React](https://img.shields.io/badge/React-18-61DAFB)
![Tailwind](https://img.shields.io/badge/Tailwind-CSS-38BDF8)
![TMDB](https://img.shields.io/badge/TMDB-API-01D277)


---

## ✨ Features

- 🔥 **Live Trending** — Weekly trending movies from TMDB API
- 🎬 **Now Playing** — Currently showing in cinemas
- ⭐ **Top Rated** — Highest rated movies of all time
- 🔍 **Live Search** — Search across 1M+ movies instantly
- 🤖 **AI Recommendations** — Content-based + collaborative filtering ML engine
- 🖼️ **HD Posters** — Movie posters from TMDB CDN
- 🎥 **YouTube Trailers** — Embedded trailers on movie detail page
- 👤 **User Auth** — Register, login with JWT authentication
- ⭐ **Rating System** — Rate movies 1-5 stars
- 📱 **Responsive** — Works on mobile and desktop

---

## 🛠️ Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 | UI framework |
| Vite | Build tool |
| Tailwind CSS | Styling |
| Axios | API calls |
| React Router | Navigation |

### Backend
| Technology | Purpose |
|------------|---------|
| Django | Web framework |
| Django REST Framework | API |
| SimpleJWT | Authentication |
| django-cors-headers | CORS |
| Gunicorn | Production server |
| PostgreSQL | Production database |

### Machine Learning
| Technology | Purpose |
|------------|---------|
| scikit-learn | TF-IDF + cosine similarity |
| pandas | Data processing |
| TruncatedSVD | Collaborative filtering |
| TMDB Dataset | 4800+ movies |

### Deployment
| Service | Purpose |
|---------|---------|
| Render | Django backend hosting |
| Vercel | React frontend hosting |
| PostgreSQL | Render managed database |

---

## 📁 Project Structure

```
Movie Recommendation/
├── backend/                  ← Django project settings
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── movies/                   ← Django app
│   ├── models.py             ← Movie, Rating models
│   ├── views.py              ← API endpoints
│   ├── serializers.py        ← DRF serializers
│   ├── tmdb.py               ← TMDB API service
│   ├── admin.py
│   └── management/
│       └── commands/
│           └── load_movies.py ← CSV data loader
├── ML/                       ← Recommendation engine
│   ├── recommend.py          ← Combined recommender
│   ├── content_filter.py     ← Content-based filtering
│   └── collab_filter.py      ← Collaborative filtering
├── frontend/                 ← React app
│   ├── src/
│   │   ├── components/       ← Reusable components
│   │   ├── pages/            ← Page components
│   │   ├── context/          ← Auth context
│   │   └── services/         ← API service
│   └── .env.production
├── data/                     ← Dataset (not in git)
│   ├── tmdb_5000_movies.csv
│   └── tmdb_5000_credits.csv
├── .env                      ← Environment variables (not in git)
├── .gitignore
├── Procfile                  ← Render deployment
├── runtime.txt
└── requirements.txt
```

---

## 🚀 Local Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- Git

### 1. Clone the repo
```bash
git clone https://github.com/yourusername/movie-recommendation.git
cd movie-recommendation
```

### 2. Backend setup
```bash
# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
source venv/bin/activate     # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env
# Edit .env and add your TMDB API key
```

### 3. Add environment variables
Create `.env` in the root folder:
```
TMDB_API_KEY=your_tmdb_api_key_here
SECRET_KEY=your_django_secret_key_here
DEBUG=True
```

### 4. Download dataset
Download from Kaggle: [TMDB 5000 Movie Dataset](https://www.kaggle.com/datasets/tmdb/tmdb-movie-metadata)

Place files in `data/` folder:
```
data/
├── tmdb_5000_movies.csv
└── tmdb_5000_credits.csv
```

### 5. Run migrations and load data
```bash
python manage.py makemigrations
python manage.py migrate
python manage.py load_movies
python manage.py createsuperuser
```

### 6. Start Django backend
```bash
python manage.py runserver
# Backend runs at http://localhost:8000
```

### 7. Frontend setup
```bash
cd frontend
npm install

# Create frontend .env
echo "VITE_API_BASE_URL=http://localhost:8000/api" > .env
echo "VITE_TMDB_IMG_URL=https://image.tmdb.org/t/p/w500" >> .env
echo "VITE_TMDB_IMG_THUMB=https://image.tmdb.org/t/p/w300" >> .env

npm run dev
# Frontend runs at http://localhost:5173
```

---

## 🔌 API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register/` | Create account |
| POST | `/api/auth/login/` | Get JWT token |
| POST | `/api/auth/refresh/` | Refresh token |
| GET | `/api/auth/profile/` | Current user |

### Movies
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/movies/` | List / search movies |
| GET | `/api/movies/trending/` | Weekly trending |
| GET | `/api/movies/now-playing/` | Now in cinemas |
| GET | `/api/movies/top-rated/` | Top rated |
| GET | `/api/movies/:id/` | Movie detail |

### Recommendations
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/recommend/:id/` | AI + TMDB recommendations |

### Ratings
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/ratings/` | Rate a movie |
| GET | `/api/ratings/mine/` | My ratings |

---

## 🤖 How the ML Engine Works

### Content-Based Filtering
- Combines movie **genres + cast + overview** into a text "soup"
- Builds a **TF-IDF matrix** from the soup
- Uses **cosine similarity** to find similar movies
- Works without any user history

### Collaborative Filtering
- Builds a **user-movie rating matrix**
- Applies **SVD (matrix factorization)** to find latent factors
- Predicts ratings for movies the user hasn't seen
- Improves as more users rate movies

### Combined Recommender
```
User clicks a movie
        ↓
Content-based → similar movies by genre/cast
        +
Collaborative → movies liked by similar users
        +
TMDB Similar → live similar movies from TMDB
        ↓
Combined recommendation list
```

---

## 🔑 Environment Variables

### Backend `.env`
```
TMDB_API_KEY=your_tmdb_api_key
SECRET_KEY=your_django_secret_key
DEBUG=True
DATABASE_URL=your_postgres_url     # production only
ALLOWED_HOSTS=your-domain.com      # production only
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

### Frontend `.env`
```
VITE_API_BASE_URL=http://localhost:8000/api
VITE_TMDB_IMG_URL=https://image.tmdb.org/t/p/w500
VITE_TMDB_IMG_THUMB=https://image.tmdb.org/t/p/w300
```

---

## 📦 Deployment

### Backend → Render
1. Connect GitHub repo to Render
2. Set build command: `pip install -r requirements.txt && python manage.py migrate && python manage.py collectstatic --noinput`
3. Set start command: `gunicorn backend.wsgi:application`
4. Add environment variables
5. Add PostgreSQL database

### Frontend → Vercel
1. Connect GitHub repo to Vercel
2. Set root directory: `frontend`
3. Set build command: `npm run build`
4. Add environment variables

---

## 📸 Screenshots

> Add your screenshots here after deployment

---

## 🙌 Acknowledgements

- [TMDB](https://www.themoviedb.org/) — Movie data and live API
- [Kaggle TMDB Dataset](https://www.kaggle.com/datasets/tmdb/tmdb-movie-metadata) — Training data
- [scikit-learn](https://scikit-learn.org/) — ML algorithms
- [Django REST Framework](https://www.django-rest-framework.org/) — API framework

---

## 👨‍💻 Author

**Tharanitharan**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [your-linkedin](https://linkedin.com/in/yourprofile)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
