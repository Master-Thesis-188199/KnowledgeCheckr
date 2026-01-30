import { headers } from 'next/headers'
import i18nConfig from '@/src/i18n/i18nConfig'
import _logger from '@/src/lib/log/Logger'
import env from '@/src/lib/Shared/Env'

const logger = _logger.createModuleLogger('/' + import.meta.url.split('/').reverse().slice(0, 2).reverse().join('/')!)

/**
 * This util function returns the referer so long as the referer is not the same as the current page.
 */
export default async function getReferer() {
  const header = await headers()

  const currentPath = stripLocale(header.get('x-current-path'))
  let referer = stripLocale(header.get('referer'))

  referer = referer?.replace(env.NEXT_PUBLIC_BASE_URL, '') ?? null

  if (!referer) return undefined

  if (currentPath === referer) {
    logger.verbose('Referer matches current location, discarding referer.')
    return undefined
  }

  return referer
}
/**
 * This simple utility function takes in a given url pathname and removes the leading locale (e.g. '/en', '/de', ..) from the path in case a locale is present.
 * @param pathname The pathname to analyze and strip of the locale from
 * @returns The sanitized pathname without any leading locale segment.
 */
function stripLocale(pathname: string | null) {
  for (const locale of i18nConfig.locales) {
    if (pathname?.startsWith(`/${locale}/`)) {
      return pathname.replace(`${locale}/`, '')
    }
  }
  // unchanged url --> no locale
  return pathname
}
