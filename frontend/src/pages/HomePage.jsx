/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react'
import { fetchMovies, fetchTrending, fetchNowPlaying, fetchTopRated } from '../services/api'
import MovieCard from '../components/MovieCard'
import SearchBar from '../components/SearchBar'

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [movies, setMovies] = useState([])
  const [trending, setTrending] = useState([])
  const [loadingMovies, setLoadingMovies] = useState(true)
  const [loadingTrending, setLoadingTrending] = useState(true)

  useEffect(() => {
    fetchTrending().then(r => setTrending(r.data)).catch(() => setTrending([])).finally(() => setLoadingTrending(false))
  }, [])

  useEffect(() => {
    fetchMovies(searchTerm).then(r => setMovies(r.data)).catch(() => setMovies([])).finally(() => setLoadingMovies(false))
  }, [searchTerm])

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-gray-900 via-gray-950 to-indigo-950/60 px-6 py-10 shadow-2xl shadow-black/30 sm:px-10 sm:py-14">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(99,102,241,0.22),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.18),transparent_28%)]" />
        <div className="relative max-w-3xl space-y-5">
          <span className="inline-flex rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-indigo-200">
            Smart movie discovery
          </span>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
            Find movies that fit your mood, not just your search query.
          </h1>
          <p className="max-w-2xl text-base leading-7 text-gray-300 sm:text-lg">
            Explore trending titles, search the catalogue, rate movies, and get recommendations based on content and
            collaborative signals.
          </p>
        </div>
      </section>

      <SearchBar onSearch={setSearchTerm} />

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">Trending now</h2>
            <p className="mt-1 text-sm text-gray-400">Popular picks from the latest usage signals.</p>
          </div>
        </div>

        {loadingTrending ? (
          <div className="rounded-3xl border border-white/10 bg-gray-900/80 p-6 text-sm text-gray-400">
            Loading trending movies...
          </div>
        ) : trending.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {trending.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-gray-900/80 p-6 text-sm text-gray-400">
            No trending movies available.
          </div>
        )}
      </section>

      <section className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">{searchTerm ? 'Search results' : 'All movies'}</h2>
            <p className="mt-1 text-sm text-gray-400">
              {searchTerm ? `Showing matches for ${searchTerm}` : 'Browse the movie catalogue.'}
            </p>
          </div>
        </div>

        {loadingMovies ? (
          <div className="rounded-3xl border border-white/10 bg-gray-900/80 p-6 text-sm text-gray-400">
            Loading movies...
          </div>
        ) : movies.length ? (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-white/10 bg-gray-900/80 p-6 text-sm text-gray-400">
            No movies found.
          </div>
        )}
      </section>
    </div>
  )
}