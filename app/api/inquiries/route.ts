import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/auth/require-admin'

// GET — admin only
export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const adminClient = createAdminClient()
  const { data, error } = await adminClient
    .from('inquiries')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: 'DB error' }, { status: 500 })
  return NextResponse.json({ inquiries: data })
}

// POST — public (anyone can submit a contact inquiry)
export async function POST(request: NextRequest) {
  let body: Record<string, string>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { name, personal_id, email, unit, type, content } = body

  if (!name || !email || !type || !content) {
    return NextResponse.json({ error: 'שדות חובה חסרים' }, { status: 400 })
  }

  // Basic email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'כתובת דואל לא תקינה' }, { status: 400 })
  }

  const supabase = createAdminClient()
  const { error } = await supabase
    .from('inquiries')
    .insert([{ name, personal_id: personal_id || null, email, unit: unit || null, type, content, status: 'לא נענה' }])

  if (error) return NextResponse.json({ error: 'DB error' }, { status: 500 })
  return NextResponse.json({ success: true }, { status: 201 })
}
