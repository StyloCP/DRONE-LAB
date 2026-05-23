'use client'

import { useState, useEffect } from 'react'

function getDaysCounter(): number {
  const start = new Date('2025-01-19')
  return Math.floor((Date.now() - start.getTime()) / (1000 * 60 * 60 * 24))
}

const SERVICES = [
  'תיקון ואחזקה שוטפת',
  'שדרוג מערכות אוויוניקה',
  'כיול וסנכרון מערכות',
  'הדרכות מפעילים',
  'תמיכה מבצעית 24/7',
]

export default function AboutPage() {
  const [days, setDays] = useState(0)

  useEffect(() => {
    setDays(getDaysCounter())
    const midnight = new Date()
    midnight.setHours(24, 0, 0, 0)
    const t = setTimeout(() => setDays(getDaysCounter()), midnight.getTime() - Date.now())
    return () => clearTimeout(t)
  }, [])

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
            🔒 RESTRICTED ACCESS
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.6rem' }}>
            // אודות המעבדה
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: 580, lineHeight: 1.7, fontSize: '0.93rem' }}>
            מעבדת רחפנים 674 — המרכז המוביל לתחזוקה, פיתוח ושדרוג מערכות UAV בחיל הסיירים.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '2rem 2rem', background: 'var(--bg-section)', borderBottom: '1px solid var(--border)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
          {[
            { value: `${days}+`, label: 'ימים באוויר' },
            { value: 'מרחבי-ארצי', label: 'סוג מענה' },
            { value: '+4', label: 'אנשי צוות' },
            { value: '98%', label: 'ביקורות חיוביות' },
          ].map(stat => (
            <div key={stat.label} className="app-card" style={{ padding: '1.5rem 1.25rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--green-accent)', marginBottom: '0.35rem', fontFamily: "'Heebo', 'Arial Hebrew', Arial, sans-serif" }}>
                {stat.value}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Content */}
      <section style={{ padding: '3rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--green-accent)', marginBottom: '1rem', fontFamily: "'Heebo', 'Arial Hebrew', Arial, sans-serif" }}>// מבוא</h3>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.8, fontSize: '0.9rem' }}>
              מעבדת רחפנים 674 / גדוד הערבה מחנה סיירים — המרכז המוביל לתחזוקה ופיתוח
              מערכות UAV בחיל הסיירים. הצוות שלנו כולל מהנדסים ומנהלי מערכות מוסמכים
              עם ניסיון מבצעי רב.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--green-accent)', marginBottom: '1rem', fontFamily: "'Heebo', 'Arial Hebrew', Arial, sans-serif" }}>// שירותים</h3>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {SERVICES.map(s => (
                <li key={s} style={{
                  display: 'flex', alignItems: 'center', gap: '0.6rem',
                  color: 'var(--text-muted)', fontSize: '0.9rem',
                  padding: '0.5rem 0', borderBottom: '1px solid var(--border)',
                }}>
                  <span style={{ color: 'var(--green-cta)', fontWeight: 700 }}>→</span> {s}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
