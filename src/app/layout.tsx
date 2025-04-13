import SideBar from '@/components/root/Navigation/SideBar'
import { sideBarConfiguration } from '@/components/root/Navigation/SideBarConfiguration'
import { RootStoreProvider } from '@/components/root/RootStoreProvider'
import '@/lib/Shared/Env'
import getTheme from '@/lib/Shared/getTheme'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'KnowledgeCheckr',
    template: '%s | KnowledgeCheckr',
  },
  description: '',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const theme = await getTheme()

  return (
    <html lang='en' data-theme={theme}>
      <body className={`antialiased`}>
        <RootStoreProvider initialStoreProps={{ theme_cookie: theme }}>
          <SideBar {...sideBarConfiguration}>{children}</SideBar>
        </RootStoreProvider>
      </body>
    </html>
  )
}
