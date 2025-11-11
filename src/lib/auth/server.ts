import { betterAuth, Session, User } from 'better-auth'
import { nextCookies } from 'better-auth/next-js'
import { anonymous } from 'better-auth/plugins'
import { headers } from 'next/headers'
import createPool from '@/database/Pool'
import env from '@/lib/Shared/Env'

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
  plugins: [
    nextCookies(),
    anonymous({
      onLinkAccount: async ({ anonymousUser, newUser }) => {
        console.info(`[Better-Auth]: Anonymous user '${anonymousUser.user.email}' signed in with: '${newUser.user.email}'!`)
        console.warn('[Better-Auth]: Transform anonymous user data to newUser.')
      },
    }),
  ],
})

export async function getServerSession(): Promise<{ session?: Session; user?: User }> {
  const session = await auth.api.getSession({ headers: await headers() })

  return session || {}
}
