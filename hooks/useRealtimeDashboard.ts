'use client'

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Options {
  onAppointmentChange: () => void
  onInquiryChange: () => void
}

export function useRealtimeDashboard({ onAppointmentChange, onInquiryChange }: Options) {
  useEffect(() => {
    const supabase = createClient()

    const channel = supabase
      .channel('admin-dashboard')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'appointments' },
        () => onAppointmentChange()
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'inquiries' },
        () => onInquiryChange()
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [onAppointmentChange, onInquiryChange])
}
