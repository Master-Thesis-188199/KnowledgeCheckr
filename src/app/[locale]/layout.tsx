import React from 'react'
import { I18nProvider } from '@/src/components/root/I18nProvider'

export default async function LocaleRootLayout({ children }: { children: React.ReactNode }) {
  return <I18nProvider>{children}</I18nProvider>
}
