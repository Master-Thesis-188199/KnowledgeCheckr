import { headers } from 'next/headers'

export async function getRefererURL(): Promise<string | null> {
  const headersList = await headers()
  return headersList.get('referer')
}
