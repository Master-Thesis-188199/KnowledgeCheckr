import { NextRequest } from 'next/server'
import { createI18nMiddleware } from 'next-international/middleware'
import i18nConfig from '@/src/i18n/i18nConfig'

const I18nMiddleware = createI18nMiddleware(i18nConfig)

export function proxy(request: NextRequest) {
  const i18nResponse = I18nMiddleware(request)

  i18nResponse.headers.set('x-current-path', request.nextUrl.pathname)
  i18nResponse.headers.set('x-current-href', request.nextUrl.href)

  return i18nResponse
}
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
