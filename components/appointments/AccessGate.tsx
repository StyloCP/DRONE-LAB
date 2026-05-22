'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AccessGate() {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [locked, setLocked] = useState(false)
  const [lockMs, setLockMs] = useState(0)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (locked || loading) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/unit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code }),
      })

      const data = await res.json()

      if (res.ok) {
        // Token stored in httpOnly cookie by server
        router.push('/appointments')
        router.refresh()
      } else if (res.status === 429) {
        setLocked(true)
        setLockMs(data.retryAfterMs ?? 15 * 60 * 1000)
        setError(data.error ?? 'יותר מדי ניסיונות. נסה שוב בעוד 15 דקות.')
      } else {
        setError('קוד גישה שגוי. נסה שוב.')
        setCode('')
      }
    } catch {
      setError('שגיאת רשת. נסה שוב.')
    } finally {
      setLoading(false)
    }
  }

  const lockMinutes = Math.ceil(lockMs / 60000)

  return (
    <div
      style={{
        maxWidth: 400,
        margin: '4rem auto',
        padding: '0 1rem',
      }}
    >
      <div className="mil-card">
        <div style={{ marginBottom: '1.5rem' }}>
          <div className="classify-tag">RESTRICTED ACCESS</div>
          <h3
            style={{
              fontFamily: "'Share Tech Mono', monospace",
              color: 'var(--green)',
              fontSize: '1rem',
              marginTop: '0.8rem',
            }}
          >
            // אימות גישה
          </h3>
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem', marginTop: '0.5rem', lineHeight: 1.6 }}>
            אזור זה מיועד לאנשי צבא מורשים בלבד.<br />
            הזן את קוד הגישה של יחידתך.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="mil-label">קוד גישה *</label>
            <input
              className="mil-input"
              type="password"
              value={code}
              onChange={e => setCode(e.target.value)}
              placeholder="הזן קוד גישה..."
              disabled={locked || loading}
              autoComplete="off"
              inputMode="text"
              required
            />
          </div>

          {error && (
            <div
              style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '0.75rem',
                color: '#ff4444',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              ✗ {error}
              {locked && (
                <span style={{ color: 'var(--muted)' }}>
                  ({lockMinutes} דק&apos;)
                </span>
              )}
            </div>
          )}

          <button
            type="submit"
            className="mil-btn"
            disabled={locked || loading || !code}
          >
            <span className="mil-btn-text">
              {loading ? '...' : '⟫ כניסה'}
            </span>
          </button>
        </form>
      </div>
    </div>
  )
}
