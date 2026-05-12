/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import RatingWidget from '../components/RatingWidget'
import RecommendationRow from '../components/RecommendationRow'
import { fetchMovieDetail } from '../services/api'
import { Star, Clock, Calendar, ArrowLeft, PlayCircle } from 'lucide-react'

const TMDB_IMG = import.meta.env.VITE_TMDB_IMG_URL || 'https://image.tmdb.org/t/p/w500'
const TMDB_BACKDROP = 'https://image.tmdb.org/t/p/original'

function posterUrl(path, title) {
  if (!path) return `https://placehold.co/500x750/0f172a/ffffff?text=${encodeURIComponent(title)}`
  if (path.startsWith('http')) return path
  return `${TMDB_IMG}${path}`
}

function backdropUrl(path) {
  if (!path) return null
  if (path.startsWith('http')) return path
  return `${TMDB_BACKDROP}${path}`
}

export default function MovieDetailPage() {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchMovieDetail(id)
      .then(({ data }) => setMovie(data))
      .catch(() => setMovie(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-slate-600 dark:text-slate-300">
        <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-current border-r-transparent"></div>
        <p className="font-medium">Loading movie details...</p>
      </div>
    </div>
  )
  
  if (!movie) return (
    <div className="surface-card mt-10 rounded-2xl p-10 text-center">
      <h2 className="mb-4 text-2xl font-bold text-slate-900 dark:text-slate-100">Movie not found.</h2>
      <Link to="/" className="inline-flex items-center gap-2 font-semibold text-slate-700 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
        <ArrowLeft className="h-5 w-5" /> Return to discovery
      </Link>
    </div>
  )

  const poster = posterUrl(movie.poster_path, movie.title)
  const director = (movie.credits && movie.credits.crew || []).find((c) => c.job === 'Director')
  const trailerKey = movie.trailer || (movie.videos && movie.videos.results && movie.videos.results[0] && movie.videos.results[0].key)

  return (
    <div className="space-y-10 pt-8">
      <Link to="/" className="inline-flex items-center gap-2 font-semibold text-slate-600 transition-colors hover:text-slate-900 dark:text-slate-300 dark:hover:text-white">
        <ArrowLeft className="h-5 w-5" /> Back to Movies
      </Link>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <div className="grid lg:grid-cols-[380px_minmax(0,1fr)]">
          <div className="relative bg-slate-100 dark:bg-slate-800">
            <img src={poster} alt={movie.title} className="w-full h-full object-cover lg:absolute lg:inset-0" />
          </div>

          <div className="flex flex-col justify-center space-y-8 p-8 lg:p-12">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                <span className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-amber-700">
                  <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                  {Number(movie.vote_average || 0).toFixed(1)} Rating
                </span>
                {movie.release_date && (
                  <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <Calendar className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                    {movie.release_date.split('-')[0]}
                  </span>
                )}
                {movie.runtime && (
                  <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                    <Clock className="h-4 w-4 text-slate-500 dark:text-slate-400" />
                    {movie.runtime} min
                  </span>
                )}
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">{movie.title}</h1>
              {director && <p className="text-lg font-medium text-slate-600 dark:text-slate-300">Directed by {director.name}</p>}
            </div>

            <div className="flex flex-wrap gap-2">
              {(movie.genres || []).map((g) => (
                <span key={g.id || g} className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {g.name || g}
                </span>
              ))}
            </div>

            <p className="max-w-3xl text-base leading-relaxed text-slate-600 dark:text-slate-300">{movie.overview || 'No overview available.'}</p>

            <div className="border-t border-slate-200 pt-4 dark:border-slate-700">
              <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Rate this movie</h3>
              <RatingWidget movieId={movie.id} />
            </div>

            {trailerKey && (
              <div className="pt-6">
                <h3 className="mb-4 flex items-center gap-2 text-xl font-semibold text-slate-900 dark:text-slate-100">
                  <PlayCircle className="h-6 w-6 text-slate-700 dark:text-slate-300" /> Official Trailer
                </h3>
                <div className="overflow-hidden rounded-xl border border-slate-200 shadow-sm dark:border-slate-700">
                  <div className="aspect-video w-full">
                    <iframe
                      title="trailer"
                      src={`https://www.youtube.com/embed/${trailerKey}`}
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <div>
        <RecommendationRow movieId={movie.id} />
      </div>
    </div>
  )
}