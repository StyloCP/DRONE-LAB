import type { Appointment } from './types'
import { HEBREW_MONTHS } from './types'

export function normalizeIsraeliPhone(phone: string): string {
  const clean = phone.replace(/[\s\-()]/g, '')
  if (clean.startsWith('00972')) return clean.slice(2)
  if (clean.startsWith('+972')) return '972' + clean.slice(4)
  if (clean.startsWith('0')) return '972' + clean.slice(1)
  return clean
}

export function formatDateHebrew(dateStr: string): string {
  const [year, month, day] = dateStr.split('-')
  const monthName = HEBREW_MONTHS[parseInt(month, 10) - 1] ?? month
  return `${parseInt(day, 10)} ב${monthName} ${year}`
}

export function generateApprovalLink(appt: Appointment): string {
  const phone = normalizeIsraeliPhone(appt.phone)
  const dateDisplay = formatDateHebrew(appt.date)
  const msg = encodeURIComponent(
    `✅ *מעבדת רחפנים 674 - גדוד הערבה*\n\n` +
    `שלום ${appt.name},\n\nהתור אושר!\n\n` +
    `📅 תאריך: ${dateDisplay}\n` +
    `🕐 שעה: ${appt.slot}\n` +
    `📋 מטרה: ${appt.type}\n\n` +
    `נא להגיע עם הטפסים הדרושים.\n\nבברכה, מעבדת רחפנים 674`
  )
  return `https://wa.me/${phone}?text=${msg}`
}

export function generateCancellationLink(appt: Appointment): string {
  const phone = normalizeIsraeliPhone(appt.phone)
  const dateDisplay = formatDateHebrew(appt.date)
  const msg = encodeURIComponent(
    `❌ *מעבדת רחפנים 674 - גדוד הערבה*\n\n` +
    `שלום ${appt.name},\n\nלצערנו התור שלך בוטל.\n\n` +
    `📅 תאריך: ${dateDisplay}\n` +
    `🕐 שעה: ${appt.slot}\n` +
    `📋 מטרה: ${appt.type}\n\n` +
    `לקביעת תור חדש ניתן לפנות אלינו.\n\nבברכה, מעבדת רחפנים 674`
  )
  return `https://wa.me/${phone}?text=${msg}`
}
