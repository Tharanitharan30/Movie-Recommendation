import { useEffect, useState } from 'react'
import { Search } from 'lucide-react'

export default function SearchBar({ onSearch, placeholder = 'Search movies, genres, or titles...' }) {
  const [value, setValue] = useState('')

  useEffect(() => {
    const timer = window.setTimeout(() => {
      onSearch(value.trim())
    }, 400)

    return () => window.clearTimeout(timer)
  }, [onSearch, value])

  return (
    <div className="relative group max-w-2xl mx-auto w-full">
      <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-cyan-500 opacity-20 blur transition duration-500 group-focus-within:opacity-60"></div>
      <div className="relative flex items-center">
        <div className="pointer-events-none absolute left-4 flex items-center text-slate-400 group-focus-within:text-cyan-300 transition-colors duration-300">
          <Search className="h-5 w-5" />
        </div>
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-full border border-white/10 bg-slate-900/60 backdrop-blur-md py-4 pl-12 pr-4 text-sm text-white outline-none transition-all duration-300 placeholder:text-slate-500 focus:border-transparent focus:bg-slate-900/80 shadow-lg"
        />
      </div>
    </div>
  )
}