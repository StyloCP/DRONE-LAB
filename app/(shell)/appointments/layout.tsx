import { cookies } from 'next/headers'
import { verifyUnitToken } from '@/lib/auth/unit-token'
import AccessGate from '@/components/appointments/AccessGate'
import SessionCleaner from '@/components/appointments/SessionCleaner'

export default async function AppointmentsLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const token = cookieStore.get('unit_token')?.value
  const authorized = token ? await verifyUnitToken(token) : false

  if (!authorized) {
    return <AccessGate />
  }

  return (
    <>
      <SessionCleaner />
      {children}
    </>
  )
}
