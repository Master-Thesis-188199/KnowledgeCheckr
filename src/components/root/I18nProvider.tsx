'use client'

import { I18nProviderClient } from '@/src/i18n/client-localization'

export function I18nProvider({ children, locale }: { children: React.ReactNode; locale: string }) {
  return <I18nProviderClient locale={locale}>{children}</I18nProviderClient>
}
