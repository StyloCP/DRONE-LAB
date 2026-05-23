import { cookies } from 'next/headers'
import { verifyAdminToken } from './admin-token'

/** Returns true if the current request carries a valid admin token. */
export async function isAdmin(): Promise<boolean> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('admin_token')?.value
    if (!token) return false
    return verifyAdminToken(token)
  } catch {
    return false
  }
}
