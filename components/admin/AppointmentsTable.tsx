'use client'

import type { Appointment } from '@/lib/types'
import { generateApprovalLink, generateCancellationLink, formatDateHebrew } from '@/lib/whatsapp'
import { useToast } from '@/context/ToastContext'

interface Props {
  appointments: Appointment[]
  total: number
  onRefresh: () => void
}

export default function AppointmentsTable({ appointments, total, onRefresh }: Props) {
  const { showToast } = useToast()

  async function updateStatus(id: string, status: 'מאושר' | 'מבוטל', appt: Appointment) {
    try {
      const res = await fetch(`/api/appointments/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      const data = await res.json()
      if (res.ok) {
        if (data.whatsapp_link) {
          window.open(data.whatsapp_link, '_blank')
        }
        showToast(status === 'מאושר' ? '✓ התור אושר ונשלחה הודעת WhatsApp' : '✓ התור בוטל')
        onRefresh()
      } else {
        showToast('⚠ שגיאה בעדכון סטטוס')
      }
    } catch {
      showToast('⚠ שגיאת רשת')
    }
  }

  async function deleteAppt(id: string) {
    if (!confirm('למחוק תור זה?')) return
    const res = await fetch(`/api/appointments/${id}`, { method: 'DELETE' })
    if (res.ok) { showToast('✓ התור נמחק'); onRefresh() }
    else showToast('⚠ שגיאה במחיקה')
  }

  function resendWhatsApp(appt: Appointment) {
    const link = appt.status === 'מאושר'
      ? generateApprovalLink(appt)
      : generateCancellationLink(appt)
    window.open(link, '_blank')
  }

  const statusColor = (s: string) =>
    s === 'מאושר' ? '#00ff41' : s === 'מבוטל' ? '#ff4444' : '#ff9900'

  return (
    <div>
      {/* Counter */}
      <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.8rem', color: 'var(--muted)', marginBottom: '1rem' }}>
        סה&quot;כ תורים: <span style={{ color: 'var(--green)' }}>{total}</span>
      </div>

      {appointments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.8rem', color: 'var(--muted)' }}>
          אין תורים קבועים עדיין
        </div>
      ) : (
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table className="admin-table">
            <thead>
              <tr>
                {['#','שם','מספר אישי','יחידה','פלאפון','תאריך','שעה','סוג','סטטוס','פעולות'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {appointments.map((a, i) => (
                <tr key={a.id}>
                  <td style={{ fontFamily: "'Share Tech Mono', monospace", color: 'var(--muted)', fontSize: '0.75rem' }}>{i + 1}</td>
                  <td style={{ fontWeight: 600 }}>{a.name}</td>
                  <td style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.8rem' }}>{a.personal_id}</td>
                  <td style={{ fontSize: '0.85rem' }}>{a.unit}</td>
                  <td style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.8rem', direction: 'ltr' }}>{a.phone}</td>
                  <td style={{ fontSize: '0.85rem' }}>{formatDateHebrew(a.date)}</td>
                  <td style={{ fontFamily: "'Share Tech Mono', monospace", color: 'var(--green)' }}>{a.slot}</td>
                  <td style={{ fontSize: '0.82rem', color: 'var(--muted)' }}>{a.type}</td>
                  <td style={{ textAlign: 'center' }}>
                    <span
                      style={{
                        fontFamily: "'Share Tech Mono', monospace",
                        fontSize: '0.7rem',
                        color: statusColor(a.status),
                        border: `1px solid ${statusColor(a.status)}`,
                        padding: '0.2rem 0.5rem',
                      }}
                    >
                      {a.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                      {a.status === 'ממתין' && (
                        <ActionBtn color="#00ff41" onClick={() => updateStatus(a.id, 'מאושר', a)}>✓ אשר</ActionBtn>
                      )}
                      {(a.status === 'מאושר' || a.status === 'מבוטל') && (
                        <ActionBtn color="#25D366" onClick={() => resendWhatsApp(a)}>📲</ActionBtn>
                      )}
                      {a.status !== 'מבוטל' && (
                        <ActionBtn color="#ff9900" onClick={() => updateStatus(a.id, 'מבוטל', a)}>⊘ בטל</ActionBtn>
                      )}
                      <ActionBtn color="#ff4444" onClick={() => deleteAppt(a.id)}>✕</ActionBtn>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function ActionBtn({ color, onClick, children }: { color: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'none',
        border: `1px solid ${color}`,
        color,
        fontSize: '0.75rem',
        padding: '0.3rem 0.6rem',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        minHeight: 32,
      }}
    >
      {children}
    </button>
  )
}
