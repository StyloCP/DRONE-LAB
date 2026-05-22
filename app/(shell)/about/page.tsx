export default function AboutPage() {
  return (
    <div style={{ padding: '3rem', maxWidth: 1100, margin: '0 auto' }}>
      {/* Section header */}
      <div className="section-head">
        <h2>// אודות המעבדה</h2>
        <div className="section-line" />
        <span className="classify-tag">RESTRICTED ACCESS</span>
      </div>

      {/* Stats grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        <div className="stat-box">
          <div className="stat-num" style={{ fontSize: '1.6rem', fontFamily: "'Heebo', sans-serif", fontWeight: 900 }}>מרחבי-ארצי</div>
          <div className="stat-label">סוג מענה</div>
        </div>
        <div className="stat-box">
          <div className="stat-num">98%</div>
          <div className="stat-label">ביקורות חיוביות</div>
        </div>
        <div className="stat-box">
          <div className="stat-num">4+</div>
          <div className="stat-label">אנשי צוות</div>
        </div>
        <div className="stat-box">
          <div className="stat-num">674</div>
          <div className="stat-label">מספר יחידה</div>
        </div>
      </div>

      {/* Mission card */}
      <div className="mil-card" style={{ marginBottom: '1.5rem' }}>
        <div style={{ lineHeight: 1.9, fontSize: '0.95rem' }}>
          <h3
            style={{
              color: 'var(--green)',
              fontSize: '1rem',
              letterSpacing: '0.05em',
              marginBottom: '0.8rem',
              fontWeight: 900,
              borderBottom: '1px solid var(--green-dark)',
              paddingBottom: '0.5rem',
            }}
          >
            // מבוא
          </h3>
          <p>
            מעבדת רחפנים 674 / גדוד הערבה הינה מרכז תיקונים והחלפות של רחפנים, העוסק בתיקון, החלפת ח&quot;ח
            או החלפה לכלי חדש במידת הצורך ע&quot;פ שיקול דעת הצוות. אפשרות עדכוני אפליקציה / קושחה לצרכים
            מבצעיים, סיור ולוחמה.
          </p>
          <br />
          <p>
            הצוות שלנו מורכב מאנשים מקצועיים אשר עובדים בשיתוף פעולה מלא על מנת לספק פתרונות טכנולוגיים
            חדשניים לזירת הלחימה המודרנית תוך אבחון ופתרון בעיות / תקלות מהיר ומענה איכותי לכלל היחידות.
          </p>
        </div>
      </div>

      {/* Two-col cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1.5rem',
          marginBottom: '1.5rem',
        }}
      >
        <div className="mil-card">
          <h3
            style={{
              color: 'var(--green)',
              fontSize: '1rem',
              fontWeight: 900,
              borderBottom: '1px solid var(--green-dark)',
              paddingBottom: '0.5rem',
              marginBottom: '0.8rem',
            }}
          >
            // תחומי עיסוק
          </h3>
          <ul className="feature-list" style={{ lineHeight: 1.9, fontSize: '0.95rem' }}>
            <li>עדכוני אפליקציה</li>
            <li>עדכוני קושחה</li>
            <li>תיקוני שברים לפי יכולת</li>
            <li>החלפת רחפנים</li>
            <li>החלפה / תיקון התקן הטלה (כדור ברזל)</li>
            <li>יעוץ ופתרון תקלות טלפוני בשלט רחוק</li>
            <li>יכולות אישור / חתימה על השבתה לצורך החלפה</li>
          </ul>
        </div>

        <div className="mil-card">
          <h3
            style={{
              color: 'var(--green)',
              fontSize: '1rem',
              fontWeight: 900,
              borderBottom: '1px solid var(--green-dark)',
              paddingBottom: '0.5rem',
              marginBottom: '0.8rem',
            }}
          >
            // הצהרת ייעוד
          </h3>
          <p style={{ lineHeight: 1.9, fontSize: '0.95rem' }}>
            אנו מתחייבים לשירות מקצועי, מהיר ואדיב, על מנת לשפר את יכולות הלוחמים בגזרתנו תוך שמירה על
            סטנדרטים גבוהים ביותר של אמינות, בטיחות, ואתיקה.
          </p>
          <br />
          <p style={{ lineHeight: 1.9, fontSize: '0.95rem' }}>
            כל פרויקט מתנהל בהתאם לפקודות אבטחה ועומד בדרישות הגבוהות ע&quot;פ נהלי צה&quot;ל!
          </p>
        </div>
      </div>

      {/* Capabilities */}
      <div className="section-head" style={{ marginTop: '2rem' }}>
        <h2>// יכולות מרכזיות</h2>
        <div className="section-line" />
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
        }}
      >
        {[
          { icon: '🔧', label: 'תיקון שברים וח"ח' },
          { icon: '🔍', label: 'אבחון ויכולות השבתה' },
          { icon: '📡', label: 'SIGINT / ELINT' },
          { icon: '🤖', label: 'Autonomous Nav' },
          { icon: '🛡️', label: 'Counter-UAV' },
          { icon: '⚡', label: 'EW Integration' },
        ].map(item => (
          <div key={item.label} className="cap-item">
            <div className="cap-icon">{item.icon}</div>
            {item.label}
          </div>
        ))}
      </div>
    </div>
  )
}
