import { betterAuth } from 'better-auth'
import { nextCookies } from 'better-auth/next-js'
import { anonymous, genericOAuth } from 'better-auth/plugins'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import getDatabase from '@/database/Database'
import { db_knowledgeCheck, db_userHasDoneKnowledgeCheck } from '@/database/drizzle/schema'
import createPool from '@/database/Pool'
import env from '@/lib/Shared/Env'
import _logger from '@/src/lib/log/Logger'

const logger = _logger.createModuleLogger('/' + import.meta.url.split('/').reverse().slice(0, 2).reverse().join('/')!)

export const auth = betterAuth({
  rateLimit: {
    enabled: env.NEXT_PUBLIC_MODE === 'test' ? false : true,
  },
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
        logger.info(`[Better-Auth]: Anonymous user '${anonymousUser.user.email}' was linked to: '${newUser.user.email}'!`)
        const db = await getDatabase()

        try {
          const [{ affectedRows: updatedChecks }] = await db.update(db_knowledgeCheck).set({ owner_id: newUser.user.id }).where(eq(db_knowledgeCheck.owner_id, anonymousUser.user.id))
          const [{ affectedRows: updatedResults }] = await db
            .update(db_userHasDoneKnowledgeCheck)
            .set({ userId: newUser.user.id })
            .where(eq(db_userHasDoneKnowledgeCheck.userId, anonymousUser.user.id))
          logger.info(`[Better-Auth]: Transferred ${updatedChecks} associated checks and ${updatedResults} examination-results from an Anonymous account to ${newUser.user.email}`)
        } catch (e) {
          logger.error(`[Better-Auth]: Failed to transfer data from anonymous user ${anonymousUser.user.email} to ${newUser.user.email}`, e)
        }
      },
    }),
    genericOAuth({
      config: [
        {
          providerId: 'dex',
          clientId: env.DEX_CLIENT_ID,
          clientSecret: env.DEX_CLIENT_SECRET,
          authentication: 'basic',
          authorizationUrl: `${env.DEX_PROVIDER_URL}/auth`,
          tokenUrl: `${env.DEX_PROVIDER_URL}/token`,
          userInfoUrl: `${env.DEX_PROVIDER_URL}/userinfo`,
          scopes: ['openid', 'email', 'profile'],
          mapProfileToUser(profile) {
            return {
              id: profile.sub,
              name: profile.name || profile.email?.split('@')[0],
              email: profile.email,
              image: profile.picture ?? null,
            }
          },
        },
      ],
    }),
  ],
})
export type BetterAuthUser = NonNullable<Awaited<ReturnType<typeof auth.api.getSession<boolean>>>>['user']

export async function getServerSession(): Promise<NonNullable<Awaited<ReturnType<typeof auth.api.getSession<boolean>>>> | { user?: undefined; session?: undefined }> {
  const session = await auth.api.getSession({ headers: await headers() })

  return session ?? { user: undefined, session: undefined }
}
