import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function proxy(request: NextRequest) {
  const headers = new Headers(request.headers)
  headers.set('x-current-path', request.nextUrl.pathname)
  headers.set('x-current-href', request.nextUrl.href)
  return NextResponse.next({ request: { headers } })
}
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
