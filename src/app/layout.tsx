import SideBar from '@/components/root/Navigation/SideBar'
import { sideBarConfiguration } from '@/components/root/Navigation/SideBarConfiguration'
import { RootStoreProvider } from '@/components/root/RootStoreProvider'
import '@/lib/Shared/Env'
import getTheme from '@/lib/Shared/getTheme'
import ToastBox from '@/src/components/Shared/Toast/ToastBox'
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
      <body className={`antialiased dark:[color-scheme:dark]`}>
        <RootStoreProvider initialStoreProps={{ theme_cookie: theme }}>
          <SideBar {...sideBarConfiguration}>
            {children}
            <ToastBox />
          </SideBar>
        </RootStoreProvider>
      </body>
    </html>
  )
}
