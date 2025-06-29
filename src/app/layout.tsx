import SideBar from '@/components/root/Navigation/SideBar'
import { sideBarConfiguration } from '@/components/root/Navigation/SideBarConfiguration'
import { RootStoreProvider } from '@/components/root/RootStoreProvider'
import '@/lib/Shared/Env'
import getTheme from '@/lib/Shared/getTheme'
import ToastBox from '@/src/components/Shared/Toast/ToastBox'
import NavigationAbortProvider from '@/src/components/navigation-abortion/NavigationAbortProvider'
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
      <body className={`antialiased scheme-light-dark`}>
        <RootStoreProvider initialStoreProps={{ theme_cookie: theme }}>
          <NavigationAbortProvider>
            <SideBar {...sideBarConfiguration}>
              {children}
              <ToastBox />
            </SideBar>
          </NavigationAbortProvider>
        </RootStoreProvider>
      </body>
    </html>
  )
}
