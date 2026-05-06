import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { LogIn, User, Lock, Sparkles } from 'lucide-react'

async function loadProfile() {
  const { data } = await api.get('/auth/profile/')
  return data
}

export default function LoginPage() {
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const { data } = await api.post('/auth/login/', form)
      const accessToken = data.access || data.token || data.access_token
      const refreshToken = data.refresh || data.refresh_token

      if (accessToken) {
        localStorage.setItem('accessToken', accessToken)
      }

      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken)
      }

      const profile = await loadProfile()
      setUser(profile)
      navigate('/')
    } catch (loginError) {
      setError(loginError?.response?.data?.detail || 'Invalid credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-9rem)] max-w-6xl items-center justify-center pt-10 animate-fade-in">
      <div className="grid w-full lg:grid-cols-2 gap-8 lg:gap-0 lg:overflow-hidden lg:rounded-[3rem] lg:border lg:border-white/10 lg:bg-slate-900/40 lg:shadow-2xl lg:backdrop-blur-3xl">
        
        {/* Left Section - Hero */}
        <section className="relative hidden p-12 lg:flex lg:flex-col lg:justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-fuchsia-500/10 to-transparent"></div>
          <div className="absolute -top-40 -left-40 h-[400px] w-[400px] rounded-full bg-indigo-500/30 blur-[100px] animate-blob"></div>
          <div className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full bg-fuchsia-500/20 blur-[100px] animate-blob" style={{ animationDelay: '2s' }}></div>
          
          <div className="relative z-10 space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-indigo-300 backdrop-blur-md">
              <Sparkles className="h-4 w-4" />
              Welcome Back
            </span>
            <h1 className="text-5xl font-bold tracking-tight text-white drop-shadow-md">
              Your cinematic <span className="text-gradient">journey</span> continues.
            </h1>
            <p className="max-w-md text-lg leading-relaxed text-slate-300">
              Sign in to unlock personalized recommendations, save your ratings, and discover movies tailored to your taste.
            </p>
          </div>
        </section>

        {/* Right Section - Form */}
        <section className="glass-panel rounded-[2.5rem] p-8 sm:p-12 lg:rounded-none lg:border-none lg:bg-transparent lg:shadow-none lg:backdrop-blur-none relative z-10 flex flex-col justify-center">
          <div className="mx-auto w-full max-w-md space-y-8">
            <div className="text-center lg:text-left space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-white">Sign In</h2>
              <p className="text-slate-400">Use your account credentials to continue.</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-400 transition-colors">
                    <User className="h-5 w-5" />
                  </div>
                  <input
                    value={form.username}
                    onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
                    placeholder="Username"
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-4 pl-12 text-white outline-none transition-all placeholder:text-slate-500 focus:border-indigo-500 focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10"
                    required
                  />
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-400 transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                    placeholder="Password"
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-4 pl-12 text-white outline-none transition-all placeholder:text-slate-500 focus:border-indigo-500 focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="animate-fade-in rounded-xl border border-rose-500/20 bg-rose-500/10 p-4 text-sm font-medium text-rose-300">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-fuchsia-500 to-cyan-500 p-[1px] focus:outline-none focus:ring-4 focus:ring-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-70 transition-all duration-300 hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]"
              >
                <div className="flex h-12 w-full items-center justify-center gap-2 rounded-[15px] bg-slate-950 transition-colors group-hover:bg-slate-900">
                  <LogIn className="h-5 w-5 text-indigo-300" />
                  <span className="font-semibold text-white">{loading ? 'Authenticating...' : 'Sign In'}</span>
                </div>
              </button>
            </form>

            <p className="text-center text-sm text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                Create one now
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}