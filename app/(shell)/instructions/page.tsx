const GUIDES = [
  { icon: '🚁', title: 'נהלי הפעלה בסיסיים', desc: 'נהלי תפעול בטוחים של מערכות במסגרת המעבדה.', available: true },
  { icon: '🔧', title: 'נהלי תחזוקה מנעתית', desc: 'לוח זמנים ונהלי תחזוקה תקופתית לסוגי הרחפנים השונים.', available: true },
  { icon: '⚡', title: 'פתרון תקלות נפוצות', desc: 'אבחון ופתרון תקלות נפוצות בשטח ובמעבדה.', available: true },
  { icon: '📡', title: 'כיול מערכות תקשורת', desc: 'נוהל כיול ובדיקת מערכות קישוריות ותקשורת.', available: true },
  { icon: '🛡️', title: 'נהלי בטיחות', desc: 'תקנות ונהלי בטיחות לעבודה עם מערכות UAV.', available: true },
]

export default function InstructionsPage() {
  return (
    <>
      <section style={{
        background: 'linear-gradient(to bottom, var(--bg-section), var(--bg-base))',
        padding: '3rem 2rem 2rem',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            background: 'rgba(58,150,53,0.12)', border: '1px solid rgba(58,150,53,0.25)',
            borderRadius: 20, padding: '0.25rem 0.85rem',
            fontSize: '0.78rem', color: 'var(--green-accent)', marginBottom: '1.25rem',
          }}>
            📖 TRAINING MATERIALS
          </div>
          <h2 style={{ fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.6rem' }}>
            // פעילות ונהלים
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: 580, lineHeight: 1.7, fontSize: '0.93rem' }}>
            חומרי הדרכה ונהלי עבודה לצוות המעבדה ולמפעילי מערכות UAV.
          </p>
        </div>
      </section>

      <section style={{ padding: '2.5rem 2rem' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gap: '0.875rem' }}>
          {GUIDES.map(g => (
            <div key={g.title} className="app-card" style={{
              padding: '1.375rem 1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1.25rem',
            }}>
              <div style={{
                width: 52, height: 52, flexShrink: 0,
                background: 'var(--bg-card-hover)',
                borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.5rem',
              }}>
                {g.icon}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>{g.title}</div>
                <div style={{ fontSize: '0.83rem', color: 'var(--text-muted)' }}>{g.desc}</div>
              </div>
              <div style={{
                fontSize: '0.75rem',
                background: g.available ? 'rgba(34,197,94,0.1)' : 'rgba(100,100,100,0.08)',
                color: g.available ? 'var(--green-status)' : 'var(--text-label)',
                border: `1px solid ${g.available ? 'rgba(34,197,94,0.2)' : 'var(--border)'}`,
                borderRadius: 20,
                padding: '0.2rem 0.7rem',
                flexShrink: 0,
                whiteSpace: 'nowrap',
              }}>
                {g.available ? 'זמין' : 'בקרוב'}
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
