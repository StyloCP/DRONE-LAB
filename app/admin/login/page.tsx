'use client'

import { useState } from 'react'

const PIN_LENGTH = 4

export default function AdminLoginPage() {
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')
  const [locked, setLocked] = useState(false)
  const [lockMs, setLockMs] = useState(0)
  const [loading, setLoading] = useState(false)

  async function submitPin(fullPin: string) {
    if (locked || loading) return
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/auth/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: fullPin }),
      })

      const data = await res.json()

      if (res.ok) {
        window.location.href = '/admin/dashboard'
      } else if (res.status === 429) {
        setLocked(true)
        setLockMs(data.retryAfterMs ?? 15 * 60 * 1000)
        setError(data.error ?? 'יותר מדי ניסיונות.')
        setPin('')
      } else {
        setError('PIN שגוי. נסה שוב.')
        setPin('')
      }
    } catch {
      setError('שגיאת רשת.')
      setPin('')
    } finally {
      setLoading(false)
    }
  }

  function handleDigit(d: string) {
    if (locked || loading) return
    setError('')
    const next = pin + d
    setPin(next)
    if (next.length === PIN_LENGTH) {
      submitPin(next)
    }
  }

  function handleDelete() {
    if (locked || loading) return
    setPin(p => p.slice(0, -1))
    setError('')
  }

  const lockMinutes = Math.ceil(lockMs / 60000)

  return (
    <div style={{ maxWidth: 360, margin: '2rem auto', padding: '0 1rem' }}>
      <div className="section-head">
        <h2>// לוח מנהל</h2>
        <div className="section-line" />
      </div>

      <div className="mil-card">
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div className="classify-tag" style={{ marginBottom: '0.8rem' }}>ADMIN ACCESS</div>
          <h3 style={{
            color: 'var(--green)',
            fontFamily: "'Heebo', 'Arial Hebrew', Arial, sans-serif",
            fontSize: '1.1rem',
            fontWeight: 700,
            marginBottom: '0.5rem',
          }}>
            // הזן PIN מנהל
          </h3>
          <p style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>
            4 ספרות בלבד
          </p>
        </div>

        {/* PIN dots */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '1.2rem',
          marginBottom: '1.5rem',
        }}>
          {Array.from({ length: PIN_LENGTH }).map((_, i) => (
            <div
              key={i}
              style={{
                width: 18,
                height: 18,
                borderRadius: '50%',
                border: `2px solid ${i < pin.length ? 'var(--green)' : 'var(--muted)'}`,
                background: i < pin.length ? 'var(--green)' : 'transparent',
                transition: 'all 0.15s',
                boxShadow: i < pin.length ? '0 0 8px var(--green)' : 'none',
              }}
            />
          ))}
        </div>

        {/* Error */}
        {error && (
          <div style={{
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '0.75rem',
            color: '#ff4444',
            textAlign: 'center',
            marginBottom: '1rem',
          }}>
            ✗ {error}
            {locked && <span style={{ color: 'var(--muted)' }}> ({lockMinutes} דק&apos;)</span>}
          </div>
        )}

        {/* Number pad */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.6rem',
          marginBottom: '0.6rem',
        }}>
          {['1','2','3','4','5','6','7','8','9'].map(d => (
            <button
              key={d}
              onClick={() => handleDigit(d)}
              disabled={locked || loading || pin.length >= PIN_LENGTH}
              style={{
                background: 'rgba(0,30,0,0.6)',
                border: '1px solid var(--green-dark)',
                color: 'var(--text)',
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '1.3rem',
                padding: '0.9rem',
                cursor: 'pointer',
                transition: 'all 0.15s',
                borderRadius: 2,
                minHeight: 56,
              }}
              onMouseEnter={e => { if (!locked && !loading) (e.target as HTMLElement).style.borderColor = 'var(--green)' }}
              onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = 'var(--green-dark)' }}
            >
              {d}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
          {/* Empty */}
          <div />
          {/* 0 */}
          <button
            onClick={() => handleDigit('0')}
            disabled={locked || loading || pin.length >= PIN_LENGTH}
            style={{
              background: 'rgba(0,30,0,0.6)',
              border: '1px solid var(--green-dark)',
              color: 'var(--text)',
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '1.3rem',
              padding: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.15s',
              borderRadius: 2,
              minHeight: 56,
            }}
            onMouseEnter={e => { if (!locked && !loading) (e.target as HTMLElement).style.borderColor = 'var(--green)' }}
            onMouseLeave={e => { (e.target as HTMLElement).style.borderColor = 'var(--green-dark)' }}
          >
            0
          </button>
          {/* Delete */}
          <button
            onClick={handleDelete}
            disabled={locked || loading || pin.length === 0}
            style={{
              background: 'rgba(30,0,0,0.4)',
              border: '1px solid #ff4444',
              color: '#ff4444',
              fontFamily: "'Share Tech Mono', monospace",
              fontSize: '1rem',
              padding: '0.9rem',
              cursor: 'pointer',
              transition: 'all 0.15s',
              borderRadius: 2,
              minHeight: 56,
            }}
          >
            ⌫
          </button>
        </div>

        {/* Loading indicator */}
        {loading && (
          <div style={{
            textAlign: 'center',
            marginTop: '1rem',
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '0.75rem',
            color: 'var(--muted)',
          }}>
            מאמת...
          </div>
        )}
      </div>
    </div>
  )
}
