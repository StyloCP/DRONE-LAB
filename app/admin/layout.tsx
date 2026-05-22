import { ToastProvider } from '@/context/ToastContext'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div style={{ minHeight: '100vh', background: 'var(--black)', color: 'var(--text)', direction: 'rtl' }}>
        {/* Admin header */}
        <header
          style={{
            borderBottom: '1px solid var(--green-dark)',
            background: 'linear-gradient(180deg, rgba(0,30,0,0.95) 0%, rgba(5,10,5,0.9) 100%)',
            padding: '1rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span className="blink" />
            <span
              style={{
                fontFamily: "'Share Tech Mono', monospace",
                fontSize: '0.75rem',
                color: 'var(--muted)',
              }}
            >
              ADMIN // מעבדת רחפנים 674
            </span>
          </div>
          <span className="classify-tag">ADMIN ACCESS</span>
        </header>

        <main style={{ padding: '2rem', maxWidth: 1300, margin: '0 auto', position: 'relative', zIndex: 5 }}>
          {children}
        </main>
      </div>
    </ToastProvider>
  )
}
