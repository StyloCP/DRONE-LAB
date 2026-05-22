// In-memory rate limiter (resets on server restart)
// For production, replace with Redis/Upstash

const attempts = new Map<string, { count: number; firstAt: number }>()

const MAX_ATTEMPTS = 5
const WINDOW_MS = 15 * 60 * 1000  // 15 minutes

export function checkRateLimit(ip: string): { allowed: boolean; retryAfterMs?: number } {
  const now = Date.now()
  const entry = attempts.get(ip)

  if (!entry) {
    attempts.set(ip, { count: 1, firstAt: now })
    return { allowed: true }
  }

  if (now - entry.firstAt > WINDOW_MS) {
    // Window expired — reset
    attempts.set(ip, { count: 1, firstAt: now })
    return { allowed: true }
  }

  if (entry.count >= MAX_ATTEMPTS) {
    const retryAfterMs = WINDOW_MS - (now - entry.firstAt)
    return { allowed: false, retryAfterMs }
  }

  entry.count++
  return { allowed: true }
}

export function recordFailedAttempt(ip: string): void {
  const now = Date.now()
  const entry = attempts.get(ip)

  if (!entry || now - entry.firstAt > WINDOW_MS) {
    attempts.set(ip, { count: 1, firstAt: now })
  } else {
    entry.count++
  }
}

export function clearAttempts(ip: string): void {
  attempts.delete(ip)
}
