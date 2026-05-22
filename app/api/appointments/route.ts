import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { verifyUnitToken } from '@/lib/auth/unit-token'
import { cookies } from 'next/headers'
import { isSaturday, isPastDate } from '@/lib/dates'
import { TIME_SLOTS } from '@/lib/types'

// GET — admin only (full list)
export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const adminClient = await createAdminClient()
  const { data, error } = await adminClient
    .from('appointments')
    .select('*')
    .order('date', { ascending: true })
    .order('slot', { ascending: true })

  if (error) return NextResponse.json({ error: 'DB error' }, { status: 500 })
  return NextResponse.json({ appointments: data })
}

// POST — requires unit token
export async function POST(request: NextRequest) {
  // Verify unit token from cookie
  const cookieStore = await cookies()
  const unitToken = cookieStore.get('unit_token')?.value

  if (!unitToken || !(await verifyUnitToken(unitToken))) {
    return NextResponse.json({ error: 'Unauthorized — unit access required' }, { status: 401 })
  }

  let body: Record<string, string>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { name, personal_id, unit, type, phone, date, slot } = body

  // Validate required fields
  if (!name || !personal_id || !unit || !type || !phone || !date || !slot) {
    return NextResponse.json({ error: 'כל שדות החובה נדרשים' }, { status: 400 })
  }

  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: 'Invalid date format' }, { status: 400 })
  }

  // Validate slot
  if (!(TIME_SLOTS as readonly string[]).includes(slot)) {
    return NextResponse.json({ error: 'Invalid time slot' }, { status: 400 })
  }

  // Validate date is not past or Saturday
  const [y, m, d] = date.split('-').map(Number)
  if (isPastDate(y, m - 1, d)) {
    return NextResponse.json({ error: 'לא ניתן לקבוע תור בתאריך שעבר' }, { status: 400 })
  }
  if (isSaturday(new Date(y, m - 1, d))) {
    return NextResponse.json({ error: 'לא ניתן לקבוע תור בשבת' }, { status: 400 })
  }

  // Insert (UNIQUE(date, slot) prevents double-booking at DB level)
  const supabase = await createAdminClient()
  const { data, error } = await supabase
    .from('appointments')
    .insert([{ name, personal_id, unit, type, phone, date, slot, status: 'ממתין' }])
    .select('id, date, slot')
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'השעה הזו כבר תפוסה' }, { status: 409 })
    }
    return NextResponse.json({ error: 'DB error' }, { status: 500 })
  }

  return NextResponse.json({ success: true, date: data.date, slot: data.slot }, { status: 201 })
}

// DELETE — admin only (clear all)
export async function DELETE() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const adminClient = await createAdminClient()
  const { error } = await adminClient.from('appointments').delete().neq('id', '00000000-0000-0000-0000-000000000000')

  if (error) return NextResponse.json({ error: 'DB error' }, { status: 500 })

  // Audit log
  await adminClient.from('audit_log').insert([{
    action: 'clear_all_appointments',
    admin_email: user.email,
  }])

  return NextResponse.json({ success: true })
}
