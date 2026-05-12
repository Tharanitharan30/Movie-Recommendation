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
    <div className="relative mx-auto w-full max-w-2xl">
      <div className="relative flex items-center">
        <div className="pointer-events-none absolute left-4 flex items-center text-slate-400">
          <Search className="h-5 w-5" />
        </div>
        <input
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-300 bg-white py-3 pl-12 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-4 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-400 dark:focus:ring-slate-700"
        />
      </div>
    </div>
  )
}