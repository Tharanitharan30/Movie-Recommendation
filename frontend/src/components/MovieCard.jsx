import { Link } from 'react-router-dom'

function getPosterUrl(posterPath) {
  if (!posterPath) {
    return null
  }

  if (posterPath.startsWith('http')) {
    return posterPath
  }

  return `https://image.tmdb.org/t/p/w300${posterPath}`
}

export default function MovieCard({ movie }) {
  const posterUrl = getPosterUrl(movie.poster_path)

  return (
    <Link
      to={`/movies/${movie.id}`}
      className="group overflow-hidden rounded-3xl border border-white/10 bg-gray-900/80 shadow-lg shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-indigo-400/40 hover:shadow-indigo-950/30"
    >
      <div className="aspect-[2/3] w-full overflow-hidden bg-gray-800">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={movie.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-950 px-4 text-center text-sm text-gray-400">
            Poster unavailable
          </div>
        )}
      </div>

      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="line-clamp-2 text-base font-semibold text-white transition group-hover:text-indigo-200">
            {movie.title}
          </h3>
          <span className="shrink-0 rounded-full bg-indigo-500/15 px-2.5 py-1 text-xs font-semibold text-indigo-200 ring-1 ring-inset ring-indigo-400/20">
            {Number(movie.vote_average || 0).toFixed(1)}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {(movie.genres || []).slice(0, 3).map((genre) => (
            <span
              key={genre}
              className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] font-medium text-gray-300 ring-1 ring-inset ring-white/10"
            >
              {genre}
            </span>
          ))}
        </div>
      </div>
    </Link>
  )
}