import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { UserPlus, User, Lock, Mail, Sparkles } from 'lucide-react'

async function logInAfterRegister(username, password) {
  const { data } = await api.post('/auth/login/', { username, password })
  const accessToken = data.access || data.token || data.access_token
  const refreshToken = data.refresh || data.refresh_token

  if (accessToken) {
    localStorage.setItem('accessToken', accessToken)
  }

  if (refreshToken) {
    localStorage.setItem('refreshToken', refreshToken)
  }

  const { data: profile } = await api.get('/auth/profile/')
  return profile
}

export default function RegisterPage() {
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      await api.post('/auth/register/', form)
      const profile = await logInAfterRegister(form.username, form.password)
      setUser(profile)
      navigate('/')
    } catch (registerError) {
      const response = registerError?.response?.data

      if (response && typeof response === 'object') {
        const firstValue = Object.values(response)[0]
        const firstMessage = Array.isArray(firstValue) ? firstValue[0] : firstValue
        setError(firstMessage || 'Could not create account.')
      } else {
        setError('Could not create account.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto flex min-h-[calc(100vh-9rem)] max-w-6xl items-center justify-center pt-10 animate-fade-in">
      <div className="grid w-full lg:grid-cols-2 gap-8 lg:gap-0 lg:overflow-hidden lg:rounded-[3rem] lg:border lg:border-white/10 lg:bg-slate-900/40 lg:shadow-2xl lg:backdrop-blur-3xl">
        
        {/* Left Section - Hero */}
        <section className="relative hidden p-12 lg:flex lg:flex-col lg:justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-fuchsia-500/10 to-transparent"></div>
          <div className="absolute -bottom-40 -left-40 h-[400px] w-[400px] rounded-full bg-cyan-500/30 blur-[100px] animate-blob"></div>
          <div className="absolute top-0 right-0 h-[300px] w-[300px] rounded-full bg-fuchsia-500/20 blur-[100px] animate-blob" style={{ animationDelay: '2s' }}></div>
          
          <div className="relative z-10 space-y-6">
            <span className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-500/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-cyan-300 backdrop-blur-md">
              <Sparkles className="h-4 w-4" />
              Join the Catalog
            </span>
            <h1 className="text-5xl font-bold tracking-tight text-white drop-shadow-md">
              Shape your <span className="text-gradient">recommendations</span>.
            </h1>
            <p className="max-w-md text-lg leading-relaxed text-slate-300">
              Registration is instant. Sign up to store your ratings and let our engine find the perfect movies for you.
            </p>
          </div>
        </section>

        {/* Right Section - Form */}
        <section className="glass-panel rounded-[2.5rem] p-8 sm:p-12 lg:rounded-none lg:border-none lg:bg-transparent lg:shadow-none lg:backdrop-blur-none relative z-10 flex flex-col justify-center">
          <div className="mx-auto w-full max-w-md space-y-8">
            <div className="text-center lg:text-left space-y-2">
              <h2 className="text-3xl font-bold tracking-tight text-white">Create Account</h2>
              <p className="text-slate-400">Get started in a few seconds.</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-400 transition-colors">
                    <User className="h-5 w-5" />
                  </div>
                  <input
                    value={form.username}
                    onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
                    placeholder="Username"
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-4 pl-12 text-white outline-none transition-all placeholder:text-slate-500 focus:border-cyan-500 focus:bg-slate-900 focus:ring-4 focus:ring-cyan-500/10"
                    required
                  />
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-400 transition-colors">
                    <Mail className="h-5 w-5" />
                  </div>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                    placeholder="Email Address"
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-4 pl-12 text-white outline-none transition-all placeholder:text-slate-500 focus:border-cyan-500 focus:bg-slate-900 focus:ring-4 focus:ring-cyan-500/10"
                    required
                  />
                </div>

                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-cyan-400 transition-colors">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                    placeholder="Password"
                    className="w-full rounded-2xl border border-white/10 bg-slate-950/50 px-4 py-4 pl-12 text-white outline-none transition-all placeholder:text-slate-500 focus:border-cyan-500 focus:bg-slate-900 focus:ring-4 focus:ring-cyan-500/10"
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
                className="group relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-500 to-fuchsia-500 p-[1px] focus:outline-none focus:ring-4 focus:ring-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-70 transition-all duration-300 hover:shadow-[0_0_20px_rgba(6,182,212,0.4)]"
              >
                <div className="flex h-12 w-full items-center justify-center gap-2 rounded-[15px] bg-slate-950 transition-colors group-hover:bg-slate-900">
                  <UserPlus className="h-5 w-5 text-cyan-300" />
                  <span className="font-semibold text-white">{loading ? 'Creating Account...' : 'Register'}</span>
                </div>
              </button>
            </form>

            <p className="text-center text-sm text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="font-bold text-cyan-400 hover:text-cyan-300 transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}