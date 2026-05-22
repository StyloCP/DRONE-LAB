'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'

const TABS = [
  { id: 'about',        href: '/about',        icon: '◉', label: 'ברוכים הבאים' },
  { id: 'gallery',      href: '/gallery',       icon: '▣', label: 'גלריה'         },
  { id: 'appointments', href: '/appointments',  icon: '▦', label: 'קביעת תור'     },
  { id: 'contact',      href: '/contact',       icon: '◈', label: 'צור קשר'       },
]

const ADMIN_TAB = { id: 'admin', href: '/admin', icon: '🔐', label: 'מנהל' }

interface TabNavProps {
  adminVisible: boolean
}

export default function TabNav({ adminVisible }: TabNavProps) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const allTabs = adminVisible ? [...TABS, ADMIN_TAB] : TABS

  const isActive = (href: string) => {
    if (!mounted) return false
    if (href === '/appointments') return pathname.startsWith('/appointments')
    if (href === '/admin') return pathname.startsWith('/admin')
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <>
      {/* Desktop nav (top) */}
      <nav
        style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          justifyContent: 'center',
          background: 'rgba(0,15,0,0.95)',
          borderBottom: '2px solid var(--green-dark)',
          overflowX: 'auto',
          WebkitOverflowScrolling: 'touch',
        }}
      >
        {allTabs.map(tab => {
          const active = isActive(tab.href)
          return (
            <Link
              key={tab.id}
              href={tab.href}
              style={{
                background: active ? 'rgba(0,255,65,0.05)' : 'none',
                border: 'none',
                borderLeft: '1px solid var(--green-dark)',
                color: active ? 'var(--green)' : 'var(--muted)',
                fontFamily: "'Heebo', sans-serif",
                fontWeight: 700,
                fontSize: '0.9rem',
                letterSpacing: '0.05em',
                padding: '1rem 1.8rem',
                cursor: 'pointer',
                position: 'relative',
                whiteSpace: 'nowrap',
                textDecoration: 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                transition: 'color 0.2s',
              }}
            >
              <span style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{tab.icon}</span>
              {tab.label}
              {/* Active indicator */}
              {active && (
                <span
                  style={{
                    position: 'absolute',
                    bottom: -2, left: 0, right: 0,
                    height: 2,
                    background: 'var(--green)',
                    boxShadow: '0 0 10px var(--green)',
                  }}
                />
              )}
            </Link>
          )
        })}
      </nav>

      {/* Mobile bottom nav */}
      <nav className="bottom-nav">
        {allTabs.map(tab => {
          const active = isActive(tab.href)
          return (
            <Link
              key={tab.id}
              href={tab.href}
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0.6rem 0.2rem',
                color: active ? 'var(--green)' : 'var(--muted)',
                textDecoration: 'none',
                fontSize: '0.65rem',
                fontFamily: "'Heebo', sans-serif",
                fontWeight: 700,
                gap: '0.15rem',
                minHeight: 56,
                borderTop: active ? '2px solid var(--green)' : '2px solid transparent',
                transition: 'color 0.2s',
              }}
            >
              <span style={{ fontSize: '1.1rem' }}>{tab.icon}</span>
              {tab.label}
            </Link>
          )
        })}
      </nav>
    </>
  )
}
