import type { Metadata } from 'next'
import './globals.css'
import SideBar from '@/components/root/Navigation/SideBar'
import { sideBarConfiguration } from '@/components/root/Navigation/SideBarConfiguration'
import getTheme from '@/lib/Shared/getTheme'
import { RootStoreProvider } from '@/components/root/RootStoreProvider'
import '@/lib/Shared/Env'
import AuthProvider from '@/components/root/AuthProvider'

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
      <body className={`antialiased dark:[color-scheme:dark]`}>
        <RootStoreProvider initialStoreProps={{ theme_cookie: theme }}>
          <AuthProvider>
            <SideBar {...sideBarConfiguration}>{children}</SideBar>
          </AuthProvider>
        </RootStoreProvider>
      </body>
    </html>
  )
}
