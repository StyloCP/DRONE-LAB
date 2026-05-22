import type { Appointment } from './types'
import { HEBREW_MONTHS } from './types'

function formatDateHebrew(dateStr: string): string {
  const [year, month, day] = dateStr.split('-')
  const monthName = HEBREW_MONTHS[parseInt(month, 10) - 1] ?? month
  return `${parseInt(day, 10)} ב${monthName} ${year}`
}

function escapeCsvCell(value: string | number | null | undefined): string {
  const str = String(value ?? '')
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`
  }
  return str
}

export function buildAppointmentsCsv(appointments: Appointment[]): string {
  const headers = ['#', 'שם', 'מספר אישי', 'יחידה', 'פלאפון', 'תאריך', 'שעה', 'סוג', 'סטטוס', 'נקבע ב']

  const rows = appointments.map((a, i) => [
    i + 1,
    a.name,
    a.personal_id,
    a.unit,
    a.phone,
    formatDateHebrew(a.date),
    a.slot,
    a.type,
    a.status,
    new Date(a.created_at).toLocaleString('he-IL'),
  ])

  const lines = [headers, ...rows].map(row =>
    row.map(cell => escapeCsvCell(cell as string)).join(',')
  )

  // BOM prefix for Hebrew Excel compatibility
  return '﻿' + lines.join('\n')
}
