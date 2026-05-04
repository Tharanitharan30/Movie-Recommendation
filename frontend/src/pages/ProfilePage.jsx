/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react'
import MovieCard from '../components/MovieCard'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

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
    <div className="space-y-8">
      <section className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-gray-900 via-gray-950 to-indigo-950/40 p-6 shadow-2xl shadow-black/25 sm:p-8">
        <h1 className="text-4xl font-semibold text-white">Profile</h1>
        <p className="mt-3 text-gray-300">
          Signed in as <span className="font-semibold text-indigo-200">{user?.username}</span>
        </p>
        {user?.email ? <p className="mt-1 text-sm text-gray-400">{user.email}</p> : null}
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-2xl font-semibold text-white">My ratings</h2>
          <p className="mt-1 text-sm text-gray-400">Movies you have rated from this account.</p>
        </div>

        {loading ? (
          <div className="rounded-3xl border border-white/10 bg-gray-900/80 p-6 text-sm text-gray-400">Loading your ratings...</div>
        ) : ratings.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {ratings.map((rating) => (
              <div key={rating.movie_id} className="space-y-3 rounded-3xl border border-white/10 bg-gray-900/80 p-4 shadow-lg shadow-black/20">
                <MovieCard
                  movie={{
                    id: rating.movie_id,
                    title: rating.title,
                    poster_path: rating.poster_path,
                    vote_average: rating.score,
                    genres: [],
                  }}
                />
                <div className="px-1 text-sm text-gray-300">
                  Your score: <span className="font-semibold text-amber-300">{rating.score} / 5</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-gray-900/80 p-6 text-sm text-gray-400">
            You have not rated any movies yet.
          </div>
        )}
      </section>
    </div>
  )
}