import createPool from '@/database/Pool'
import env from '@/lib/Shared/Env'
import { betterAuth, Session, User } from 'better-auth'
import { nextCookies } from 'better-auth/next-js'
import { headers } from 'next/headers'

export const auth = betterAuth({
  user: {
    modelName: 'User',
  },
  account: {
    modelName: 'Account',
    fields: {
      userId: 'user_id',
    },
  },
  session: {
    modelName: 'Session',
    fields: {
      userId: 'user_id',
    },
  },
  verification: {
    modelName: 'Verification',
  },
  database: createPool(),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    autoSignIn: true,
  },
  socialProviders: {
    github: {
      clientId: env.AUTH_GITHUB_ID,
      clientSecret: env.AUTH_GITHUB_SECRET,
    },
    google: {
      clientId: env.AUTH_GOOGLE_ID,
      clientSecret: env.AUTH_GOOGLE_SECRET,
    },
  },
  plugins: [nextCookies()],
})

export async function getServerSession(): Promise<{ session?: Session; user?: User }> {
  const session = await auth.api.getSession({ headers: await headers() })

  return session || {}
}
