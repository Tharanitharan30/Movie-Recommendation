/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import RatingWidget from '../components/RatingWidget'
import RecommendationRow from '../components/RecommendationRow'
import api from '../services/api'

function getPosterUrl(posterPath) {
  if (!posterPath) {
    return null
  }

  if (posterPath.startsWith('http')) {
    return posterPath
  }

  return `https://image.tmdb.org/t/p/w300${posterPath}`
}

export default function MovieDetailPage() {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    setLoading(true)
    api
      .get(`/movies/${id}/`)
      .then(({ data }) => {
        if (active) {
          setMovie(data)
        }
      })
      .catch(() => {
        if (active) {
          setMovie(null)
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [id])

  if (loading) {
    return <div className="rounded-3xl border border-white/10 bg-gray-900/80 p-6 text-sm text-gray-400">Loading movie details...</div>
  }

  if (!movie) {
    return (
      <div className="rounded-3xl border border-white/10 bg-gray-900/80 p-6 text-sm text-gray-300">
        Movie not found. <Link to="/" className="text-indigo-300 hover:text-indigo-200">Return home</Link>
      </div>
    )
  }

  const posterUrl = getPosterUrl(movie.poster_path)

  return (
    <div className="space-y-10">
      <section className="grid gap-8 rounded-[2rem] border border-white/10 bg-gradient-to-br from-gray-900 via-gray-950 to-indigo-950/40 p-6 shadow-2xl shadow-black/25 lg:grid-cols-[320px_minmax(0,1fr)] lg:p-8">
        <div className="overflow-hidden rounded-[1.75rem] border border-white/10 bg-gray-800 shadow-xl shadow-black/20">
          {posterUrl ? (
            <img src={posterUrl} alt={movie.title} className="h-full w-full object-cover" />
          ) : (
            <div className="flex min-h-[480px] items-center justify-center bg-gray-800 text-gray-400">Poster unavailable</div>
          )}
        </div>

        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400">
              <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-indigo-200 ring-1 ring-inset ring-indigo-400/20">
                {Number(movie.vote_average || 0).toFixed(1)} rating
              </span>
              {movie.release_date ? <span>{movie.release_date}</span> : null}
              {movie.vote_count ? <span>{movie.vote_count} votes</span> : null}
            </div>
            <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">{movie.title}</h1>
          </div>

          <div className="flex flex-wrap gap-2">
            {(movie.genres || []).map((genre) => (
              <span
                key={genre}
                className="rounded-full bg-white/5 px-3 py-1.5 text-sm font-medium text-gray-300 ring-1 ring-inset ring-white/10"
              >
                {genre}
              </span>
            ))}
          </div>

          <p className="max-w-3xl text-base leading-8 text-gray-300 sm:text-lg">{movie.overview || 'No overview available.'}</p>

          <RatingWidget movieId={movie.id} />
        </div>
      </section>

      <RecommendationRow movieId={movie.id} />
    </div>
  )
}