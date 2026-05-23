interface LogoSVGProps {
  size?: number
  color?: string
  className?: string
}

// IDF-style drone badge — wide wings + central rotor + "674"
// Matches the actual unit insignia (gold/olive color by default)
export default function LogoSVG({ size = 56, color = '#C8A84B', className = '' }: LogoSVGProps) {
  const w = Math.round(size * 1.9)
  const h = Math.round(size * 1.1)
  return (
    <svg
      width={w}
      height={h}
      viewBox="0 0 110 62"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="מעבדת רחפנים 674 לוגו"
    >
      {/* ── Left wing (RTL visual right) ── */}
      {/* Primary wing sweep */}
      <path
        d="M55 22 C50 19 44 17 37 16 C30 15 22 15 14 17 C10 18 7 19 5 21 C8 20 13 20 18 21 C13 22 9 24 7 26 C10 25 15 25 20 26 C15 27 11 29 10 31 C13 30 18 30 23 31 C20 32 17 34 18 36 C21 34 26 33 31 33 C28 35 27 37 28 39 C30 37 34 36 38 36 C36 38 37 40 39 41"
        stroke={color}
        strokeWidth="1.3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
      {/* Upper feather accent */}
      <path
        d="M55 22 C49 18 42 16 34 15 C28 14 21 15 15 17"
        stroke={color}
        strokeWidth="0.8"
        fill="none"
        strokeLinecap="round"
        opacity="0.5"
      />
      {/* Wing feather lines */}
      <path d="M20 21 L16 28" stroke={color} strokeWidth="0.7" strokeLinecap="round" opacity="0.4" />
      <path d="M27 20 L24 28" stroke={color} strokeWidth="0.7" strokeLinecap="round" opacity="0.4" />
      <path d="M35 18 L33 27" stroke={color} strokeWidth="0.7" strokeLinecap="round" opacity="0.4" />
      <path d="M43 17 L42 25" stroke={color} strokeWidth="0.7" strokeLinecap="round" opacity="0.4" />

      {/* ── Right wing (RTL visual left) ── */}
      <path
        d="M55 22 C60 19 66 17 73 16 C80 15 88 15 96 17 C100 18 103 19 105 21 C102 20 97 20 92 21 C97 22 101 24 103 26 C100 25 95 25 90 26 C95 27 99 29 100 31 C97 30 92 30 87 31 C90 32 93 34 92 36 C89 34 84 33 79 33 C82 35 83 37 82 39 C80 37 76 36 72 36 C74 38 73 40 71 41"
        stroke={color}
        strokeWidth="1.3"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <path
        d="M55 22 C61 18 68 16 76 15 C82 14 89 15 95 17"
        stroke={color}
        strokeWidth="0.8"
        fill="none"
        strokeLinecap="round"
        opacity="0.5"
      />
      <path d="M90 21 L94 28" stroke={color} strokeWidth="0.7" strokeLinecap="round" opacity="0.4" />
      <path d="M83 20 L86 28" stroke={color} strokeWidth="0.7" strokeLinecap="round" opacity="0.4" />
      <path d="M75 18 L77 27" stroke={color} strokeWidth="0.7" strokeLinecap="round" opacity="0.4" />
      <path d="M67 17 L68 25" stroke={color} strokeWidth="0.7" strokeLinecap="round" opacity="0.4" />

      {/* ── Central drone rotor body ── */}
      {/* Outer ring */}
      <circle cx="55" cy="26" r="10" stroke={color} strokeWidth="1.4" fill={`${color}15`} />
      {/* Inner ring */}
      <circle cx="55" cy="26" r="6" stroke={color} strokeWidth="0.9" fill={`${color}10`} />
      {/* Center hub */}
      <circle cx="55" cy="26" r="2.5" stroke={color} strokeWidth="0.8" fill={`${color}30`} />
      {/* Rotor arms — 4-arm drone top view */}
      <line x1="55" y1="16" x2="55" y2="36" stroke={color} strokeWidth="0.9" opacity="0.8" />
      <line x1="45" y1="26" x2="65" y2="26" stroke={color} strokeWidth="0.9" opacity="0.8" />
      {/* Diagonal rotor marks */}
      <line x1="48" y1="19" x2="62" y2="33" stroke={color} strokeWidth="0.5" opacity="0.35" />
      <line x1="62" y1="19" x2="48" y2="33" stroke={color} strokeWidth="0.5" opacity="0.35" />
      {/* Rotor tips (small circles at arm ends) */}
      <circle cx="55" cy="17" r="1.5" fill={color} opacity="0.7" />
      <circle cx="55" cy="35" r="1.5" fill={color} opacity="0.7" />
      <circle cx="46" cy="26" r="1.5" fill={color} opacity="0.7" />
      <circle cx="64" cy="26" r="1.5" fill={color} opacity="0.7" />

      {/* ── Divider line ── */}
      <line x1="20" y1="46" x2="90" y2="46" stroke={color} strokeWidth="0.5" opacity="0.35" />

      {/* ── "674" text ── */}
      <text
        x="55"
        y="57"
        textAnchor="middle"
        fill={color}
        fontSize="11"
        fontFamily="'Share Tech Mono', monospace"
        letterSpacing="4"
        fontWeight="bold"
        opacity="0.95"
      >
        674
      </text>
    </svg>
  )
}
