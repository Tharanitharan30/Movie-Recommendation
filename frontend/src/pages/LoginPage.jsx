import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

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
    <div className="mx-auto grid min-h-[calc(100vh-9rem)] max-w-6xl items-center lg:grid-cols-2 lg:gap-10">
      <section className="hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-indigo-950 via-gray-950 to-gray-900 p-8 shadow-2xl shadow-black/30 lg:block">
        <span className="inline-flex rounded-full border border-indigo-400/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-indigo-200">
          Welcome back
        </span>
        <h1 className="mt-6 text-5xl font-semibold tracking-tight text-white">Sign in to save ratings and unlock recommendations.</h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-gray-300">
          Your profile keeps your rated movies in one place and powers collaborative suggestions across the catalog.
        </p>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-gray-900/80 p-6 shadow-2xl shadow-black/25 sm:p-8">
        <h2 className="text-3xl font-semibold text-white">Login</h2>
        <p className="mt-2 text-sm text-gray-400">Use your account credentials to continue.</p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <label className="block space-y-2">
            <span className="text-sm font-medium text-gray-300">Username</span>
            <input
              value={form.username}
              onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-gray-950 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/20"
              required
            />
          </label>

          <label className="block space-y-2">
            <span className="text-sm font-medium text-gray-300">Password</span>
            <input
              type="password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-gray-950 px-4 py-3 text-white outline-none transition placeholder:text-gray-500 focus:border-indigo-400/60 focus:ring-2 focus:ring-indigo-500/20"
              required
            />
          </label>

          {error ? <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">{error}</div> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-gradient-to-r from-indigo-500 to-cyan-400 px-4 py-3 font-semibold text-gray-950 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {loading ? 'Signing in...' : 'Login'}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-400">
          New here?{' '}
          <Link to="/register" className="font-medium text-indigo-300 hover:text-indigo-200">
            Create an account
          </Link>
        </p>
      </section>
    </div>
  )
}