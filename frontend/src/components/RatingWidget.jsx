import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import api from '../services/api'

export default function RatingWidget({ movieId, initialScore = 0, onRated }) {
  const { user } = useAuth()
  const [score, setScore] = useState(initialScore)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  const saveRating = async (value) => {
    if (!user) {
      setMessage('Login to save your rating.')
      return
    }

    setScore(value)
    setSaving(true)
    setMessage('')

    try {
      await api.post('/ratings/', { movie_id: movieId, score: value })
      setMessage('Saved!')
      onRated?.(value)
    } catch (error) {
      setMessage(error?.response?.data?.error || 'Could not save rating.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900">
      <div className="mb-3 flex items-center justify-between gap-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">Your Rating</h3>
        {message ? <span className="text-sm text-blue-600">{message}</span> : null}
      </div>

      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            disabled={saving}
            onClick={() => saveRating(value)}
            className={[
              'flex h-11 w-11 items-center justify-center rounded-xl text-lg font-bold transition',
              value <= score
                ? 'bg-amber-400 text-slate-900 shadow-sm'
                : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white',
              saving ? 'cursor-wait opacity-70' : '',
            ].join(' ')}
            aria-label={`Rate ${value} star${value > 1 ? 's' : ''}`}
          >
            ★
          </button>
        ))}
      </div>

      {!user ? <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">Sign in to store your rating.</p> : null}
    </div>
  )
}