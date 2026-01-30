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
  const referer = stripLocale(header.get('referer'))

  if (!referer) return undefined

  const refererUrl = URL.parse(referer, env.NEXT_PUBLIC_BASE_URL)!
  if (!refererUrl.href.startsWith(env.NEXT_PUBLIC_BASE_URL)) {
    logger.warn('Discarded external referer', referer)
    return undefined
  }

  const refererPath = referer.replace(env.NEXT_PUBLIC_BASE_URL, '')

  if (currentPath === refererPath) {
    logger.verbose('Referer matches current location, discarding referer.')
    return undefined
  }

  return refererPath
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
