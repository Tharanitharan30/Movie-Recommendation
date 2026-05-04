import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
})

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token') || localStorage.getItem('accessToken')
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const fetchMovies = (q = '') => API.get(`/movies/${q ? `?q=${encodeURIComponent(q)}` : ''}`)
export const fetchMovieDetail = (id) => API.get(`/movies/${id}/`)
export const fetchTrending = () => API.get('/movies/trending/')
export const fetchNowPlaying = () => API.get('/movies/now-playing/')
export const fetchTopRated = () => API.get('/movies/top-rated/')
export const fetchRecommend = (id) => API.get(`/recommend/${id}/`)
export const rateMovie = (movie_id, score) => API.post('/ratings/', { movie_id, score })
export const fetchMyRatings = () => API.get('/ratings/mine/')
export const login = (data) => API.post('/auth/login/', data)
export const register = (data) => API.post('/auth/register/', data)
export const fetchProfile = () => API.get('/auth/profile/')

export default API