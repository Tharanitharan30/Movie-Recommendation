import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Home, User, LogOut, LogIn, UserPlus, Film, Moon, Sun } from 'lucide-react'

export default function Navbar({ theme = 'light', onToggleTheme }) {
  const { user, logout } = useAuth()

  const linkClass = ({ isActive }) =>
    [
      'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition',
      isActive
        ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
    ].join(' ')

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur dark:border-slate-800 dark:bg-slate-950/95">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900">
            <Film className="h-4 w-4" />
          </div>
          <div className="hidden text-base font-extrabold tracking-tight text-slate-900 dark:text-slate-100 sm:block">Movie Radar</div>
        </Link>

        <nav className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onToggleTheme?.()}
            className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
          </button>

          <NavLink to="/" className={linkClass} end>
            <Home className="h-4 w-4" />
            <span className="hidden sm:inline">Home</span>
          </NavLink>
          {user ? (
            <>
              <NavLink to="/profile" className={linkClass}>
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">{user.username}</span>
              </NavLink>
              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Login</span>
              </NavLink>
              <NavLink to="/register" className={linkClass}>
                <UserPlus className="h-4 w-4" />
                <span className="hidden sm:inline">Register</span>
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}