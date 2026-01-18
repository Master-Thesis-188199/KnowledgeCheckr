import type { NextRequest } from 'next/server'
import { createI18nMiddleware } from 'next-international/middleware'
import i18nConfig from '@/src/i18n/i18nConfig'

const I18nMiddleware = createI18nMiddleware(i18nConfig)

export function proxy(request: NextRequest) {
  return I18nMiddleware(request)
}
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
