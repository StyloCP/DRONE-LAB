'use client'

import type { Inquiry } from '@/lib/types'
import { useToast } from '@/context/ToastContext'

interface Props {
  inquiries: Inquiry[]
  total: number
  pending: number
  onRefresh: () => void
}

export default function InquiriesTable({ inquiries, total, pending, onRefresh }: Props) {
  const { showToast } = useToast()

  async function updateStatus(id: string, status: 'בטיפול' | 'טופל') {
    const res = await fetch(`/api/inquiries/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) { showToast('✓ סטטוס עודכן'); onRefresh() }
    else showToast('⚠ שגיאה בעדכון')
  }

  async function deleteInquiry(id: string) {
    if (!confirm('למחוק פנייה זו?')) return
    const res = await fetch(`/api/inquiries/${id}`, { method: 'DELETE' })
    if (res.ok) { showToast('✓ הפנייה נמחקה'); onRefresh() }
    else showToast('⚠ שגיאה במחיקה')
  }

  const statusColor = (s: string) =>
    s === 'טופל' ? '#00ff41' : s === 'בטיפול' ? '#ff9900' : '#ff4444'

  return (
    <div style={{ marginTop: '3rem' }}>
      <div className="section-head">
        <h2>// פניות צור קשר</h2>
        <div className="section-line" />
        <div style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.8rem', color: 'var(--muted)' }}>
          סה&quot;כ: <span style={{ color: 'var(--green)' }}>{total}</span>
          {' | '}
          לא נענו: <span style={{ color: '#ff9900' }}>{pending}</span>
        </div>
      </div>

      {inquiries.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem', fontFamily: "'Share Tech Mono', monospace", fontSize: '0.8rem', color: 'var(--muted)' }}>
          אין פניות עדיין
        </div>
      ) : (
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table className="admin-table" style={{ minWidth: 700 }}>
            <thead>
              <tr>
                {['#','שם','מספר אישי','דואל','יחידה','סוג פנייה','תוכן','נשלח ב','סטטוס','פעולות'].map(h => (
                  <th key={h}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inq, i) => (
                <tr key={inq.id}>
                  <td style={{ fontFamily: "'Share Tech Mono', monospace", color: 'var(--muted)', fontSize: '0.75rem' }}>{i + 1}</td>
                  <td style={{ fontWeight: 600 }}>{inq.name}</td>
                  <td style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.8rem' }}>{inq.personal_id ?? '—'}</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--muted)' }}>{inq.email}</td>
                  <td style={{ fontSize: '0.8rem' }}>{inq.unit ?? '—'}</td>
                  <td style={{ fontSize: '0.8rem' }}>{inq.type}</td>
                  <td
                    style={{ fontSize: '0.8rem', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                    title={inq.content}
                  >
                    {inq.content}
                  </td>
                  <td style={{ fontFamily: "'Share Tech Mono', monospace", fontSize: '0.7rem', color: 'var(--muted)' }}>
                    {new Date(inq.created_at).toLocaleString('he-IL')}
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    <span
                      style={{
                        fontFamily: "'Share Tech Mono', monospace",
                        fontSize: '0.7rem',
                        color: statusColor(inq.status),
                        border: `1px solid ${statusColor(inq.status)}`,
                        padding: '0.2rem 0.5rem',
                      }}
                    >
                      {inq.status}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center', whiteSpace: 'nowrap' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                      {inq.status === 'לא נענה' && (
                        <ActionBtn color="#ff9900" onClick={() => updateStatus(inq.id, 'בטיפול')}>⟫ בטיפול</ActionBtn>
                      )}
                      {inq.status !== 'טופל' && (
                        <ActionBtn color="#00ff41" onClick={() => updateStatus(inq.id, 'טופל')}>✓ טופל</ActionBtn>
                      )}
                      <ActionBtn color="#ff4444" onClick={() => deleteInquiry(inq.id)}>✕</ActionBtn>
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
        fontSize: '0.7rem',
        padding: '0.3rem 0.5rem',
        cursor: 'pointer',
        whiteSpace: 'nowrap',
        minHeight: 32,
      }}
    >
      {children}
    </button>
  )
}
