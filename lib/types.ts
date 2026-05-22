export type AppointmentStatus = 'ממתין' | 'מאושר' | 'מבוטל'
export type InquiryStatus = 'לא נענה' | 'בטיפול' | 'טופל'

export type AppointmentType =
  | 'אישור כשירות'
  | 'תיקונים בח"ח'
  | 'החלפת כלים מושבתים'
  | 'עדכון אפליקציה / קושחה'
  | 'דיון / שיחה'

export type InquiryType =
  | 'בקשת שיתוף פעולה'
  | 'הפניית פרויקט'
  | 'שאלה טכנית'
  | 'ביקור / סיור'
  | 'אחר'

export interface Appointment {
  id: string
  name: string
  personal_id: string
  unit: string
  type: AppointmentType | string
  phone: string
  date: string        // ISO: YYYY-MM-DD
  slot: string        // '08:00'
  status: AppointmentStatus
  created_at: string
}

export interface Inquiry {
  id: string
  name: string
  personal_id?: string | null
  email: string
  unit?: string | null
  type: InquiryType | string
  content: string
  status: InquiryStatus
  created_at: string
}

export interface AuditLog {
  id: string
  action: string
  target_id?: string | null
  admin_email?: string | null
  ip_address?: string | null
  created_at: string
}

export const TIME_SLOTS = [
  '08:00','08:30','09:00','09:30','10:00','10:30','11:00','11:30',
  '12:00','13:00','13:30','14:00','14:30','15:00','15:30','16:00','16:30',
] as const

export type TimeSlot = typeof TIME_SLOTS[number]

export const APPOINTMENT_TYPES: AppointmentType[] = [
  'אישור כשירות',
  'תיקונים בח"ח',
  'החלפת כלים מושבתים',
  'עדכון אפליקציה / קושחה',
  'דיון / שיחה',
]

export const INQUIRY_TYPES: InquiryType[] = [
  'בקשת שיתוף פעולה',
  'הפניית פרויקט',
  'שאלה טכנית',
  'ביקור / סיור',
  'אחר',
]

export const HEBREW_MONTHS = [
  'ינואר','פברואר','מרץ','אפריל','מאי','יוני',
  'יולי','אוגוסט','ספטמבר','אוקטובר','נובמבר','דצמבר',
]

export const HEBREW_DAYS = ['א׳','ב׳','ג׳','ד׳','ה׳','ו׳','ש׳']
