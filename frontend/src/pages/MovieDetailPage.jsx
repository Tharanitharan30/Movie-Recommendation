/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import RatingWidget from '../components/RatingWidget'
import RecommendationRow from '../components/RecommendationRow'
import { fetchMovieDetail } from '../services/api'

const TMDB_IMG = import.meta.env.VITE_TMDB_IMG_URL

function posterUrl(path, title) {
  if (!path) return `https://placehold.co/500x750/0f172a/ffffff?text=${encodeURIComponent(title)}`
  if (path.startsWith('http')) return path
  return `${TMDB_IMG}${path}`
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

  if (loading) return <div className="rounded-3xl border border-white/10 bg-gray-900/80 p-6 text-sm text-gray-400">Loading movie details...</div>
  if (!movie) return (
    <div className="rounded-3xl border border-white/10 bg-gray-900/80 p-6 text-sm text-gray-300">
      Movie not found. <Link to="/" className="text-indigo-300 hover:text-indigo-200">Return home</Link>
    </div>
  )

  const poster = posterUrl(movie.poster_path, movie.title)
  const director = (movie.credits && movie.credits.crew || []).find((c) => c.job === 'Director')
  const trailerKey = movie.trailer || (movie.videos && movie.videos.results && movie.videos.results[0] && movie.videos.results[0].key)

  return (
    <div className="space-y-10">
      <section className="grid gap-8 rounded-[2rem] border border-white/10 bg-gradient-to-br from-gray-900 via-gray-950 to-indigo-950/40 p-6 shadow-2xl shadow-black/25 lg:grid-cols-[320px_minmax(0,1fr)] lg:p-8">
        <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-gray-800 shadow-xl shadow-black/20">
          <img src={poster} alt={movie.title} className="h-full w-full object-cover" />
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
              <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-indigo-200 ring-1 ring-inset ring-indigo-400/20">{Number(movie.vote_average || 0).toFixed(1)} rating</span>
              {movie.release_date ? <span>{movie.release_date}</span> : null}
              {movie.runtime ? <span>{movie.runtime} min</span> : null}
            </div>

            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">{movie.title}</h1>
            {director ? <p className="text-sm text-gray-400">Directed by {director.name}</p> : null}
          </div>

          <div className="flex flex-wrap gap-2">
            {(movie.genres || []).map((g) => (
              <span key={g.id || g} className="rounded-full bg-white/5 px-3 py-1.5 text-sm font-medium text-gray-300 ring-1 ring-inset ring-white/10">{g.name || g}</span>
            ))}
          </div>

          <p className="max-w-3xl text-base leading-8 text-gray-300 sm:text-lg">{movie.overview || 'No overview available.'}</p>

          <RatingWidget movieId={movie.id} />

          {trailerKey ? (
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-white">Trailer</h3>
              <div className="mt-2 aspect-video w-full">
                <iframe
                  title="trailer"
                  src={`https://www.youtube.com/embed/${trailerKey}`}
                  allowFullScreen
                  className="w-full h-full rounded-lg"
                />
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <RecommendationRow movieId={movie.id} />
    </div>
  )
}