/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react'
import api from '../services/api'
import MovieCard from './MovieCard'

export default function RecommendationRow({ movieId }) {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!movieId) {
      return undefined
    }

    let active = true

    setLoading(true)
    api
      .get(`/recommend/${movieId}/`)
      .then(({ data }) => {
        if (active) {
          setRecommendations(data.content_based || [])
        }
      })
      .catch(() => {
        if (active) {
          setRecommendations([])
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
  }, [movieId])

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">Recommended for you</h2>
          <p className="mt-1 text-sm text-gray-400">Content-based matches derived from this movie.</p>
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-white/10 bg-gray-900/80 p-6 text-sm text-gray-400">
          Loading recommendations...
        </div>
      ) : recommendations.length ? (
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {recommendations.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl border border-white/10 bg-gray-900/80 p-6 text-sm text-gray-400">
          No recommendations available right now.
        </div>
      )}
    </section>
  )
}