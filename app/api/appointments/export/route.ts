import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/auth/require-admin'
import { buildAppointmentsCsv } from '@/lib/csv'
import type { Appointment } from '@/lib/types'

export async function GET(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const adminClient = createAdminClient()
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
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  await adminClient.from('audit_log').insert([{
    action: 'export_csv',
    admin_email: 'admin',
    ip_address: ip,
  }])

  return new NextResponse(bytes, {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': 'attachment; filename*=UTF-8\'\'%D7%AA%D7%95%D7%A8%D7%99%D7%9D_674.csv',
    },
  })
}
