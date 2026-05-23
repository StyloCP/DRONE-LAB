import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { isAdmin } from '@/lib/auth/require-admin'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { oldPin?: string; newPin?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  const { oldPin, newPin } = body

  // Validate format
  if (!oldPin || !/^\d{4}$/.test(oldPin)) {
    return NextResponse.json({ error: 'PIN ישן חייב להיות 4 ספרות' }, { status: 400 })
  }
  if (!newPin || !/^\d{4}$/.test(newPin)) {
    return NextResponse.json({ error: 'PIN חדש חייב להיות 4 ספרות' }, { status: 400 })
  }
  if (oldPin === newPin) {
    return NextResponse.json({ error: 'ה-PIN החדש זהה לישן' }, { status: 400 })
  }

  // Get current hash — app_config first, then env var
  let currentHash: string | null = null
  const supabase = createAdminClient()
  try {
    const { data } = await supabase
      .from('app_config')
      .select('value')
      .eq('key', 'admin_pin_hash')
      .maybeSingle()
    if (data?.value) currentHash = data.value
  } catch { /* fall through */ }

  if (!currentHash) {
    currentHash = process.env.ADMIN_PIN_HASH ?? null
  }

  if (!currentHash) {
    return NextResponse.json({ error: 'שגיאת תצורה בשרת' }, { status: 500 })
  }

  // Verify old PIN
  const valid = await bcrypt.compare(oldPin, currentHash)
  if (!valid) {
    return NextResponse.json({ error: 'ה-PIN הישן שגוי' }, { status: 401 })
  }

  // Hash new PIN
  const newHash = await bcrypt.hash(newPin, 12)

  // Upsert to app_config
  const { error: upsertError } = await supabase
    .from('app_config')
    .upsert(
      { key: 'admin_pin_hash', value: newHash, updated_at: new Date().toISOString() },
      { onConflict: 'key' }
    )

  if (upsertError) {
    return NextResponse.json({ error: 'שגיאת מסד נתונים' }, { status: 500 })
  }

  // Audit log
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'

  await supabase.from('audit_log').insert([{
    action: 'change_admin_pin',
    admin_email: 'admin',
    ip_address: ip,
  }])

  return NextResponse.json({ success: true })
}
