/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react'
import MovieCard from '../components/MovieCard'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { User, Mail, Star, Film } from 'lucide-react'

export default function ProfilePage() {
  const { user } = useAuth()
  const [ratings, setRatings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    setLoading(true)
    api
      .get('/ratings/mine/')
      .then(({ data }) => {
        if (active) {
          setRatings(data)
        }
      })
      .catch(() => {
        if (active) {
          setRatings([])
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
  }, [])

  return (
    <div className="space-y-10 pt-8">
      <section className="surface-card p-8 sm:p-10">
        <div className="flex flex-col items-center gap-6 md:flex-row">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl bg-slate-900 dark:bg-slate-100">
            <User className="h-12 w-12 text-white dark:text-slate-900" />
          </div>
          
          <div className="space-y-2 text-center md:text-left">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl">
              {user?.username}
            </h1>
            {user?.email && (
              <p className="flex items-center justify-center gap-2 text-base text-slate-600 dark:text-slate-300 md:justify-start">
                <Mail className="h-5 w-5 text-slate-500 dark:text-slate-400" />
                {user.email}
              </p>
            )}
            <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-1.5 text-sm font-semibold tracking-wide text-slate-700 dark:bg-slate-800 dark:text-slate-300">
              <Film className="h-4 w-4" />
              <span>{ratings.length} Movies Rated</span>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4 dark:border-slate-700">
          <div className="rounded-lg bg-slate-100 p-2 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <Star className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight dark:text-slate-100">My Ratings</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Movies you have rated from this account.</p>
          </div>
        </div>

        {loading ? (
          <div className="surface-card p-12 text-center text-slate-500 dark:text-slate-300">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-slate-400 border-r-transparent align-[-0.125em] dark:border-slate-300"></div>
            <p className="mt-4 font-medium">Loading your movie history...</p>
          </div>
        ) : ratings.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {ratings.map((rating) => (
              <div key={rating.movie_id} className="group relative flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md dark:border-slate-700 dark:bg-slate-900">
                <div className="p-3">
                  <MovieCard
                    movie={{
                      id: rating.movie_id,
                      title: rating.title,
                      poster_path: rating.poster_path,
                      vote_average: rating.score,
                      genres: [],
                    }}
                  />
                </div>
                <div className="mt-auto border-t border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Your Rating</span>
                    <span className="flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-sm font-bold text-amber-700">
                      <Star className="h-4 w-4 fill-amber-500 text-amber-500" />
                      {rating.score} / 5
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="surface-card p-12 text-center text-slate-500 dark:text-slate-300">
            <Star className="mx-auto mb-4 h-12 w-12 text-slate-400 dark:text-slate-500" />
            <p className="text-lg">You have not rated any movies yet.</p>
          </div>
        )}
      </section>
    </div>
  )
}