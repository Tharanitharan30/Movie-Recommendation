import { Link } from 'react-router-dom'

const TMDB_THUMB = import.meta.env.VITE_TMDB_IMG_THUMB
const FALLBACK = (title) =>
  `https://placehold.co/300x450/1f2937/6366f1?text=${encodeURIComponent(title)}`

export default function MovieCard({ movie }) {
  const poster = movie.poster_path && movie.poster_path !== 'N/A'
    ? (movie.poster_path.startsWith('http') ? movie.poster_path : `${TMDB_THUMB}${movie.poster_path}`)
    : FALLBACK(movie.title)

  return (
    <Link to={`/movies/${movie.id}`} className="group">
      <div className="bg-gray-800 rounded-xl overflow-hidden hover:scale-105 transition-transform cursor-pointer">
        <img
          src={poster}
          alt={movie.title}
          className="w-full h-64 object-cover"
          onError={(e) => { e.currentTarget.src = FALLBACK(movie.title) }}
        />
        <div className="p-3">
          <h3 className="text-white font-semibold truncate">{movie.title}</h3>
          <p className="text-yellow-400 text-sm">⭐ {Number(movie.vote_average || 0).toFixed(1)}</p>
          <div className="flex flex-wrap gap-1 mt-1">
            {(movie.genres || []).slice(0, 2).map((g, i) => (
              <span key={i} className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full">
                {g.name || g}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  )
}