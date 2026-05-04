/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react'
import { fetchRecommend } from '../services/api'
import MovieCard from './MovieCard'

export default function RecommendationRow({ movieId }) {
  const [tmdbSimilar, setTmdbSimilar] = useState([])
  const [mlBased, setMlBased] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!movieId) return undefined
    setLoading(true)
    fetchRecommend(movieId)
      .then(({ data }) => {
        setTmdbSimilar(data.tmdb_similar || [])
        setMlBased(data.ml_based || data.content_based || [])
      })
      .catch(() => {
        setTmdbSimilar([])
        setMlBased([])
      })
      .finally(() => setLoading(false))
  }, [movieId])

  return (
    <section className="space-y-4">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">Recommended for you</h2>
          <p className="mt-1 text-sm text-gray-400">Suggestions from TMDB and our recommendation engine.</p>
        </div>
      </div>

      {loading ? (
        <div className="rounded-3xl border border-white/10 bg-gray-900/80 p-6 text-sm text-gray-400">Loading recommendations...</div>
      ) : (
        <>
          {tmdbSimilar.length ? (
            <div>
              <h3 className="text-lg text-gray-300">Similar (TMDB)</h3>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4 mt-3">
                {tmdbSimilar.map((m) => <MovieCard key={m.id} movie={m} />)}
              </div>
            </div>
          ) : null}

          {mlBased.length ? (
            <div className="mt-6">
              <h3 className="text-lg text-gray-300">Content-based (ML)</h3>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4 mt-3">
                {mlBased.map((m) => <MovieCard key={m.id} movie={m} />)}
              </div>
            </div>
          ) : null}

          {!tmdbSimilar.length && !mlBased.length && (
            <div className="rounded-3xl border border-white/10 bg-gray-900/80 p-6 text-sm text-gray-400">No recommendations available right now.</div>
          )}
        </>
      )}
    </section>
  )
}