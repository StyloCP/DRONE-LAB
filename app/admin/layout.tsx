import { ToastProvider } from '@/context/ToastContext'
import Header from '@/components/layout/Header'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <div style={{ minHeight: '100vh', background: 'var(--black)', color: 'var(--text)', direction: 'rtl' }}>
        <Header />
        <main style={{ padding: 'calc(var(--nav-h) + 2rem) 2rem 2rem', maxWidth: 1300, margin: '0 auto', position: 'relative', zIndex: 5 }}>
          {children}
        </main>
      </div>
    </ToastProvider>
  )
}
