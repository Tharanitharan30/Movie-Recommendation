/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import RatingWidget from '../components/RatingWidget'
import RecommendationRow from '../components/RecommendationRow'
import { fetchMovieDetail } from '../services/api'
import { Star, Clock, Calendar, ArrowLeft, PlayCircle } from 'lucide-react'

const TMDB_IMG = import.meta.env.VITE_TMDB_IMG_URL || 'https://image.tmdb.org/t/p/w500'
const TMDB_BACKDROP = 'https://image.tmdb.org/t/p/original'

function posterUrl(path, title) {
  if (!path) return `https://placehold.co/500x750/0f172a/ffffff?text=${encodeURIComponent(title)}`
  if (path.startsWith('http')) return path
  return `${TMDB_IMG}${path}`
}

function backdropUrl(path) {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${TMDB_BACKDROP}${path}`;
}

export default function MovieDetailPage() {
  const { id } = useParams()
  const [movie, setMovie] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchMovieDetail(id)
      .then(({ data }) => setMovie(data))
      .catch(() => setMovie(null))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-indigo-400">
        <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-current border-r-transparent"></div>
        <p className="font-medium">Loading cinematic experience...</p>
      </div>
    </div>
  )
  
  if (!movie) return (
    <div className="glass-panel mt-10 p-10 text-center rounded-3xl">
      <h2 className="text-2xl font-bold text-white mb-4">Movie not found.</h2>
      <Link to="/" className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
        <ArrowLeft className="h-5 w-5" /> Return to discovery
      </Link>
    </div>
  )

  const poster = posterUrl(movie.poster_path, movie.title)
  const backdrop = backdropUrl(movie.backdrop_path) || poster
  const director = (movie.credits && movie.credits.crew || []).find((c) => c.job === 'Director')
  const trailerKey = movie.trailer || (movie.videos && movie.videos.results && movie.videos.results[0] && movie.videos.results[0].key)

  return (
    <div className="space-y-12 animate-fade-in relative pt-8">
      {/* Cinematic Backdrop Layer */}
      <div className="fixed inset-0 z-[-1] pointer-events-none">
        <div className="absolute inset-0 bg-slate-950/80 z-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent z-20"></div>
        <img src={backdrop} alt="" className="w-full h-full object-cover opacity-30 blur-2xl transform scale-110" />
      </div>

      <Link to="/" className="inline-flex items-center gap-2 text-slate-400 hover:text-white font-medium transition-colors">
        <ArrowLeft className="h-5 w-5" /> Back to Movies
      </Link>

      <section className="glass-panel overflow-hidden rounded-[2.5rem] border-white/10 shadow-2xl bg-slate-900/40 backdrop-blur-3xl">
        <div className="grid lg:grid-cols-[380px_minmax(0,1fr)]">
          <div className="relative">
            <img src={poster} alt={movie.title} className="w-full h-full object-cover lg:absolute lg:inset-0" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent lg:hidden"></div>
          </div>

          <div className="p-8 lg:p-12 space-y-8 flex flex-col justify-center">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                <span className="flex items-center gap-1.5 rounded-full bg-yellow-500/20 px-3 py-1 text-yellow-400 ring-1 ring-inset ring-yellow-500/30">
                  <Star className="h-4 w-4 fill-yellow-400" />
                  {Number(movie.vote_average || 0).toFixed(1)} Rating
                </span>
                {movie.release_date && (
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    {movie.release_date.split('-')[0]}
                  </span>
                )}
                {movie.runtime && (
                  <span className="flex items-center gap-1.5 text-slate-300">
                    <Clock className="h-4 w-4 text-slate-400" />
                    {movie.runtime} min
                  </span>
                )}
              </div>

              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl drop-shadow-md">{movie.title}</h1>
              {director && <p className="text-lg text-indigo-300 font-medium">Directed by {director.name}</p>}
            </div>

            <div className="flex flex-wrap gap-2">
              {(movie.genres || []).map((g) => (
                <span key={g.id || g} className="rounded-full bg-white/5 px-4 py-1.5 text-sm font-medium tracking-wide text-slate-200 ring-1 ring-inset ring-white/10 uppercase">
                  {g.name || g}
                </span>
              ))}
            </div>

            <p className="max-w-3xl text-lg leading-relaxed text-slate-300">{movie.overview || 'No overview available.'}</p>

            <div className="pt-4 border-t border-white/10">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-4">Rate this movie</h3>
              <RatingWidget movieId={movie.id} />
            </div>

            {trailerKey && (
              <div className="pt-6">
                <h3 className="flex items-center gap-2 text-xl font-semibold text-white mb-4">
                  <PlayCircle className="h-6 w-6 text-fuchsia-400" /> Official Trailer
                </h3>
                <div className="overflow-hidden rounded-2xl shadow-2xl ring-1 ring-white/10">
                  <div className="aspect-video w-full">
                    <iframe
                      title="trailer"
                      src={`https://www.youtube.com/embed/${trailerKey}`}
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <div className="pt-8">
        <RecommendationRow movieId={movie.id} />
      </div>
    </div>
  )
}