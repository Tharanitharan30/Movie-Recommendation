import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'
import { LogIn, User, Lock } from 'lucide-react'

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
    <div className="mx-auto flex min-h-[calc(100vh-9rem)] max-w-5xl items-center justify-center pt-6">
      <div className="grid w-full gap-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900 lg:grid-cols-2">
        <section className="hidden border-r border-slate-200 bg-slate-50 p-10 dark:border-slate-700 dark:bg-slate-800 lg:flex lg:flex-col lg:justify-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Welcome back</h1>
            <p className="max-w-md text-base leading-relaxed text-slate-600 dark:text-slate-300">
              Sign in to view personalized recommendations, saved ratings, and your movie profile.
            </p>
          </div>
        </section>

        <section className="flex flex-col justify-center p-8 sm:p-10">
          <div className="mx-auto w-full max-w-md space-y-8">
            <div className="space-y-2 text-center lg:text-left">
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100">Sign In</h2>
              <p className="text-slate-500 dark:text-slate-400">Use your account credentials to continue.</p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="relative group">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 transition-colors group-focus-within:text-slate-700 dark:group-focus-within:text-slate-300">
                    <User className="h-5 w-5" />
                  </div>
                  <input
                    value={form.username}
                    onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
                    placeholder="Username"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pl-12 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-4 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-400 dark:focus:ring-slate-700"
                    required
                  />
                </div>

                <div className="relative group">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400 transition-colors group-focus-within:text-slate-700 dark:group-focus-within:text-slate-300">
                    <Lock className="h-5 w-5" />
                  </div>
                  <input
                    type="password"
                    value={form.password}
                    onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                    placeholder="Password"
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pl-12 text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-slate-500 focus:ring-4 focus:ring-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:placeholder:text-slate-500 dark:focus:border-slate-400 dark:focus:ring-slate-700"
                    required
                  />
                </div>
              </div>

              {error && (
                <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm font-medium text-rose-700">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-slate-900 font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-4 focus:ring-slate-300 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-white dark:focus:ring-slate-700"
              >
                <LogIn className="h-5 w-5" />
                <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              </button>
            </form>

            <p className="text-center text-sm text-slate-500 dark:text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-slate-900 transition-colors hover:text-slate-700 dark:text-slate-100 dark:hover:text-slate-300">
                Create one now
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  )
}