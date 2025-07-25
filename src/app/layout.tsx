import SideBar from '@/components/root/Navigation/SideBar'
import { sideBarConfiguration } from '@/components/root/Navigation/SideBarConfiguration'
import '@/lib/Shared/Env'
import getTheme from '@/lib/Shared/getTheme'
import ToastBox from '@/src/components/Shared/Toast/ToastBox'
import RootProviders from '@/src/components/root/RootProviders'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'KnowledgeCheckr',
    template: '%s | KnowledgeCheckr',
  },
  description: 'Increase your knowledge with KnowledgeCheckr',
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
        <RootProviders defaultTheme={theme}>
          <SideBar {...sideBarConfiguration}>
            {children}
            <ToastBox />
          </SideBar>
        </RootProviders>
      </body>
    </html>
  )
}
