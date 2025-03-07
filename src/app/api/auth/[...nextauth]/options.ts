import type { NextAuthOptions } from 'next-auth'
import { MongoDBAdapter } from '@auth/mongodb-adapter'
import GitHubProvider from 'next-auth/providers/github'
import GoogleProvider from 'next-auth/providers/google'
import mongoDbClient from '@/app/api/auth/[...nextauth]/MongoDB-Auth-Client'
import env from '@/lib/Shared/Env'

export const options: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: env.NEXTAUTH_GITHUB_ID,
      clientSecret: env.NEXTAUTH_GITHUB_SECRET,
      name: 'Github-Provider',
    }),
    GoogleProvider({
      clientId: env.NEXTAUTH_GOOGLE_ID,
      clientSecret: env.NEXTAUTH_GOOGLE_SECRET,
    }),
  ],
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
