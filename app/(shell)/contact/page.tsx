'use client'

import { FormEvent, useState } from 'react'
import { INQUIRY_TYPES } from '@/lib/types'
import { useToast } from '@/context/ToastContext'

export default function ContactPage() {
  const [name, setName] = useState('')
  const [personalId, setPersonalId] = useState('')
  const [email, setEmail] = useState('')
  const [unit, setUnit] = useState('')
  const [type, setType] = useState(INQUIRY_TYPES[0])
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const { showToast } = useToast()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, personal_id: personalId, email, unit, type, content }),
      })
      if (res.ok) {
        setName(''); setPersonalId(''); setEmail(''); setUnit(''); setContent('')
        setType(INQUIRY_TYPES[0])
        showToast('✓ הפנייה נשלחה בהצלחה! נציג מטעם מעבדת רחפנים 674 יחזור אליך בהקדם.')
      } else {
        const data = await res.json()
        showToast(data.error ?? '⚠ שגיאה בשליחת הפנייה.')
      }
    } catch {
      showToast('⚠ שגיאת רשת. נסה שוב.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '3rem', maxWidth: 1100, margin: '0 auto' }}>
      <div className="section-head">
        <h2>// צור קשר</h2>
        <div className="section-line" />
        <span className="classify-tag">AUTHORIZED PERSONNEL ONLY</span>
      </div>

      {/* Contact info */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          marginBottom: '2rem',
        }}
      >
        {[
          { icon: '📍', label: 'מיקום', val: 'מחנה סיירים - גדוד 674' },
          { icon: '📞', label: 'קו ישיר מאובטח', val: 'שי מויאל - 0534260043\nרפאל יהודאין - 0544455143' },
          { icon: '✉️', label: 'דואל מוצפן', val: 'lab7291@mil.idf.il' },
          { icon: '🕐', label: 'שעות פעילות', val: "א'–ה' | 08:00–17:00" },
        ].map(item => (
          <div key={item.label} className="contact-item">
            <span style={{ fontSize: '1.5rem', flexShrink: 0, marginTop: '0.1rem' }}>{item.icon}</span>
            <div>
              <div
                style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: '0.7rem',
                  color: 'var(--muted)',
                  letterSpacing: '0.15em',
                  marginBottom: '0.3rem',
                }}
              >
                {item.label}
              </div>
              <div style={{ color: 'var(--green)', fontSize: '0.95rem', whiteSpace: 'pre-line' }}>
                {item.val}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="mil-card">
        <h3
          style={{
            color: 'var(--green)',
            fontSize: '1rem',
            fontWeight: 900,
            borderBottom: '1px solid var(--green-dark)',
            paddingBottom: '0.5rem',
            marginBottom: '1.5rem',
          }}
        >
          // שלח פנייה
        </h3>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="mil-label">שם מלא *</label>
              <input className="mil-input" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="שם מלא" required />
            </div>
            <div>
              <label className="mil-label">מספר אישי / ת.ז. *</label>
              <input className="mil-input" type="text" inputMode="numeric" value={personalId} onChange={e => setPersonalId(e.target.value)} placeholder="XXXXXXX" required />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="mil-label">דוא&quot;ל מוסדי / אישי *</label>
              <input className="mil-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="user@unit.idf.il" required />
            </div>
            <div>
              <label className="mil-label">יחידה / גוף מבקש *</label>
              <input className="mil-input" type="text" value={unit} onChange={e => setUnit(e.target.value)} placeholder="שם היחידה" required />
            </div>
          </div>

          <div>
            <label className="mil-label">סוג הפנייה *</label>
            <select className="mil-input" value={type} onChange={e => setType(e.target.value as typeof type)}>
              {INQUIRY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="mil-label">תוכן הפנייה *</label>
            <textarea
              className="mil-input"
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="פרט את הפנייה. אין לכלול מידע מסווג בטופס זה."
              required
            />
          </div>

          <button type="submit" className="mil-btn" disabled={loading} style={{ alignSelf: 'flex-start' }}>
            <span className="mil-btn-text">{loading ? '...' : '⟫ שלח פנייה'}</span>
          </button>
        </form>
      </div>
    </div>
  )
}
