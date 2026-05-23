import Link from 'next/link'

const FEATURES = [
  { icon: '🛡️', title: 'שירות מקצועי',      desc: 'צוות מיומן ומנוסה מספק שירות איכותי ומהיר.',                  href: '/about' },
  { icon: '🛠️', title: 'תיקונים ושדרוגים',   desc: 'תיקון תקלות, שדרוג מערכות והתאמה למשימות.',                    href: '/appointments' },
  { icon: '🛸', title: 'טכנולוגיה מתקדמת',  desc: 'עבודה עם הציוד והטכנולוגיות המתקדמות ביותר.',                  href: '/instructions' },
  { icon: '✅', title: 'אמינות ובטיחות',     desc: 'סטנדרטים גבוהים לשמירה על בטיחות ואמינות.',                   href: '/about' },
]

const FOOTER_ITEMS = [
  { icon: '🕐', label: "ימים א'–ה'",        value: '08:00 – 16:00' },
  { icon: '📍', label: 'מיקום: מחנה סיירים', value: '' },
  { icon: '📧', label: 'NONE',              value: '' },
  { icon: '🔒', label: 'שמור ובטוח',        value: '' },
]

export default function HomePage() {
  return (
    <div className="home-page">
      {/* ─── Hero ─── */}
      <section className="hero-section">
        <div className="hero-bg" />
        <div className="hero-content">
          <div className="hero-text animate-fadeIn">
            <div className="hero-badge">
              <span>🛡️</span>
              <span>מוצפן מקצה לקצה</span>
            </div>
            <h1 className="hero-title">
              ברוכים הבאים<br />
              למעבדת רחפנים <span className="highlight">674</span>
            </h1>
            <p className="hero-subtitle">מחנה סיירים</p>
            <p className="hero-description">
              אנו מספקים שירותי אחזקה, תיקון ושדרוג רחפנים<br />
              ברמה הגבוהה ביותר, עם מקצועיות וחדשנות טכנולוגית.
            </p>
            <div className="hero-actions">
              <Link href="/appointments" className="btn-primary">📅 קביעת תור</Link>
              <Link href="/about" className="btn-outline">ℹ️ מידע נוסף</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Feature Cards ─── */}
      <section className="features-section">
        <div className="features-grid">
          {FEATURES.map(f => (
            <Link key={f.title} href={f.href} className="feature-card">
              <div className="card-icon">{f.icon}</div>
              <h3 className="card-title">{f.title}</h3>
              <p className="card-description">{f.desc}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Footer Bar ─── */}
      <footer className="new-footer">
        <div className="new-footer-inner">
          <div className="new-footer-brand">
            מעבדת רחפנים 674
            <span>מחנה סיירים</span>
          </div>
          <div className="footer-items">
            {FOOTER_ITEMS.map(item => (
              <div key={item.label} className="footer-item">
                <span className="footer-item-icon">{item.icon}</span>
                <span>
                  {item.value
                    ? <><strong>{item.label}</strong> {item.value}</>
                    : <strong>{item.label}</strong>}
                </span>
              </div>
            ))}
          </div>
          <div className="footer-status">
            <span className="footer-status-dot" />
            <span>SYSTEM ONLINE</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
