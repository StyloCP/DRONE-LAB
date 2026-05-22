'use client'

import { useEffect, useState } from 'react'
import Header from './Header'
import TabNav from './TabNav'
import { ToastProvider } from '@/context/ToastContext'

export default function ShellClient({ children }: { children: React.ReactNode }) {
  const [adminVisible, setAdminVisible] = useState(false)

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setAdminVisible(true)
      }
    }
    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [])

  function handleRevealAdmin() {
    setAdminVisible(true)
  }

  return (
    <ToastProvider>
      <div id="drone-trail" className="drone-trail" />
      <Header onRevealAdmin={handleRevealAdmin} />
      <TabNav adminVisible={adminVisible} />
      <main
        className="shell-content"
        style={{ position: 'relative', zIndex: 5 }}
      >
        {children}
      </main>
      <footer>
        <div>© 2025 יחידה 674 — מעבדת רחפנים. כל הזכויות שמורות.</div>
        <div>גישה מורשית בלבד | AUTHORIZED ACCESS ONLY</div>
        <div>v3.0.0 // SECURE CHANNEL</div>
      </footer>
    </ToastProvider>
  )
}
