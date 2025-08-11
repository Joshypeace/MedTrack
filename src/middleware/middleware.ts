// middleware.ts
import { auth } from '../lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_ROUTES = ['/api/inventory', '/api/logs']
const WORKER_ROUTES = ['/api/sales']

export async function middleware(request: NextRequest) {
  const session = await auth()
  const pathname = request.nextUrl.pathname

  // Redirect to login if not authenticated
  if (!session?.user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Check if user is trying to access admin routes
  const isAdminRoute = ADMIN_ROUTES.some((route) =>
    pathname.startsWith(route)
  )

  if (isAdminRoute && session.user.role !== 'ADMIN') {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 403 }
    )
  }

  // Check if user is trying to access worker routes
  const isWorkerRoute = WORKER_ROUTES.some((route) =>
    pathname.startsWith(route)
  )

  if (isWorkerRoute && !['ADMIN', 'WORKER'].includes(session.user.role)) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 403 }
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/api/inventory/:path*', '/api/sales/:path*', '/api/logs/:path*'],
}