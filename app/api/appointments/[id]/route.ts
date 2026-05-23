import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/auth/require-admin'
import { generateApprovalLink, generateCancellationLink } from '@/lib/whatsapp'
import type { Appointment } from '@/lib/types'

// PATCH — update appointment status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json()
  const { status } = body as { status: 'מאושר' | 'מבוטל' }

  if (!['מאושר', 'מבוטל'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const adminClient = createAdminClient()

  const { data: appt, error: fetchError } = await adminClient
    .from('appointments')
    .select('*')
    .eq('id', id)
    .single()

  if (fetchError || !appt) {
    return NextResponse.json({ error: 'Appointment not found' }, { status: 404 })
  }

  const { error: updateError } = await adminClient
    .from('appointments')
    .update({ status })
    .eq('id', id)

  if (updateError) return NextResponse.json({ error: 'DB error' }, { status: 500 })

  // Audit log
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  await adminClient.from('audit_log').insert([{
    action: status === 'מאושר' ? 'approve_appointment' : 'cancel_appointment',
    target_id: id,
    admin_email: 'admin',
    ip_address: ip,
  }])

  // Generate WhatsApp link
  const fullAppt = appt as Appointment
  fullAppt.status = status
  const whatsapp_link = status === 'מאושר'
    ? generateApprovalLink(fullAppt)
    : generateCancellationLink(fullAppt)

  return NextResponse.json({ success: true, whatsapp_link })
}

// DELETE — remove appointment
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await params
  const adminClient = createAdminClient()

  const { error } = await adminClient.from('appointments').delete().eq('id', id)
  if (error) return NextResponse.json({ error: 'DB error' }, { status: 500 })

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  await adminClient.from('audit_log').insert([{
    action: 'delete_appointment',
    target_id: id,
    admin_email: 'admin',
    ip_address: ip,
  }])

  return NextResponse.json({ success: true })
}
