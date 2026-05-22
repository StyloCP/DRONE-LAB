import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { buildAppointmentsCsv } from '@/lib/csv'
import type { Appointment } from '@/lib/types'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const adminClient = await createAdminClient()
  const { data, error } = await adminClient
    .from('appointments')
    .select('*')
    .order('date', { ascending: true })
    .order('slot', { ascending: true })

  if (error) return NextResponse.json({ error: 'DB error' }, { status: 500 })

  if (!data || data.length === 0) {
    return NextResponse.json({ error: 'אין תורים לייצוא' }, { status: 404 })
  }

  const csv = buildAppointmentsCsv(data as Appointment[])
  const bytes = new TextEncoder().encode(csv)

  // Audit
  await adminClient.from('audit_log').insert([{
    action: 'export_csv',
    admin_email: user.email,
  }])

  return new NextResponse(bytes, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename*=UTF-8\'\'%D7%AA%D7%95%D7%A8%D7%99%D7%9D_674.csv',
    },
  })
}
