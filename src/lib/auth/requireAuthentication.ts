'use server'

import { getServerSession } from '@/src/lib/auth/server'
import { unauthorized } from 'next/navigation'

export default async function requireAuthentication() {
  const { user, session } = await getServerSession()

  if (!user || !session) {
    unauthorized()
  }

  return { user, session }
}
