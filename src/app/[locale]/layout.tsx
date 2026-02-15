import React from 'react'
import { I18nProvider } from '@/src/components/root/I18nProvider'

export default async function LocaleRootLayout({ children, params }: { children: React.ReactNode; params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return <I18nProvider locale={locale}>{children}</I18nProvider>
}
