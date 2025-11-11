import { betterAuth } from 'better-auth'
import { nextCookies } from 'better-auth/next-js'
import { anonymous } from 'better-auth/plugins'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import getDatabase from '@/database/Database'
import { db_knowledgeCheck, db_userHasDoneKnowledgeCheck } from '@/database/drizzle/schema'
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
        console.info(`[Better-Auth]: Anonymous user '${anonymousUser.user.email}' was linked to: '${newUser.user.email}'!`)
        const db = await getDatabase()

        const [{ affectedRows: updatedChecks }] = await db.update(db_knowledgeCheck).set({ owner_id: newUser.user.id }).where(eq(db_knowledgeCheck.owner_id, anonymousUser.user.id))
        const [{ affectedRows: updatedResults }] = await db.update(db_userHasDoneKnowledgeCheck).set({ userId: newUser.user.id }).where(eq(db_userHasDoneKnowledgeCheck.userId, anonymousUser.user.id))
        console.info(`[Better-Auth]: Transferred ${updatedChecks} associated checks and ${updatedResults} examination-results from an Anonymous account to ${newUser.user.email}`)
      },
    }),
  ],
})
export type BetterAuthUser = NonNullable<Awaited<ReturnType<typeof auth.api.getSession<boolean>>>>['user']

export async function getServerSession(): Promise<NonNullable<Awaited<ReturnType<typeof auth.api.getSession<boolean>>>> | { user?: undefined; session?: undefined }> {
  const session = await auth.api.getSession({ headers: await headers() })

  return session ?? { user: undefined, session: undefined }
}
