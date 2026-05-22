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

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginTop: '1rem', borderTop: '1px solid var(--green-dark)', paddingTop: '1.2rem' }}
      >
        <div>
          <label className="mil-label">שם מלא *</label>
          <input className="mil-input" type="text" value={name} onChange={e => setName(e.target.value)} placeholder="שם פרטי + משפחה" required />
        </div>
        <div>
          <label className="mil-label">מספר אישי *</label>
          <input className="mil-input" type="text" inputMode="numeric" value={personalId} onChange={e => setPersonalId(e.target.value)} placeholder="XXXXXXX" required />
        </div>
        <div>
          <label className="mil-label">מטרת הביקור</label>
          <select className="mil-input" value={type} onChange={e => setType(e.target.value as typeof type)}>
            {APPOINTMENT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="mil-label">יחידה *</label>
          <input className="mil-input" type="text" value={unit} onChange={e => setUnit(e.target.value)} placeholder="שם היחידה" required />
        </div>
        <div>
          <label className="mil-label">מספר פלאפון (לקבלת אישור WhatsApp) *</label>
          <input className="mil-input" type="tel" inputMode="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="05X-XXXXXXX" required />
        </div>
        <button type="submit" className="mil-btn" disabled={loading || !selectedDate || !selectedSlot}>
          <span className="mil-btn-text">{loading ? '...' : '⟫ אשר תור'}</span>
        </button>
      </form>

      {confirmed && (
        <div className="confirm-box">
          ✓ התור נקבע בהצלחה!<br /><br />
          📅 {confirmed.date}<br />
          🕐 {confirmed.slot}<br />
          👤 {confirmed.name}<br />
          📋 {confirmed.type}<br />
          ⏳ ממתין לאישור מנהל
        </div>
      )}
    </div>
  )
}
