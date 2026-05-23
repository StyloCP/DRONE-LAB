import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { signAdminToken } from '@/lib/auth/admin-token'
import { checkRateLimit, recordFailedAttempt, clearAttempts } from '@/lib/auth/rate-limiter'

export async function POST(request: NextRequest) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    ?? request.headers.get('x-real-ip')
    ?? 'unknown'

  // Rate limit — 5 attempts per 15 minutes per IP
  const rateCheck = checkRateLimit(ip + ':admin')
  if (!rateCheck.allowed) {
    return NextResponse.json(
      { error: `יותר מדי ניסיונות. נסה שוב בעוד ${Math.ceil((rateCheck.retryAfterMs ?? 0) / 60000)} דקות.`, retryAfterMs: rateCheck.retryAfterMs },
      { status: 429 }
    )
  }

  let body: { pin?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const { pin } = body
  if (!pin || typeof pin !== 'string' || !/^\d{4}$/.test(pin)) {
    return NextResponse.json({ error: 'PIN חייב להיות 4 ספרות' }, { status: 400 })
  }

  const hash = process.env.ADMIN_PIN_HASH
  if (!hash) {
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
  }

  const valid = await bcrypt.compare(pin, hash)

  if (!valid) {
    recordFailedAttempt(ip + ':admin')
    return NextResponse.json({ error: 'PIN שגוי' }, { status: 401 })
  }

  clearAttempts(ip + ':admin')
  const token = await signAdminToken()

  const response = NextResponse.json({ success: true })
  response.cookies.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 8,   // 8h
    path: '/',
  })

  return response
}
