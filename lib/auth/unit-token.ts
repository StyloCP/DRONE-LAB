import { SignJWT, jwtVerify } from 'jose'

const secret = new TextEncoder().encode(
  process.env.UNIT_JWT_SECRET ?? 'fallback-dev-secret-change-in-production'
)

export interface UnitTokenPayload {
  role: 'unit'
  iat?: number
  exp?: number
}

export async function signUnitToken(): Promise<string> {
  return new SignJWT({ role: 'unit' })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(secret)
}

export async function verifyUnitToken(token: string): Promise<boolean> {
  try {
    const { payload } = await jwtVerify(token, secret)
    return payload.role === 'unit'
  } catch {
    return false
  }
}
