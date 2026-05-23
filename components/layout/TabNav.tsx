'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const BOTTOM_NAV = [
  { href: '/my-appointments', label: 'התורים שלי', icon: '📋' },
  { href: '/appointments', label: 'קביעת תור', icon: '📅' },
  { href: '/', label: 'דף הבית', icon: '🏠' },
  { href: '/instructions', label: 'פעילות', icon: '📖' },
  { href: '/contact', label: 'צור קשר', icon: 'ℹ️' },
]

export default function TabNav() {
  const pathname = usePathname()

  // Don't show on admin pages
  if (pathname.startsWith('/admin')) return null

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <nav className="new-bottom-nav" aria-label="ניווט תחתון">
      <div className="new-bottom-nav-inner">
        {BOTTOM_NAV.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={isActive(item.href) ? 'active' : ''}
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  )
}
