'use client'

import { useState } from 'react'
import CalendarWidget from '@/components/appointments/CalendarWidget'
import TimeSlotGrid from '@/components/appointments/TimeSlotGrid'
import AppointmentForm from '@/components/appointments/AppointmentForm'

export default function AppointmentsPage() {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null)
  const [refreshKey, setRefreshKey] = useState(0)

  function handleChangeMonth(delta: number) {
    let newMonth = month + delta
    let newYear = year
    if (newMonth > 11) { newMonth = 0; newYear++ }
    if (newMonth < 0) { newMonth = 11; newYear-- }
    setMonth(newMonth)
    setYear(newYear)
    setSelectedDate(null)
    setSelectedSlot(null)
  }

  function handleSelectDate(isoDate: string) {
    setSelectedDate(isoDate)
    setSelectedSlot(null)
  }

  function handleSuccess() {
    setSelectedSlot(null)
    setRefreshKey(k => k + 1)
  }

  return (
    <div style={{ padding: '3rem', maxWidth: 1100, margin: '0 auto' }}>
      <div className="section-head">
        <h2>// קביעת תור</h2>
        <div className="section-line" />
        <span className="classify-tag">SCHEDULING SYSTEM</span>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          gap: '2rem',
        }}
      >
        {/* Left: Calendar + instructions */}
        <div>
          <CalendarWidget
            year={year}
            month={month}
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
            onChangeMonth={handleChangeMonth}
          />

          <div className="mil-card" style={{ marginTop: '1.5rem' }}>
            <h3
              style={{
                color: 'var(--green)',
                fontSize: '1rem',
                fontWeight: 900,
                borderBottom: '1px solid var(--green-dark)',
                paddingBottom: '0.5rem',
                marginBottom: '0.8rem',
              }}
            >
              // הוראות
            </h3>
            <ul className="feature-list" style={{ lineHeight: 1.9, fontSize: '0.9rem' }}>
              <li>בחר תאריך זמין בלוח השנה</li>
              <li>בחר שעה פנויה מהרשימה</li>
              <li>מלא את פרטיך האישיים ומטרת הביקור</li>
              <li>קבל אישור בדוא&quot;ל המוסדי / אישי שלך</li>
              <li>הגעה עם הטפסים הנדרשים ע&quot;י המעבדה</li>
            </ul>
          </div>
        </div>

        {/* Right: Time slots + form */}
        <div
          style={{
            border: '1px solid var(--green-dark)',
            background: 'rgba(0,20,0,0.6)',
            padding: '1.5rem',
          }}
        >
          <TimeSlotGrid
            key={`${selectedDate}-${refreshKey}`}
            selectedDate={selectedDate}
            selectedSlot={selectedSlot}
            onSelectSlot={setSelectedSlot}
          />

          {selectedDate && (
            <AppointmentForm
              selectedDate={selectedDate}
              selectedSlot={selectedSlot}
              onSuccess={handleSuccess}
            />
          )}
        </div>
      </div>
    </div>
  )
}
