import NavigationAbortProvider from '@/src/components/navigation-abortion/NavigationAbortProvider'
import { I18nProvider } from '@/src/components/root/I18nProvider'
import { RootStoreProvider } from '@/src/components/root/RootStoreProvider'
import { SessionStorageProvider } from '@/src/hooks/root/SessionStorage'
import getTheme from '@/src/lib/Shared/getTheme'

/**
 * Wraps its children in the necessary (root) providers for the application.
 * @param defaultTheme - The default theme to store as a cookie, if available.
 * @param children - The children to render within the providers.
 * @returns
 */
export default function RootProviders({ children, defaultTheme }: { children: React.ReactNode; defaultTheme?: Awaited<ReturnType<typeof getTheme>> }) {
  return (
    <SessionStorageProvider>
      <RootStoreProvider initialStoreProps={{ theme_cookie: defaultTheme }}>
        <I18nProvider>
          <NavigationAbortProvider>{children}</NavigationAbortProvider>
        </I18nProvider>
      </RootStoreProvider>
    </SessionStorageProvider>
  )
}
