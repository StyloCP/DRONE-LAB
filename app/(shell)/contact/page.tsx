'use client'

import { FormEvent, useState } from 'react'
import { INQUIRY_TYPES } from '@/lib/types'
import { useToast } from '@/context/ToastContext'

const CONTACT_ITEMS = [
  { icon: '📍', label: 'מיקום', val: 'מחנה סיירים - גדוד 674' },
  { icon: '📞', label: 'קו ישיר מאובטח', val: 'שי מויאל - 0534260043\nרפאל יהודאין - 0544455143' },
  { icon: '✉️', label: 'דואל מוצפן', val: 'NONE' },
  { icon: '🕐', label: 'שעות פעילות', val: "א'–ה' | 08:00–17:00" },
]

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
        showToast('✓ הפנייה נשלחה בהצלחה!')
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
    <>
      {/* Page header */}
      <section style={{
        background: 'linear-gradient(to bottom, var(--bg-section), var(--bg-base))',
        padding: '3rem 2rem 2rem',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(251,146,60,0.1)', border: '1px solid rgba(251,146,60,0.25)',
            borderRadius: 20, padding: '0.25rem 0.85rem',
            fontSize: '0.78rem', color: 'var(--orange-text)', marginBottom: '1.25rem',
          }}>
            🔒 AUTHORIZED PERSONNEL ONLY
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            // צור קשר
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.93rem' }}>
            ליצירת קשר עם המעבדה, השתמש בפרטים הבאים.
          </p>
        </div>
      </section>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '2.5rem 2rem' }}>
        {/* Contact info cards */}
        <div className="contact-grid-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
          {CONTACT_ITEMS.map(item => (
            <div key={item.label} className="app-card" style={{
              padding: '1.25rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '1rem',
            }}>
              <span style={{ fontSize: '1.4rem', flexShrink: 0, marginTop: '0.1rem' }}>{item.icon}</span>
              <div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', letterSpacing: '0.1em', marginBottom: '0.3rem', textTransform: 'uppercase' }}>
                  {item.label}
                </div>
                <div style={{ color: 'var(--green-accent)', fontSize: '0.9rem', whiteSpace: 'pre-line', fontWeight: 600 }}>
                  {item.val}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="app-card" style={{ padding: '2rem' }}>
          <h3 style={{
            fontSize: '1.05rem', fontWeight: 700,
            color: 'var(--green-accent)',
            borderBottom: '1px solid var(--border)',
            paddingBottom: '0.75rem',
            marginBottom: '1.5rem',
            fontFamily: "'Heebo', 'Arial Hebrew', Arial, sans-serif",
          }}>
            // שלח פנייה
          </h3>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="mil-label">שם מלא *</label>
                <input className="mil-input" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="שם מלא" required />
              </div>
              <div>
                <label className="mil-label">מספר אישי / ת.ז. *</label>
                <input className="mil-input" type="text" inputMode="numeric" value={personalId} onChange={e => setPersonalId(e.target.value)} placeholder="XXXXXXX" required />
              </div>
            </div>

            <div className="form-row-2" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div>
                <label className="mil-label">דוא&quot;ל *</label>
                <input className="mil-input" type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="user@unit.idf.il" required />
              </div>
              <div>
                <label className="mil-label">יחידה *</label>
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
              <textarea className="mil-input" value={content} onChange={e => setContent(e.target.value)}
                placeholder="פרט את הפנייה. אין לכלול מידע מסווג בטופס זה." required />
            </div>

            <button type="submit" className="mil-btn" disabled={loading} style={{ alignSelf: 'flex-start' }}>
              <span className="mil-btn-text">{loading ? '...' : '⟫ שלח פנייה'}</span>
            </button>
          </form>
        </div>
      </div>
    </>
  )
}
