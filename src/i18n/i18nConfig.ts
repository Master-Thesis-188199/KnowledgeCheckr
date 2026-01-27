import { createI18nMiddleware } from 'next-international/middleware'

export const locales = ['en', 'de'] as const

export type i18nLocale = (typeof locales)[number]

const i18nConfig: Parameters<typeof createI18nMiddleware<typeof locales>>['0'] = {
  locales,
  defaultLocale: 'en',
  urlMappingStrategy: 'rewriteDefault', // hides default locale from path
}

export default i18nConfig
