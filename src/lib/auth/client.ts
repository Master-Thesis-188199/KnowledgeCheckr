import env from '@/src/lib/Shared/Env'
import { createAuthClient } from 'better-auth/react'

export const auth_client = createAuthClient({
  /** the base url of the server (optional if you're using the same domain) */
  baseURL: env.BASE_URL,
})

export const { signIn, signUp, signOut, useSession } = auth_client
