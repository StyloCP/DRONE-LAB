import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { signUnitToken } from '@/lib/auth/unit-token'
import { checkRateLimit, recordFailedAttempt, clearAttempts } from '@/lib/auth/rate-limiter'
import { createAdminClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'

  // Rate limit check
  const rateCheck = checkRateLimit(ip)
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: `יותר מדי ניסיונות. נסה שוב בעוד ${Math.ceil((rateCheck.retryAfterMs ?? 0) / 60000)} דקות.`, retryAfterMs: rateCheck.retryAfterMs },
      { status: 429 }
    )
  }

  let body: { code?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { code } = body
  if (!code || typeof code !== 'string') {
    return NextResponse.json({ error: 'קוד גישה נדרש' }, { status: 400 })
  }

  // --- Hash resolution: DB first, env fallback ---
  let hash: string | null = null
  let usePlainFallback = false

  try {
    const supabase = createAdminClient()
    const { data } = await supabase
      .from('app_config')
      .select('value')
      .eq('key', 'unit_access_code_hash')
      .maybeSingle()
    if (data?.value) hash = data.value
  } catch {
    // DB unreachable — fall through to env vars
  }

  if (!hash) hash = process.env.UNIT_ACCESS_CODE_HASH ?? null

  if (!hash) {
    const plainCode = process.env.UNIT_ACCESS_CODE
    if (plainCode) { usePlainFallback = true; hash = plainCode }
  }

  if (!hash) {
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
  }

  let valid = false
  if (usePlainFallback) {
    valid = code === hash
  } else {
    valid = await bcrypt.compare(code, hash)
  }

  if (!valid) {
    recordFailedAttempt(ip)
    return NextResponse.json({ error: 'קוד גישה שגוי' }, { status: 401 })
  }

  // Success — clear failed attempts, issue token via httpOnly cookie
  clearAttempts(ip)
  const token = await signUnitToken()

  const response = NextResponse.json({ success: true })
  response.cookies.set('unit_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24,    // 24h
    path: '/',
  })

  return response
}
