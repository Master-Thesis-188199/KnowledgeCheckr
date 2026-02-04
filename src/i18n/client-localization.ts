import { createI18nClient } from 'next-international/client'

export const { useI18n, useScopedI18n, I18nProviderClient, useChangeLocale, defineLocale, useCurrentLocale, I18nClientContext } = createI18nClient({
  de: async () => {
    await new Promise((resolve) => setTimeout(resolve, 100))
    return import('./locales/de')
  },
  en: async () => {
    await new Promise((resolve) => setTimeout(resolve, 100))
    return import('./locales/en')
  },
})
