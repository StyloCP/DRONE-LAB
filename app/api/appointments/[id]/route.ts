import { NextRequest, NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase/server'
import { generateApprovalLink, generateCancellationLink } from '@/lib/whatsapp'
import type { Appointment } from '@/lib/types'

async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// PATCH — update appointment status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const body = await request.json()
  const { status } = body as { status: 'מאושר' | 'מבוטל' }

  if (!['מאושר', 'מבוטל'].includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
  }

  const adminClient = await createAdminClient()

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
  await adminClient.from('audit_log').insert([{
    action: status === 'מאושר' ? 'approve_appointment' : 'cancel_appointment',
    target_id: id,
    admin_email: user.email,
    ip_address: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim(),
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
  const user = await requireAdmin()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await params
  const adminClient = await createAdminClient()

  const { error } = await adminClient.from('appointments').delete().eq('id', id)
  if (error) return NextResponse.json({ error: 'DB error' }, { status: 500 })

  await adminClient.from('audit_log').insert([{
    action: 'delete_appointment',
    target_id: id,
    admin_email: user.email,
  }])

  return NextResponse.json({ success: true })
}
