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
    <div className="space-y-12 animate-fade-in pt-10">
      <section className="glass-panel relative overflow-hidden rounded-[3rem] p-8 sm:p-12 shadow-2xl bg-slate-900/40 backdrop-blur-3xl border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-fuchsia-500/5 to-cyan-500/10 mix-blend-overlay"></div>
        <div className="absolute -top-40 -right-40 h-[400px] w-[400px] rounded-full bg-indigo-500/20 blur-[100px] animate-blob"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
          <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-[2rem] bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-cyan-500 shadow-xl shadow-indigo-500/20">
            <User className="h-14 w-14 text-white" />
          </div>
          
          <div className="space-y-3 text-center md:text-left">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl drop-shadow-md">
              {user?.username}
            </h1>
            {user?.email && (
              <p className="flex items-center justify-center md:justify-start gap-2 text-lg text-slate-300">
                <Mail className="h-5 w-5 text-indigo-400" />
                {user.email}
              </p>
            )}
            <div className="inline-flex items-center gap-2 mt-2 rounded-full border border-fuchsia-400/20 bg-fuchsia-500/10 px-4 py-1.5 text-sm font-semibold tracking-wide text-fuchsia-300">
              <Film className="h-4 w-4" />
              <span>{ratings.length} Movies Rated</span>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="rounded-xl bg-yellow-500/20 p-2 text-yellow-400">
            <Star className="h-6 w-6 fill-yellow-400" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">My Ratings</h2>
            <p className="text-sm text-slate-400">Movies you have rated from this account.</p>
          </div>
        </div>

        {loading ? (
          <div className="glass-panel p-12 text-center text-slate-400 rounded-[2rem]">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 font-medium">Loading your cinematic history...</p>
          </div>
        ) : ratings.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {ratings.map((rating) => (
              <div key={rating.movie_id} className="group relative flex flex-col overflow-hidden rounded-[2rem] glass-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10">
                <div className="p-3">
                  <MovieCard
                    movie={{
                      id: rating.movie_id,
                      title: rating.title,
                      poster_path: rating.poster_path,
                      vote_average: rating.score, // this will be overridden visually but good for fallback
                      genres: [],
                    }}
                  />
                </div>
                <div className="mt-auto border-t border-white/5 bg-slate-900/50 p-4 backdrop-blur-md">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-400">Your Rating</span>
                    <span className="flex items-center gap-1.5 rounded-full bg-yellow-500/20 px-3 py-1 text-sm font-bold text-yellow-400 ring-1 ring-inset ring-yellow-500/30">
                      <Star className="h-4 w-4 fill-yellow-400" />
                      {rating.score} / 5
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel p-12 text-center text-slate-400 rounded-[2rem]">
            <Star className="mx-auto h-12 w-12 text-slate-600 mb-4" />
            <p className="text-lg">You have not rated any movies yet.</p>
          </div>
        )}
      </section>
    </div>
  )
}