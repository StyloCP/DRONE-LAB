'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('פרטי כניסה שגויים. נסה שוב.')
      setPassword('')
    } else {
      router.push('/admin/dashboard')
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div style={{ maxWidth: 400, margin: '2rem auto' }}>
      <div className="section-head">
        <h2>// לוח מנהל</h2>
        <div className="section-line" />
      </div>

      <div className="mil-card">
        <h3
          style={{
            color: 'var(--green)',
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '1rem',
            marginBottom: '1.5rem',
          }}
        >
          // אימות זהות
        </h3>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="mil-label">דואל מנהל</label>
            <input
              className="mil-input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@lab674.idf.il"
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label className="mil-label">סיסמה</label>
            <input
              className="mil-input"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="הזן סיסמה..."
              autoComplete="current-password"
              required
            />
          </div>

          {error && (
            <div
              style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '0.75rem',
                color: '#ff4444',
              }}
            >
              ✗ {error}
            </div>
          )}

          <button type="submit" className="mil-btn" disabled={loading}>
            <span className="mil-btn-text">{loading ? '...' : '⟫ כניסה'}</span>
          </button>
        </form>
      </div>
    </div>
  )
}
