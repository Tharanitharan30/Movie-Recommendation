import { useEffect, useState } from 'react'

export default function SearchBar({ onSearch, placeholder = 'Search movies, genres, or titles...' }) {
  const [value, setValue] = useState('')

  useEffect(() => {
    const timer = window.setTimeout(() => {
      onSearch(value.trim())
    }, 400)

    return () => window.clearTimeout(timer)
  }, [onSearch, value])

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-y-0 left-4 flex items-center text-gray-500">
        <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" strokeLinecap="round" />
        </svg>
      </div>
      <input
        value={value}
        onChange={(event) => setValue(event.target.value)}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/10 bg-gray-900/90 py-4 pl-12 pr-4 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/20"
      />
    </div>
  )
}