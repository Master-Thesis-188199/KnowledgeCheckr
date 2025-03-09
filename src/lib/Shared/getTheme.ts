import { cookies } from 'next/headers'

export default async function getTheme(): Promise<'light' | 'dark' | undefined> {
  const cookieStore = await cookies()
  const theme = cookieStore.get('theme' as never)?.value

  if (!theme) return undefined

  return theme === 'light' ? 'light' : 'dark'
}
