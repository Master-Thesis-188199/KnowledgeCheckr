'use client'

import { I18nProviderClient, useCurrentLocale } from '@/src/i18n/client-localization'

export function I18nProvider({ children }: { children: React.ReactNode }) {
  if (process.env.NEXT_PUBLIC_MODE === 'test') {
    //todo resolve locale retrieval during tests
    return <I18nProviderClient locale={'en'}>{children}</I18nProviderClient>
  }

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const currentLocale = useCurrentLocale()

  return <I18nProviderClient locale={currentLocale}>{children}</I18nProviderClient>
}
