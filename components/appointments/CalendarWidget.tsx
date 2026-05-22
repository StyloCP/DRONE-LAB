'use client'

import { HEBREW_DAYS, HEBREW_MONTHS } from '@/lib/types'
import {
  getDaysInMonth,
  getFirstDayOfMonth,
  isPastDate,
  isToday,
  toISODate,
} from '@/lib/dates'

interface CalendarWidgetProps {
  year: number
  month: number
  selectedDate: string | null
  onSelectDate: (isoDate: string) => void
  onChangeMonth: (delta: number) => void
}

export default function CalendarWidget({
  year,
  month,
  selectedDate,
  onSelectDate,
  onChangeMonth,
}: CalendarWidgetProps) {
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)

  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div
      style={{
        border: '1px solid var(--green-dark)',
        background: 'rgba(0,20,0,0.6)',
        padding: '1.5rem',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1.5rem',
        }}
      >
        <button
          onClick={() => onChangeMonth(-1)}
          style={{
            background: 'none',
            border: '1px solid var(--green-dark)',
            color: 'var(--green)',
            width: 36, height: 36,
            cursor: 'pointer',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ▶
        </button>
        <h3
          style={{
            fontFamily: "'Share Tech Mono', monospace",
            color: 'var(--green)',
            fontSize: '1rem',
          }}
        >
          {HEBREW_MONTHS[month]} {year}
        </h3>
        <button
          onClick={() => onChangeMonth(1)}
          style={{
            background: 'none',
            border: '1px solid var(--green-dark)',
            color: 'var(--green)',
            width: 36, height: 36,
            cursor: 'pointer',
            fontSize: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ◀
        </button>
      </div>

      {/* Grid */}
      <div className="cal-grid">
        {HEBREW_DAYS.map(d => (
          <div key={d} className="cal-day-label">{d}</div>
        ))}

        {cells.map((day, i) => {
          if (!day) return <div key={`e-${i}`} className="cal-day empty" />

          const past = isPastDate(year, month, day)
          const sat = new Date(year, month, day).getDay() === 6
          const today = isToday(year, month, day)
          const isoDate = toISODate(year, month, day)
          const isSelected = selectedDate === isoDate
          const disabled = past || sat

          let cls = 'cal-day'
          if (disabled) cls += ' disabled'
          else if (isSelected) cls += ' selected'
          else if (today) cls += ' today'

          return (
            <div
              key={day}
              className={cls}
              onClick={!disabled ? () => onSelectDate(isoDate) : undefined}
            >
              {day}
            </div>
          )
        })}
      </div>
    </div>
  )
}
