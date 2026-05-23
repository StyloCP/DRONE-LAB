'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Header from './Header'
import TabNav from './TabNav'
import { ToastProvider } from '@/context/ToastContext'

export default function ShellClient({ children }: { children: React.ReactNode }) {
  const [, setAdminVisible] = useState(false)
  const pathname = usePathname()
  const [transitioning, setTransitioning] = useState(false)

  useEffect(() => {
    // Trigger enter animation on route change
    setTransitioning(true)
    const t = setTimeout(() => setTransitioning(false), 350)
    return () => clearTimeout(t)
  }, [pathname])

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        setAdminVisible(true)
        window.location.href = '/admin/login'
      }
    }
    document.addEventListener('keydown', handleKeydown)
    return () => document.removeEventListener('keydown', handleKeydown)
  }, [])

  return (
    <ToastProvider>
      <Header />
      <TabNav />
      <main
        className={`new-shell-content${transitioning ? ' page-enter' : ''}`}
        style={{ position: 'relative', zIndex: 1 }}
      >
        {children}
      </main>
    </ToastProvider>
  )
}
