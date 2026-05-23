import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { isAdmin } from '@/lib/auth/require-admin'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { newCode?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { newCode } = body

  if (!newCode || typeof newCode !== 'string') {
    return NextResponse.json({ error: 'קוד גישה חדש נדרש' }, { status: 400 })
  }

  if (newCode.length < 4) {
    return NextResponse.json({ error: 'קוד גישה חייב להכיל לפחות 4 תווים' }, { status: 400 })
  }

  if (newCode.length > 100) {
    return NextResponse.json({ error: 'קוד גישה ארוך מדי' }, { status: 400 })
  }

  // Hash with bcrypt cost factor 12
  const newHash = await bcrypt.hash(newCode, 12)

  const supabase = createAdminClient()
  const { error } = await supabase
    .from('app_config')
    .upsert(
      { key: 'unit_access_code_hash', value: newHash, updated_at: new Date().toISOString() },
      { onConflict: 'key' }
    )

  if (error) {
    return NextResponse.json({ error: 'שגיאת מסד נתונים' }, { status: 500 })
  }

  // Audit log
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'

  await supabase.from('audit_log').insert([{
    action: 'change_unit_access_code',
    admin_email: 'admin',
    ip_address: ip,
  }])

  return NextResponse.json({ success: true })
}
