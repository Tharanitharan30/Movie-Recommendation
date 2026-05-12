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
      <div className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition group-hover:-translate-y-1 group-hover:shadow-md group-focus-visible:ring-2 group-focus-visible:ring-slate-500 group-focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-900 dark:group-focus-visible:ring-slate-300 dark:group-focus-visible:ring-offset-slate-950">
        <div className="aspect-[2/3] w-full overflow-hidden">
          <img
            src={poster}
            alt={movie.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => { e.currentTarget.src = FALLBACK(movie.title) }}
          />
        </div>

        <div className="space-y-3 p-4">
          <h3 className="line-clamp-2 text-base font-bold leading-tight text-slate-900 dark:text-slate-100">{movie.title}</h3>

          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1 rounded-full bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-700">
              <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
              {Number(movie.vote_average || 0).toFixed(1)}
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {(movie.genres || []).slice(0, 2).map((g, i) => (
              <span key={i} className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-medium text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                {g.name || g}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}