'use client'

import { FormEvent, useState } from 'react'
import { APPOINTMENT_TYPES, HEBREW_MONTHS } from '@/lib/types'
import { useToast } from '@/context/ToastContext'

interface AppointmentFormProps {
  selectedDate: string | null
  selectedSlot: string | null
  onSuccess: () => void
}

export default function AppointmentForm({ selectedDate, selectedSlot, onSuccess }: AppointmentFormProps) {
  const [name, setName] = useState('')
  const [personalId, setPersonalId] = useState('')
  const [unit, setUnit] = useState('')
  const [type, setType] = useState(APPOINTMENT_TYPES[0])
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [confirmed, setConfirmed] = useState<{ date: string; slot: string; name: string; type: string } | null>(null)
  const { showToast } = useToast()

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!selectedDate || !selectedSlot) {
      showToast('⚠ נא בחר תאריך ושעה.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, personal_id: personalId, unit, type, phone, date: selectedDate, slot: selectedSlot }),
      })

      const data = await res.json()

      if (res.ok) {
        const [year, month, day] = selectedDate.split('-').map(Number)
        const dateDisplay = `${day} ב${HEBREW_MONTHS[month - 1]} ${year}`

        // Save appointment to localStorage so "התורים שלי" can display it.
        // localStorage is per-device/browser — each user sees only their own data.
        try {
          localStorage.setItem('drone674_my_appointment', JSON.stringify({
            id: data.id ?? null,
            dateDisplay,
            dateRaw: selectedDate,
            slot: selectedSlot,
            name,
            personalId,
            unit,
            type,
            status: 'ממתין',
            bookedAt: new Date().toISOString(),
          }))
        } catch {
          // localStorage unavailable (private browsing etc.) — silently ignore
        }

        setConfirmed({ date: dateDisplay, slot: selectedSlot, name, type })
        setName(''); setPersonalId(''); setUnit(''); setPhone('')
        showToast('✓ התור נקבע בהצלחה! ממתין לאישור מנהל.')
        onSuccess()
      } else if (res.status === 409) {
        showToast('⚠ השעה הזו כבר תפוסה. בחר שעה אחרת.')
      } else {
        showToast(data.error ?? '⚠ שגיאה בקביעת התור. נסה שוב.')
      }
    } catch {
      showToast('⚠ שגיאת רשת. נסה שוב.')
    } finally {
      setLoading(false)
    }
  }

  // After a successful booking, show the confirmation box regardless of slot state
  if (confirmed) {
    return (
      <div style={{ borderTop: '1px solid var(--green-dark)', paddingTop: '1.2rem', marginTop: '0.5rem' }}>
        <div className="confirm-box">
          <div style={{ fontSize: '1rem', marginBottom: '0.6rem', letterSpacing: '0.05em' }}>✓ התור נקבע בהצלחה!</div>
          <div>📅 {confirmed.date} &nbsp;|&nbsp; 🕐 {confirmed.slot}</div>
          <div>👤 {confirmed.name} &nbsp;|&nbsp; 📋 {confirmed.type}</div>
          <div style={{ marginTop: '0.5rem', opacity: 0.65, fontSize: '0.72rem' }}>⏳ ממתין לאישור מנהל</div>
        </div>
        <button
          type="button"
          className="mil-btn"
          style={{ width: '100%', marginTop: '1rem' }}
          onClick={() => setConfirmed(null)}
        >
          <span className="mil-btn-text">⟫ קבע תור נוסף</span>
        </button>
      </div>
    )
  }

  if (!selectedDate || !selectedSlot) return null

  return (
    <div style={{ borderTop: '1px solid var(--green-dark)', paddingTop: '1.2rem', marginTop: '0.5rem' }}>
      <h4
        style={{
          color: 'var(--green)',
          fontSize: '0.82rem',
          fontFamily: "'Share Tech Mono', monospace",
          letterSpacing: '0.08em',
          marginBottom: '0.9rem',
        }}
      >
        📝 פרטי המבקר
      </h4>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
        {/* Identity: name + ID side by side */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.55rem' }}>
          <div>
            <label className="mil-label">שם מלא *</label>
            <input
              className="mil-input"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="שם פרטי + משפחה"
              required
            />
          </div>
          <div>
            <label className="mil-label">מספר אישי *</label>
            <input
              className="mil-input"
              type="text"
              inputMode="numeric"
              value={personalId}
              onChange={e => setPersonalId(e.target.value)}
              placeholder="XXXXXXX"
              required
            />
          </div>
        </div>

        {/* Unit + type side by side */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.55rem' }}>
          <div>
            <label className="mil-label">יחידה *</label>
            <input
              className="mil-input"
              type="text"
              value={unit}
              onChange={e => setUnit(e.target.value)}
              placeholder="שם היחידה"
              required
            />
          </div>
          <div>
            <label className="mil-label">מטרת הביקור</label>
            <select className="mil-input" value={type} onChange={e => setType(e.target.value as typeof type)}>
              {APPOINTMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Phone */}
        <div style={{ marginBottom: '0.9rem' }}>
          <label className="mil-label">פלאפון לאישור WhatsApp *</label>
          <input
            className="mil-input"
            type="tel"
            inputMode="tel"
            value={phone}
            onChange={e => setPhone(e.target.value)}
            placeholder="05X-XXXXXXX"
            required
          />
        </div>

        <button type="submit" className="mil-btn" disabled={loading} style={{ width: '100%' }}>
          <span className="mil-btn-text">
            {loading ? '⟳ שולח...' : '⟫ אשר תור'}
          </span>
        </button>
      </form>
    </div>
  )
}
