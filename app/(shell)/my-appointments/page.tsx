'use client'

import { CSSProperties, useEffect, useState } from 'react'
import Link from 'next/link'

interface StoredAppointment {
  id: string | null
  dateDisplay: string
  dateRaw: string
  slot: string
  name: string
  personalId: string
  unit: string
  type: string
  status: 'ממתין' | 'מאושר' | 'מבוטל' | 'בוטל-לקוח'
  bookedAt: string
}

const STATUS_STYLE: Record<string, { bg: string; border: string; text: string; icon: string; label: string }> = {
  'ממתין':     { bg: 'rgba(251,146,60,0.10)', border: 'rgba(251,146,60,0.40)', text: '#fb923c', icon: '⏳', label: 'ממתין לאישור' },
  'מאושר':     { bg: 'rgba(34,197,94,0.10)',  border: 'rgba(34,197,94,0.40)',  text: '#22c55e', icon: '✓',  label: 'מאושר'         },
  'מבוטל':     { bg: 'rgba(239,68,68,0.10)',  border: 'rgba(239,68,68,0.40)',  text: '#ef4444', icon: '✕',  label: 'בוטל ע"י מנהל' },
  'בוטל-לקוח': { bg: 'rgba(239,68,68,0.10)',  border: 'rgba(239,68,68,0.40)',  text: '#ef4444', icon: '✕',  label: 'ביטלת את התור' },
}

const CANCELLABLE = ['ממתין', 'מאושר']

export default function MyAppointmentsPage() {
  const [appt, setAppt]             = useState<StoredAppointment | null>(null)
  const [loaded, setLoaded]         = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [syncing, setSyncing]       = useState(false)

  // Fetch live status from server and sync localStorage
  async function syncStatus(current: StoredAppointment) {
    if (!current.id) return
    setSyncing(true)
    try {
      // timestamp busts any browser-level cache
      const res = await fetch(`/api/appointments/${current.id}?t=${Date.now()}`, {
        cache: 'no-store',
      })
      if (!res.ok) return
      const data: { appointment?: { status: string } } = await res.json()
      const serverStatus = data?.appointment?.status
      if (serverStatus && serverStatus !== current.status) {
        const updated = { ...current, status: serverStatus as StoredAppointment['status'] }
        setAppt(updated)
        try { localStorage.setItem('drone674_my_appointment', JSON.stringify(updated)) } catch {}
      }
    } catch {}
    finally { setSyncing(false) }
  }

  useEffect(() => {
    // 1. Show cached value instantly
    let stored: StoredAppointment | null = null
    try {
      const raw = localStorage.getItem('drone674_my_appointment')
      if (raw) stored = JSON.parse(raw)
    } catch {}

    setAppt(stored)
    setLoaded(true)

    // 2. Fetch live status on every mount
    if (stored?.id) syncStatus(stored)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleClear() {
    try { localStorage.removeItem('drone674_my_appointment') } catch {}
    setAppt(null)
  }

  async function handleCancel() {
    if (!appt?.id) return
    if (!confirm('האם אתה בטוח שברצונך לבטל את התור?')) return

    setCancelling(true)
    try {
      const res = await fetch(`/api/appointments/${appt.id}/cancel`, { method: 'POST' })
      if (res.ok) {
        // Optimistically update UI, then confirm with server
        const updated: StoredAppointment = { ...appt, status: 'בוטל-לקוח' }
        setAppt(updated)
        try { localStorage.setItem('drone674_my_appointment', JSON.stringify(updated)) } catch {}
        // Verify server state
        await syncStatus(updated)
      } else {
        const data: { error?: string } = await res.json()
        alert(data.error ?? 'שגיאה בביטול התור')
      }
    } catch {
      alert('שגיאת רשת, נסה שוב.')
    } finally {
      setCancelling(false)
    }
  }

  if (!loaded) return null

  const statusStyle = appt ? (STATUS_STYLE[appt.status] ?? STATUS_STYLE['ממתין']) : null
  const canCancel   = appt ? CANCELLABLE.includes(appt.status) && !!appt.id : false

  return (
    <>
      {/* ── Header ── */}
      <section style={{
        background: 'linear-gradient(to bottom, var(--bg-section), var(--bg-base))',
        padding: '2.5rem 1.5rem 1.75rem',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <div className="section-head" style={{ margin: 0 }}>
            <h2>// התורים שלי</h2>
            <div className="section-line" />
            <span className="classify-tag">MY APPOINTMENTS</span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '0.6rem', lineHeight: 1.6 }}>
            {appt ? 'תור שנקבע על ידך מוצג למטה.' : 'כאן יופיע התור שתקבע.'}
          </p>
        </div>
      </section>

      {/* ── Content ── */}
      <section style={{ padding: '2rem 1.25rem 4rem' }}>
        <div style={{ maxWidth: 480, margin: '0 auto' }}>

          {appt && statusStyle ? (
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-card)',
              overflow: 'hidden',
            }}>
              {/* Card header */}
              <div style={{
                background: 'var(--bg-section)',
                borderBottom: '1px solid var(--border)',
                padding: '0.85rem 1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <span style={{
                  fontFamily: "'Share Tech Mono', monospace",
                  fontSize: '0.72rem',
                  letterSpacing: '0.08em',
                  color: 'var(--green-primary)',
                }}>
                  📋 תור
                </span>
                {/* Status badge */}
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.3rem',
                  fontSize: '0.72rem',
                  fontFamily: "'Share Tech Mono', monospace",
                  letterSpacing: '0.05em',
                  padding: '0.25rem 0.65rem',
                  borderRadius: '100px',
                  background: statusStyle.bg,
                  border: `1px solid ${statusStyle.border}`,
                  color: statusStyle.text,
                }}>
                  {statusStyle.icon} {statusStyle.label}
                </span>
              </div>

              {/* Card body */}
              <div style={{ padding: '1.25rem', direction: 'rtl' }}>
                {/* Date & Time */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={fieldStyle}>
                    <span style={labelStyle}>📅 תאריך</span>
                    <span style={valueStyle}>{appt.dateDisplay}</span>
                  </div>
                  <div style={fieldStyle}>
                    <span style={labelStyle}>🕐 שעה</span>
                    <span style={valueStyle}>{appt.slot}</span>
                  </div>
                </div>

                {/* Name & Type */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div style={fieldStyle}>
                    <span style={labelStyle}>👤 שם</span>
                    <span style={valueStyle}>{appt.name}</span>
                  </div>
                  <div style={fieldStyle}>
                    <span style={labelStyle}>📋 מטרה</span>
                    <span style={valueStyle}>{appt.type}</span>
                  </div>
                </div>

                {/* Unit */}
                <div style={{ ...fieldStyle, marginBottom: '0.75rem' }}>
                  <span style={labelStyle}>🏛 יחידה</span>
                  <span style={valueStyle}>{appt.unit}</span>
                </div>

                {/* Status messages */}
                {appt.status === 'ממתין' && (
                  <p style={statusNoteStyle}>⏳ התור ממתין לאישור מנהל. תקבל אישור דרך WhatsApp.</p>
                )}
                {appt.status === 'מאושר' && (
                  <p style={{ ...statusNoteStyle, color: '#22c55e' }}>✓ התור אושר! נתראה במעבדה.</p>
                )}
                {appt.status === 'מבוטל' && (
                  <p style={{ ...statusNoteStyle, color: '#ef4444' }}>✕ התור בוטל על ידי המנהל. ניתן לקבוע תור חדש.</p>
                )}
                {appt.status === 'בוטל-לקוח' && (
                  <p style={{ ...statusNoteStyle, color: '#ef4444' }}>✕ ביטלת את התור. ניתן לקבוע תור חדש.</p>
                )}
              </div>

              {/* Card footer */}
              <div style={{
                borderTop: '1px solid var(--border)',
                padding: '1rem 1.25rem',
                display: 'flex',
                gap: '0.65rem',
                flexDirection: 'column',
              }}>
                <Link href="/appointments" className="btn-primary" style={{ display: 'flex', justifyContent: 'center' }}>
                  📅 קבע תור נוסף
                </Link>

                {/* Refresh status */}
                <button
                  onClick={() => appt && syncStatus(appt)}
                  disabled={syncing}
                  style={ghostBtnStyle}
                >
                  {syncing ? '⟳ מעדכן...' : '↻ רענן סטטוס'}
                </button>

                {/* Cancel — only for active appointments */}
                {canCancel && (
                  <button
                    onClick={handleCancel}
                    disabled={cancelling || syncing}
                    style={{
                      ...ghostBtnStyle,
                      border: '1px solid rgba(239,68,68,0.5)',
                      color: '#ef4444',
                      opacity: (cancelling || syncing) ? 0.6 : 1,
                      cursor: (cancelling || syncing) ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {cancelling ? '⟳ מבטל...' : '⊘ בטל את התור'}
                  </button>
                )}

                <button onClick={handleClear} style={ghostBtnStyle}>
                  ✕ נקה רשימה
                </button>
              </div>
            </div>

          ) : (
            /* Empty state */
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-card)',
              padding: '2.5rem 1.5rem',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📋</div>
              <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem', fontSize: '1rem', fontWeight: 700 }}>
                אין תורים פעילים
              </h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.85rem', lineHeight: 1.6 }}>
                לאחר קביעת תור, הוא יופיע כאן באופן אוטומטי.
              </p>
              <Link href="/appointments" className="btn-primary" style={{ display: 'inline-flex', margin: '0 auto' }}>
                📅 קביעת תור
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

/* Shared micro-styles */
const fieldStyle: CSSProperties = {
  background: 'var(--bg-section)',
  border: '1px solid var(--border-subtle)',
  borderRadius: 'var(--radius-sm)',
  padding: '0.6rem 0.75rem',
  display: 'flex',
  flexDirection: 'column',
  gap: '0.25rem',
}
const labelStyle: CSSProperties = {
  fontSize: '0.68rem',
  color: 'var(--text-muted)',
  fontFamily: "'Share Tech Mono', monospace",
  letterSpacing: '0.05em',
}
const valueStyle: CSSProperties = {
  fontSize: '0.88rem',
  color: 'var(--text-primary)',
  fontWeight: 600,
}
const statusNoteStyle: CSSProperties = {
  fontSize: '0.75rem',
  color: 'var(--text-muted)',
  lineHeight: 1.5,
  borderTop: '1px solid var(--border)',
  paddingTop: '0.75rem',
  marginTop: '0.25rem',
}
const ghostBtnStyle: CSSProperties = {
  background: 'transparent',
  border: '1px solid var(--border)',
  borderRadius: 'var(--radius-btn)',
  color: 'var(--text-muted)',
  fontSize: '0.78rem',
  padding: '0.55rem',
  cursor: 'pointer',
  fontFamily: "'Share Tech Mono', monospace",
  letterSpacing: '0.04em',
  width: '100%',
}
