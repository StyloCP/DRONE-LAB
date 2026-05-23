import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'

// POST — client self-cancellation (no admin auth; UUID is the secret)
export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // Validate UUID format
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id)) {
    return NextResponse.json({ error: 'Invalid ID' }, { status: 400 })
  }

  const adminClient = createAdminClient()

  // Fetch current status — only allow cancelling active appointments
  const { data: appt } = await adminClient
    .from('appointments')
    .select('id, status')
    .eq('id', id)
    .single()

  if (!appt) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  if (!['ממתין', 'מאושר'].includes(appt.status)) {
    return NextResponse.json({ error: 'Cannot cancel this appointment' }, { status: 409 })
  }

  const { error } = await adminClient
    .from('appointments')
    .update({ status: 'בוטל-לקוח' })
    .eq('id', id)

  if (error) return NextResponse.json({ error: 'DB error' }, { status: 500 })

  return NextResponse.json({ success: true })
}
