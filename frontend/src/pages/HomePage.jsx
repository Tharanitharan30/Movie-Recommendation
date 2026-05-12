/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react'
import { fetchMovies, fetchTrending } from '../services/api'
import MovieCard from '../components/MovieCard'
import SearchBar from '../components/SearchBar'
import { MovieGridSkeleton } from '../components/Skeletons'
import { Sparkles, TrendingUp, Film } from 'lucide-react'

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
    <div className="space-y-12 pt-8">
      <section className="surface-card p-8 sm:p-12">
        <div className="mx-auto max-w-4xl space-y-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-blue-700 dark:border-blue-500/30 dark:bg-blue-500/15 dark:text-blue-200">
            <Sparkles className="h-4 w-4" />
            <span>Smart Movie Discovery</span>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:text-5xl lg:text-6xl">
            Find movies that fit your mood
          </h1>
          <p className="mx-auto max-w-2xl text-base leading-relaxed text-slate-600 dark:text-slate-300 sm:text-lg">
            Explore trending titles, search the catalogue, and get personalized recommendations based on intelligent content signals.
          </p>
        </div>
      </section>

      <div>
        <SearchBar onSearch={setSearchTerm} />
      </div>

      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4 dark:border-slate-700">
          <div className="rounded-lg bg-slate-100 p-2 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight dark:text-slate-100">Trending Now</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Popular picks from the latest signals.</p>
          </div>
        </div>

        {loadingTrending ? (
          <MovieGridSkeleton count={5} />
        ) : trending.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {trending.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="surface-card p-8 text-center text-slate-500 dark:text-slate-300">
            No trending movies available.
          </div>
        )}
      </section>

      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-slate-200 pb-4 dark:border-slate-700">
          <div className="rounded-lg bg-slate-100 p-2 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
            <Film className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight dark:text-slate-100">{searchTerm ? 'Search Results' : 'All Movies'}</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {searchTerm ? `Showing matches for "${searchTerm}"` : 'Browse the complete catalogue.'}
            </p>
          </div>
        </div>

        {loadingMovies ? (
          <MovieGridSkeleton count={8} />
        ) : movies.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="surface-card p-8 text-center text-slate-500 dark:text-slate-300">
            No movies found.
          </div>
        )}
      </section>
    </div>
  )
}