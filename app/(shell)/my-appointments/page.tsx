import Link from 'next/link'

export default function MyAppointmentsPage() {
  return (
    <>
      <section style={{
        background: 'linear-gradient(to bottom, var(--bg-section), var(--bg-base))',
        padding: '3rem 2rem 2rem',
        borderBottom: '1px solid var(--border)',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem,3.5vw,2.6rem)', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '0.6rem' }}>
            // הזמנות שלי
          </h2>
          <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, fontSize: '0.93rem' }}>
            לצפייה בתורים קיימים, יש לפנות לרכז המעבדה.
          </p>
        </div>
      </section>

      <section style={{ padding: '3rem 2rem' }}>
        <div style={{
          maxWidth: 480, margin: '0 auto',
          background: 'var(--bg-card)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-card)',
          padding: '2.5rem',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📋</div>
          <h3 style={{ color: 'var(--text-primary)', marginBottom: '0.75rem', fontSize: '1.1rem', fontWeight: 700 }}>
            אין תורים פעילים
          </h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.75rem', fontSize: '0.88rem', lineHeight: 1.6 }}>
            לקביעת תור חדש, יש להזין את קוד הגישה של היחידה.
          </p>
          <Link
            href="/appointments"
            className="btn-primary"
            style={{ display: 'inline-flex', margin: '0 auto' }}
          >
            📅 קביעת תור חדש
          </Link>
        </div>
      </section>
    </>
  )
}
