'use server'

import { unauthorized } from 'next/navigation'
import { getServerSession } from '@/src/lib/auth/server'

export default async function requireAuthentication() {
  const { user, session } = await getServerSession()

  if (!user || !session) {
    unauthorized()
  }

  return { user, session }
}
