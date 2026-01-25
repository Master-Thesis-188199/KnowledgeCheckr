'use client'

import { I18nProviderClient, useCurrentLocale } from '@/src/i18n/client-localization'

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const currentLocale = useCurrentLocale()

  return <I18nProviderClient locale={currentLocale}>{children}</I18nProviderClient>
}
