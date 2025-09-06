import { headers } from 'next/headers'

export async function getReferer(): Promise<string | null> {
  const headersList = await headers()
  return headersList.get('referer')
}
