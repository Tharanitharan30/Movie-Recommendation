import { Link } from 'react-router-dom'
import { Star } from 'lucide-react'

const TMDB_THUMB = import.meta.env.VITE_TMDB_IMG_THUMB || 'https://image.tmdb.org/t/p/w300'
const FALLBACK = (title) =>
  `https://placehold.co/300x450/0f172a/6366f1?text=${encodeURIComponent(title)}`

export default function MovieCard({ movie }) {
  const poster = movie.poster_path && movie.poster_path !== 'N/A'
    ? (movie.poster_path.startsWith('http') ? movie.poster_path : `${TMDB_THUMB}${movie.poster_path}`)
    : FALLBACK(movie.title)

  return (
    <Link to={`/movies/${movie.id}`} className="group relative block w-full outline-none">
      <div className="glass-card relative overflow-hidden rounded-[1.5rem] transition-all duration-500 group-hover:-translate-y-2 group-hover:shadow-[0_20px_40px_-15px_rgba(99,102,241,0.3)] group-focus-visible:ring-2 group-focus-visible:ring-indigo-400 group-focus-visible:ring-offset-2 group-focus-visible:ring-offset-slate-950">
        <div className="aspect-[2/3] w-full overflow-hidden">
          <img
            src={poster}
            alt={movie.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            onError={(e) => { e.currentTarget.src = FALLBACK(movie.title) }}
          />
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-90"></div>
        
        <div className="absolute bottom-0 left-0 right-0 p-5 transition-transform duration-500 translate-y-2 group-hover:translate-y-0">
          <h3 className="text-lg font-bold leading-tight text-white drop-shadow-md line-clamp-2">{movie.title}</h3>
          
          <div className="mt-2 flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full bg-slate-900/60 backdrop-blur-md px-2 py-1 text-xs font-semibold text-yellow-400 ring-1 ring-inset ring-yellow-400/20">
              <Star className="h-3 w-3 fill-yellow-400" />
              {Number(movie.vote_average || 0).toFixed(1)}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2 opacity-0 transition-opacity duration-500 delay-100 group-hover:opacity-100">
            {(movie.genres || []).slice(0, 2).map((g, i) => (
              <span key={i} className="rounded-full bg-indigo-500/20 px-2.5 py-0.5 text-[10px] font-medium tracking-wide text-indigo-200 ring-1 ring-inset ring-indigo-400/30 backdrop-blur-sm uppercase">
                {g.name || g}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}