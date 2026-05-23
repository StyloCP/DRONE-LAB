import { NextRequest, NextResponse } from 'next/server'
import { verifyUnitToken } from './lib/auth/unit-token'
import { verifyAdminToken } from './lib/auth/admin-token'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  let response = NextResponse.next({ request })

  // ─── Security headers (all requests) ───
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  // ─── Protect admin dashboard (PIN token) ───
  if (pathname.startsWith('/admin/dashboard')) {
    const token = request.cookies.get('admin_token')?.value
    const valid = token ? await verifyAdminToken(token) : false
    if (!valid) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // ─── Redirect /admin root to dashboard or login ───
  if (pathname === '/admin' || pathname === '/admin/') {
    const token = request.cookies.get('admin_token')?.value
    const valid = token ? await verifyAdminToken(token) : false
    if (valid) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url))
    } else {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // ─── Protect appointments page (requires unit token) ───
  if (
    pathname === '/appointments' ||
    (pathname.startsWith('/appointments') && !pathname.startsWith('/appointments/access'))
  ) {
    const unitToken = request.cookies.get('unit_token')?.value
    const valid = unitToken ? await verifyUnitToken(unitToken) : false
    if (!valid) {
      return NextResponse.redirect(new URL('/appointments/access', request.url))
    }
  }

  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icons|manifest.json|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
