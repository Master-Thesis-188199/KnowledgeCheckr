import env from '@/lib/Shared/Env'
import { betterAuth, Session, User } from 'better-auth'
import { nextCookies } from 'better-auth/next-js'
import { createPool } from 'mysql2/promise'
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
  database: createPool({
    host: env.DATABASE_HOST,
    port: env.DATABASE_PORT,
    database: env.DATABASE_NAME,
    user: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
  }),
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
