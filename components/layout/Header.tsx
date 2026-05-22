'use client'

import { useEffect, useState } from 'react'
import { getDaysCounter } from '@/lib/dates'

interface HeaderProps {
  onRevealAdmin?: () => void
}

export default function Header({ onRevealAdmin }: HeaderProps) {
  const [time, setTime] = useState('')
  const [days, setDays] = useState(0)

  useEffect(() => {
    setDays(getDaysCounter())

    const updateClock = () => {
      setTime(
        new Date().toLocaleTimeString('he-IL', { hour12: false }) + ' IL'
      )
    }
    updateClock()
    const id = setInterval(updateClock, 1000)

    // Midnight days counter update
    const now = new Date()
    const msToMidnight =
      new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime()
    const midnightTimer = setTimeout(() => {
      setDays(getDaysCounter())
    }, msToMidnight)

    return () => {
      clearInterval(id)
      clearTimeout(midnightTimer)
    }
  }, [])

  return (
    <header
      style={{
        position: 'relative',
        zIndex: 10,
        borderBottom: '1px solid var(--green-dark)',
        background: 'linear-gradient(180deg, rgba(0,30,0,0.95) 0%, rgba(5,10,5,0.9) 100%)',
        padding: '0 3rem',
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '1rem 0',
          borderBottom: '1px solid var(--green-dark)',
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '0.7rem',
          color: 'var(--muted)',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <span className="blink" />
          <span>SYSTEM STATUS: OPERATIONAL</span>
          <span>|</span>
          <span>{time}</span>
        </div>
        <div>מעבדת רחפנים - 674 - ערבה</div>
      </div>

      {/* Hero title */}
      <div
        style={{
          padding: '2.5rem 0 2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
        }}
      >
        <div
          className="unit-badge-anim"
          onDoubleClick={onRevealAdmin}
          style={{
            width: 72, height: 72,
            border: '2px solid var(--green)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Share Tech Mono', monospace",
            fontSize: '0.65rem',
            color: 'var(--green)',
            textAlign: 'center',
            lineHeight: 1.3,
            flexShrink: 0,
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          יחידה<br />674<br />◈
        </div>

        <div>
          <h1
            style={{
              fontSize: 'clamp(1.8rem, 4vw, 3.2rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            <span
              style={{
                display: 'block',
                color: 'var(--green)',
                textShadow: '0 0 30px rgba(0,255,65,0.6)',
              }}
            >
              מעבדת רחפנים 674
            </span>
            גדוד הערבה מחנה סיירים
            <div
              style={{
                fontSize: '0.9rem',
                fontWeight: 300,
                color: 'var(--muted)',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                fontFamily: "'Share Tech Mono', monospace",
                marginTop: '0.3rem',
              }}
            >
              Military UAV Research Laboratory // Unit 674
            </div>
          </h1>
        </div>

        {/* Days counter - hidden on very small screens */}
        <div style={{ marginRight: 'auto', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div className="stat-num" style={{ fontSize: '2rem' }}>{days}+</div>
          <div className="stat-label">ימים באוויר</div>
        </div>
      </div>
    </header>
  )
}
