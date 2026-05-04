import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()

  const linkClass = ({ isActive }) =>
    [
      'rounded-full px-4 py-2 text-sm font-medium transition',
      isActive
        ? 'bg-indigo-500/20 text-indigo-200 ring-1 ring-inset ring-indigo-400/40'
        : 'text-gray-300 hover:bg-white/5 hover:text-white',
    ].join(' ')

  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-gray-950/80 backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="group flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-400 via-cyan-300 to-fuchsia-400 text-sm font-black text-gray-950 shadow-lg shadow-indigo-900/40">
            MR
          </span>
          <div>
            <div className="text-base font-semibold tracking-wide text-white">Movie Radar</div>
            <div className="text-xs text-gray-400 group-hover:text-gray-300">Discover smarter picks</div>
          </div>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
          <NavLink to="/" className={linkClass} end>
            Home
          </NavLink>
          {user ? (
            <>
              <NavLink to="/profile" className={linkClass}>
                {user.username}
              </NavLink>
              <button
                type="button"
                onClick={logout}
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-white transition hover:border-indigo-400/40 hover:bg-indigo-500/10"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>
                Login
              </NavLink>
              <NavLink to="/register" className={linkClass}>
                Register
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  )
}