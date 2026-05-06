/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react'
import { fetchMovies, fetchTrending, fetchNowPlaying, fetchTopRated } from '../services/api'
import MovieCard from '../components/MovieCard'
import SearchBar from '../components/SearchBar'
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
    <div className="space-y-16 pt-10">
      <section className="relative overflow-hidden rounded-[3rem] border border-white/5 bg-slate-900/40 p-8 shadow-2xl backdrop-blur-3xl sm:p-16 lg:p-20">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-fuchsia-500/5 to-cyan-500/10 mix-blend-overlay"></div>
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-indigo-500/20 blur-[100px] animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-fuchsia-500/20 blur-[100px] animate-blob" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative mx-auto max-w-4xl space-y-8 text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-300 backdrop-blur-md">
            <Sparkles className="h-4 w-4" />
            <span>Smart Movie Discovery</span>
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-white sm:text-7xl lg:text-8xl drop-shadow-lg">
            Find movies that fit your <span className="text-gradient">mood</span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg leading-relaxed text-slate-300 sm:text-xl">
            Explore trending titles, search the catalogue, and get personalized recommendations based on intelligent content signals.
          </p>
        </div>
      </section>

      <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <SearchBar onSearch={setSearchTerm} />
      </div>

      <section className="space-y-6 animate-slide-up" style={{ animationDelay: '0.3s' }}>
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="rounded-xl bg-indigo-500/20 p-2 text-indigo-400">
            <TrendingUp className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Trending Now</h2>
            <p className="text-sm text-slate-400">Popular picks from the latest signals.</p>
          </div>
        </div>

        {loadingTrending ? (
          <div className="glass-panel p-8 text-center text-slate-400 rounded-[2rem]">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 font-medium">Loading trending movies...</p>
          </div>
        ) : trending.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {trending.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="glass-panel p-8 text-center text-slate-400 rounded-[2rem]">
            No trending movies available.
          </div>
        )}
      </section>

      <section className="space-y-6 animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="rounded-xl bg-fuchsia-500/20 p-2 text-fuchsia-400">
            <Film className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white tracking-tight">{searchTerm ? 'Search Results' : 'All Movies'}</h2>
            <p className="text-sm text-slate-400">
              {searchTerm ? `Showing matches for "${searchTerm}"` : 'Browse the complete catalogue.'}
            </p>
          </div>
        </div>

        {loadingMovies ? (
          <div className="glass-panel p-8 text-center text-slate-400 rounded-[2rem]">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-fuchsia-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
            <p className="mt-4 font-medium">Loading movies...</p>
          </div>
        ) : movies.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="glass-panel p-8 text-center text-slate-400 rounded-[2rem]">
            No movies found.
          </div>
        )}
      </section>
    </div>
  )
}