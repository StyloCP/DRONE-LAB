import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { signUnitToken } from '@/lib/auth/unit-token'
import { checkRateLimit, recordFailedAttempt, clearAttempts } from '@/lib/auth/rate-limiter'

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

  const hash = process.env.UNIT_ACCESS_CODE_HASH
  const plainCode = process.env.UNIT_ACCESS_CODE

  let valid = false

  if (hash) {
    valid = await bcrypt.compare(code, hash)
  } else if (plainCode) {
    // Fallback for development — compare plain text
    valid = code === plainCode
  } else {
    // No code configured
    return NextResponse.json({ error: 'Server misconfiguration' }, { status: 500 })
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
