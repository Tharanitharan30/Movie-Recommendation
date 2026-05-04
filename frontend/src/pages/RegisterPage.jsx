import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

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
    <div className="mx-auto grid min-h-[calc(100vh-9rem)] max-w-6xl items-center lg:grid-cols-2 lg:gap-10">
      <section className="hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-gray-900 via-gray-950 to-cyan-950/50 p-8 shadow-2xl shadow-black/30 lg:block">
        <span className="inline-flex rounded-full border border-cyan-400/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.28em] text-cyan-200">
          Join the catalog
        </span>
        <h1 className="mt-6 text-5xl font-semibold tracking-tight text-white">Create an account and start shaping recommendations.</h1>
        <p className="mt-4 max-w-xl text-base leading-7 text-gray-300">
          Registration is instant. Once you sign up, ratings are stored under your profile and reflected in future suggestions.
        </p>
      </section>

      <section className="rounded-[2rem] border border-white/10 bg-gray-900/80 p-6 shadow-2xl shadow-black/25 sm:p-8">
        <h2 className="text-3xl font-semibold text-white">Register</h2>
        <p className="mt-2 text-sm text-gray-400">Create your profile in a few seconds.</p>

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
            <span className="text-sm font-medium text-gray-300">Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
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
            {loading ? 'Creating account...' : 'Register'}
          </button>
        </form>

        <p className="mt-6 text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-300 hover:text-indigo-200">
            Sign in
          </Link>
        </p>
      </section>
    </div>
  )
}