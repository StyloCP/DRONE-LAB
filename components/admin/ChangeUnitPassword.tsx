'use client'

import { useState } from 'react'
import { useToast } from '@/context/ToastContext'

export default function ChangeUnitPassword() {
  const { showToast } = useToast()
  const [newCode, setNewCode] = useState('')
  const [confirmCode, setConfirmCode] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    if (newCode.length < 4) {
      showToast('⚠ קוד גישה חייב להכיל לפחות 4 תווים')
      return
    }

    if (newCode !== confirmCode) {
      showToast('⚠ הקודים אינם תואמים')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/admin/unit-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ newCode }),
      })

      const data = await res.json()

      if (res.ok) {
        showToast('✓ קוד גישה ליחידה עודכן בהצלחה')
        setNewCode('')
        setConfirmCode('')
      } else {
        showToast(`⚠ ${data.error ?? 'שגיאה בעדכון הקוד'}`)
      }
    } catch {
      showToast('⚠ שגיאת רשת — נסה שוב')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mil-card" style={{ marginTop: '2.5rem', padding: '1.5rem' }}>
      <div className="section-head" style={{ marginBottom: '1.25rem' }}>
        <h2>// שינוי קוד גישה ליחידה</h2>
        <div className="section-line" />
        <span className="classify-tag">ADMIN ONLY</span>
      </div>

      <p style={{ color: 'var(--muted)', fontSize: '0.82rem', marginBottom: '1.25rem', fontFamily: "'Share Tech Mono', monospace" }}>
        קוד זה משמש לכניסה למערכת קביעת התורים. לאחר שינוי הקוד הוא ייכנס לתוקף מיידית.
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 380 }}>
        <div>
          <label className="mil-label" htmlFor="newCode">קוד גישה חדש</label>
          <input
            id="newCode"
            type="password"
            className="mil-input"
            value={newCode}
            onChange={e => setNewCode(e.target.value)}
            autoComplete="new-password"
            placeholder="לפחות 4 תווים"
            disabled={loading}
            required
          />
        </div>

        <div>
          <label className="mil-label" htmlFor="confirmCode">אישור קוד גישה</label>
          <input
            id="confirmCode"
            type="password"
            className="mil-input"
            value={confirmCode}
            onChange={e => setConfirmCode(e.target.value)}
            autoComplete="new-password"
            placeholder="הזן שוב את הקוד"
            disabled={loading}
            required
          />
        </div>

        <button
          type="submit"
          className="mil-btn"
          disabled={loading || !newCode || !confirmCode}
          style={{ alignSelf: 'flex-start' }}
        >
          <span className="mil-btn-text">
            {loading ? '⟳ מעדכן...' : '⟫ עדכן קוד גישה'}
          </span>
        </button>
      </form>
    </div>
  )
}
