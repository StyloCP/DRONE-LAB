'use client'

import { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

const NAV_ITEMS = [
  { href: '/', label: 'דף הבית' },
  { href: '/appointments', label: 'קביעת תור' },
  { href: '/my-appointments', label: 'התורים שלי' },
  { href: '/instructions', label: 'פעילות' },
  { href: '/about', label: 'אודותינו' },
  { href: '/contact', label: 'צור קשר' },
]

export default function Header() {
  const pathname = usePathname()
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)

  // Tap-counter refs for logo double-tap → admin
  const tapCountRef = useRef(0)
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Prevent double-fire: if onTouchEnd fires, skip the subsequent onClick
  const logoTouchHandled = useRef(false)
  const hamTouchHandled = useRef(false)

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  const doLogoTap = () => {
    tapCountRef.current += 1
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current)
    if (tapCountRef.current >= 2) {
      tapCountRef.current = 0
      window.location.href = '/admin/login'
    } else {
      tapTimerRef.current = setTimeout(() => {
        tapCountRef.current = 0
        router.push('/')
      }, 400)
    }
  }

  // Mobile: onTouchEnd fires first — mark handled, then act
  const handleLogoTouch = (e: React.TouchEvent) => {
    logoTouchHandled.current = true
    doLogoTap()
  }

  // Desktop fallback: onClick skips if touch already handled it
  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (logoTouchHandled.current) {
      logoTouchHandled.current = false
      return
    }
    doLogoTap()
  }

  // Mobile: onTouchEnd fires first
  const handleHamburgerTouch = (e: React.TouchEvent) => {
    hamTouchHandled.current = true
    setMenuOpen(v => !v)
  }

  // Desktop fallback
  const handleHamburgerClick = () => {
    if (hamTouchHandled.current) {
      hamTouchHandled.current = false
      return
    }
    setMenuOpen(v => !v)
  }

  return (
    <>
      <header className="new-header">

        {/* FIRST in DOM = visual RIGHT in RTL: Brand + logo */}
        <Link
          href="/"
          className="new-header-brand"
          onClick={handleLogoClick}
          onTouchEnd={handleLogoTouch}
          style={{ touchAction: 'manipulation' }}
        >
          <div className="new-header-brand-text">
            <h1>מעבדת רחפנים 674</h1>
            <p>מחנה סיירים</p>
          </div>
          <div className="new-header-logo">
            <Image
              src="/images/logo-new.png"
              alt="סמל מעבדת רחפנים 674"
              width={90}
              height={52}
              style={{ objectFit: 'contain', pointerEvents: 'none' }}
              draggable={false}
              priority
            />
          </div>
        </Link>

        {/* CENTER: nav links */}
        <nav className="new-header-nav" aria-label="ניווט ראשי">
          {NAV_ITEMS.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={isActive(item.href) ? 'active' : ''}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* LAST in DOM = visual LEFT in RTL: antenna + status + hamburger */}
        <div className="new-header-left">
          <div className="new-header-antenna" title="מצב מערכת: פעיל">
            <span style={{ fontSize: '1.1rem' }}>📡</span>
          </div>
          <div className="new-status-dot" />
          <button
            className="new-header-hamburger"
            onClick={handleHamburgerClick}
            onTouchEnd={handleHamburgerTouch}
            aria-label="תפריט"
            style={{ touchAction: 'manipulation' }}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      {/* Conditional rendering: overlay is NOT in the DOM when closed.
          This prevents iOS Safari compositing-layer touch-event absorption. */}
      {menuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMenuOpen(false)}>
          <div className="mobile-menu-inner" onClick={e => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <Image
                src="/images/logo-new.png"
                alt="לוגו"
                width={60}
                height={46}
                style={{ objectFit: 'contain' }}
                draggable={false}
              />
              <div>
                <div style={{ color: 'var(--green-primary)', fontWeight: 900, fontSize: '0.95rem' }}>מעבדת רחפנים 674</div>
                <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', fontFamily: "'Share Tech Mono', monospace" }}>מחנה סיירים</div>
              </div>
            </div>
            {NAV_ITEMS.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                className={`mobile-menu-link${isActive(item.href) ? ' active' : ''}`}
                onClick={() => setMenuOpen(false)}
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <span className="mobile-menu-link-num">0{i + 1}</span>
                <span>{item.label}</span>
                {isActive(item.href) && <span className="mobile-menu-link-dot" />}
              </Link>
            ))}
            <button
              className="mobile-menu-close"
              onClick={() => setMenuOpen(false)}
              aria-label="סגור תפריט"
            >
              ✕ סגור
            </button>
          </div>
        </div>
      )}
    </>
  )
}
