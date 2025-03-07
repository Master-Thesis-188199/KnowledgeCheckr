import type { NextAuthOptions } from 'next-auth'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import mongoDbClient from '@/app/api/auth/[...nextauth]/MongoDB-Auth-Client'
import env from '@/lib/Shared/Env'

export const options: NextAuthOptions = {
  providers: [],
  adapter: MongoDBAdapter(mongoDbClient, {
    databaseName: env.NEXTAUTH_MONGODB_DATABASE_NAME,
    collections: {
      Users: 'users',
      Accounts: 'accounts',
      Sessions: 'sessions',
      VerificationTokens: 'verification_tokens',
    },
  }),
}
