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

  const step = !selectedDate ? 1 : !selectedSlot ? 2 : 3

  return (
    <div className="page-content" style={{ padding: '2.5rem 2rem 3rem', maxWidth: 1100, margin: '0 auto' }}>
      {/* Section heading */}
      <div className="section-head">
        <h2>// קביעת תור</h2>
        <div className="section-line" />
        <span className="classify-tag">SCHEDULING SYSTEM</span>
      </div>

      {/* Step progress indicator */}
      <div className="appt-steps">
        <div className={`appt-step ${step >= 1 ? (step > 1 ? 'done' : 'active') : ''}`}>
          <span className="appt-step-num">{step > 1 ? '✓' : '①'}</span>
          <span>בחירת תאריך</span>
        </div>
        <div className="appt-step-connector" />
        <div className={`appt-step ${step >= 2 ? (step > 2 ? 'done' : 'active') : ''}`}>
          <span className="appt-step-num">{step > 2 ? '✓' : '②'}</span>
          <span>בחירת שעה</span>
        </div>
        <div className="appt-step-connector" />
        <div className={`appt-step ${step >= 3 ? 'active' : ''}`}>
          <span className="appt-step-num">③</span>
          <span>מילוי פרטים</span>
        </div>
      </div>

      {/* Main layout */}
      <div
        className="appt-layout"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 380px',
          gap: '1.75rem',
        }}
      >
        {/* Right: Calendar + instructions */}
        <div>
          <CalendarWidget
            year={year}
            month={month}
            selectedDate={selectedDate}
            onSelectDate={handleSelectDate}
            onChangeMonth={handleChangeMonth}
          />

          <div className="mil-card" style={{ marginTop: '1.25rem' }}>
            <h3
              style={{
                color: 'var(--green)',
                fontSize: '0.9rem',
                fontWeight: 700,
                borderBottom: '1px solid var(--green-dark)',
                paddingBottom: '0.5rem',
                marginBottom: '0.8rem',
                fontFamily: "'Share Tech Mono', monospace",
                letterSpacing: '0.08em',
              }}
            >
              📋 הוראות קביעת תור
            </h3>
            <ul className="feature-list" style={{ lineHeight: 1.85, fontSize: '0.875rem' }}>
              <li>בחר תאריך זמין בלוח השנה</li>
              <li>בחר שעה פנויה מהרשימה</li>
              <li>מלא את פרטיך האישיים ומטרת הביקור</li>
              <li>קבל אישור בדוא&quot;ל המוסדי / אישי שלך</li>
              <li>הגעה עם הטפסים הנדרשים ע&quot;י המעבדה</li>
            </ul>
          </div>
        </div>

        {/* Left: Time slots + form */}
        <div
          className="mil-card"
          style={{ padding: '1.5rem', alignSelf: 'start' }}
        >
          <h3
            style={{
              color: 'var(--green)',
              fontSize: '0.9rem',
              fontFamily: "'Share Tech Mono', monospace",
              letterSpacing: '0.08em',
              marginBottom: '1rem',
              paddingBottom: '0.6rem',
              borderBottom: '1px solid var(--green-dark)',
            }}
          >
            🕐 {selectedDate ? `שעות פנויות` : 'בחר תאריך תחילה'}
          </h3>

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
