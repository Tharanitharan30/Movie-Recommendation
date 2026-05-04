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
    <div className="rounded-3xl border border-white/10 bg-gray-900/80 p-5 shadow-lg shadow-black/20">
      <div className="mb-3 flex items-center justify-between gap-4">
        <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-gray-400">Your Rating</h3>
        {message ? <span className="text-sm text-indigo-300">{message}</span> : null}
      </div>

      <div className="flex flex-wrap gap-2">
        {[1, 2, 3, 4, 5].map((value) => (
          <button
            key={value}
            type="button"
            disabled={saving}
            onClick={() => saveRating(value)}
            className={[
              'flex h-11 w-11 items-center justify-center rounded-2xl text-lg font-bold transition',
              value <= score
                ? 'bg-amber-400 text-gray-950 shadow-lg shadow-amber-950/20'
                : 'bg-white/5 text-gray-300 ring-1 ring-inset ring-white/10 hover:bg-white/10 hover:text-white',
              saving ? 'cursor-wait opacity-70' : '',
            ].join(' ')}
            aria-label={`Rate ${value} star${value > 1 ? 's' : ''}`}
          >
            ★
          </button>
        ))}
      </div>

      {!user ? <p className="mt-3 text-sm text-gray-400">Sign in to store your rating.</p> : null}
    </div>
  )
}