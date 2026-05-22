'use client'

import { useEffect, useState } from 'react'
import { TIME_SLOTS, HEBREW_MONTHS } from '@/lib/types'

interface TimeSlotGridProps {
  selectedDate: string | null        // ISO YYYY-MM-DD
  selectedSlot: string | null
  onSelectSlot: (slot: string) => void
}

export default function TimeSlotGrid({ selectedDate, selectedSlot, onSelectSlot }: TimeSlotGridProps) {
  const [takenSlots, setTakenSlots] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!selectedDate) {
      setTakenSlots([])
      return
    }
    setLoading(true)
    fetch(`/api/slots?date=${selectedDate}`)
      .then(r => r.json())
      .then(data => setTakenSlots(data.taken ?? []))
      .catch(() => setTakenSlots([]))
      .finally(() => setLoading(false))
  }, [selectedDate])

  if (!selectedDate) {
    return (
      <div
        style={{
          textAlign: 'center',
          color: 'var(--muted)',
          fontFamily: "'Share Tech Mono', monospace",
          fontSize: '0.75rem',
          padding: '2rem 1rem',
        }}
      >
        ← בחר תאריך
      </div>
    )
  }

  const [year, month, day] = selectedDate.split('-').map(Number)
  const monthName = HEBREW_MONTHS[month - 1]
  const label = `// שעות זמינות — ${day} ב${monthName} ${year}`

  return (
    <div>
      <h3
        style={{
          fontFamily: "'Share Tech Mono', monospace",
          color: 'var(--green)',
          fontSize: '0.85rem',
          marginBottom: '1.2rem',
          borderBottom: '1px solid var(--green-dark)',
          paddingBottom: '0.8rem',
        }}
      >
        {loading ? '// טוען שעות...' : label}
      </h3>

      <div className="slots-grid">
        {TIME_SLOTS.map(slot => {
          const taken = takenSlots.includes(slot)
          const isSelected = selectedSlot === slot
          let cls = 'slot'
          if (taken) cls += ' taken'
          else if (isSelected) cls += ' selected'

          return (
            <div
              key={slot}
              className={cls}
              onClick={!taken ? () => onSelectSlot(slot) : undefined}
            >
              {taken ? `${slot} — תפוס` : slot}
            </div>
          )
        })}
      </div>
    </div>
  )
}
