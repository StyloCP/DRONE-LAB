'use client'

import { useCallback, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import AppointmentsTable from '@/components/admin/AppointmentsTable'
import InquiriesTable from '@/components/admin/InquiriesTable'
import { useRealtimeDashboard } from '@/hooks/useRealtimeDashboard'
import { useToast } from '@/context/ToastContext'
import type { Appointment, Inquiry } from '@/lib/types'

export default function DashboardPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const { showToast } = useToast()

  const fetchAppointments = useCallback(async () => {
    const res = await fetch('/api/appointments')
    if (res.ok) {
      const data = await res.json()
      setAppointments(data.appointments ?? [])
    } else if (res.status === 401) {
      router.push('/admin/login')
    }
  }, [router])

  const fetchInquiries = useCallback(async () => {
    const res = await fetch('/api/inquiries')
    if (res.ok) {
      const data = await res.json()
      setInquiries(data.inquiries ?? [])
    }
  }, [])

  useEffect(() => {
    Promise.all([fetchAppointments(), fetchInquiries()])
      .finally(() => setLoading(false))
  }, [fetchAppointments, fetchInquiries])

  useRealtimeDashboard({
    onAppointmentChange: fetchAppointments,
    onInquiryChange: fetchInquiries,
  })

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/admin/login')
    router.refresh()
  }

  async function handleExportCSV() {
    const res = await fetch('/api/appointments/export')
    if (res.ok) {
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'תורים_674.csv'
      a.click()
      URL.revokeObjectURL(url)
    } else {
      showToast('⚠ שגיאה בייצוא CSV')
    }
  }

  async function handleClearAll() {
    if (!confirm('למחוק את כל התורים? פעולה זו אינה הפיכה.')) return
    const res = await fetch('/api/appointments', { method: 'DELETE' })
    if (res.ok) {
      showToast('✓ כל התורים נמחקו')
      fetchAppointments()
    } else {
      showToast('⚠ שגיאה במחיקה')
    }
  }

  const pendingInquiries = inquiries.filter(i => i.status === 'לא נענה').length

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', fontFamily: "'Share Tech Mono', monospace", color: 'var(--muted)' }}>
        טוען נתונים...
      </div>
    )
  }

  return (
    <div>
      {/* Header controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.8rem' }}>
        <div className="section-head" style={{ margin: 0 }}>
          <h2>// לוח מנהל — תורים</h2>
          <div className="section-line" />
          <span className="classify-tag">ADMIN ACCESS</span>
        </div>

        <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap' }}>
          <button className="mil-btn" onClick={handleExportCSV}>
            <span className="mil-btn-text">⟫ ייצא CSV</span>
          </button>
          <button
            className="mil-btn"
            onClick={handleClearAll}
            style={{ borderColor: '#ff4444', color: '#ff4444' }}
          >
            <span className="mil-btn-text">✕ נקה הכל</span>
          </button>
          <button
            className="mil-btn"
            onClick={handleLogout}
            style={{ borderColor: 'var(--muted)', color: 'var(--muted)' }}
          >
            <span className="mil-btn-text">⟪ התנתק</span>
          </button>
        </div>
      </div>

      {/* Appointments */}
      <AppointmentsTable
        appointments={appointments}
        total={appointments.length}
        onRefresh={fetchAppointments}
      />

      {/* Inquiries */}
      <InquiriesTable
        inquiries={inquiries}
        total={inquiries.length}
        pending={pendingInquiries}
        onRefresh={fetchInquiries}
      />
    </div>
  )
}
