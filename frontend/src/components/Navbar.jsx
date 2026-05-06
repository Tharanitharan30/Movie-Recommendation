import { Link, NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Home, User, LogOut, LogIn, UserPlus, Film } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()

  const linkClass = ({ isActive }) =>
    [
      'flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300',
      isActive
        ? 'bg-indigo-500/20 text-indigo-300 ring-1 ring-inset ring-indigo-400/50 shadow-[0_0_15px_rgba(99,102,241,0.3)]'
        : 'text-slate-300 hover:bg-white/10 hover:text-white',
    ].join(' ')

  return (
    <header className="fixed top-4 left-0 right-0 z-50 mx-auto max-w-5xl px-4 sm:px-6">
      <div className="glass-panel flex w-full items-center justify-between gap-4 rounded-full px-4 py-3 sm:px-6">
        <Link to="/" className="group flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 via-fuchsia-500 to-cyan-500 shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:shadow-indigo-500/50">
            <Film className="h-5 w-5 text-white" />
            <div className="absolute inset-0 rounded-full bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-20"></div>
          </div>
          <div className="hidden sm:block">
            <div className="text-gradient text-lg font-bold tracking-tight">Movie Radar</div>
          </div>
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3">
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
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 transition-all duration-300 hover:border-fuchsia-400/50 hover:bg-fuchsia-500/10 hover:text-fuchsia-300 hover:shadow-[0_0_15px_rgba(217,70,239,0.2)]"
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