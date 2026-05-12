/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react'
import { fetchRecommend } from '../services/api'
import MovieCard from './MovieCard'
import { MovieGridSkeleton } from './Skeletons'

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
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Recommended for you</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Suggestions from TMDB and our recommendation engine.</p>
        </div>
      </div>

      {loading ? (
        <MovieGridSkeleton count={4} />
      ) : (
        <>
          {tmdbSimilar.length ? (
            <div>
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">Similar (TMDB)</h3>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4 mt-3">
                {tmdbSimilar.map((m) => <MovieCard key={m.id} movie={m} />)}
              </div>
            </div>
          ) : null}

          {mlBased.length ? (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">Content-based (ML)</h3>
              <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4 mt-3">
                {mlBased.map((m) => <MovieCard key={m.id} movie={m} />)}
              </div>
            </div>
          ) : null}

          {!tmdbSimilar.length && !mlBased.length && (
            <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300">No recommendations available right now.</div>
          )}
        </>
      )}
    </section>
  )
}