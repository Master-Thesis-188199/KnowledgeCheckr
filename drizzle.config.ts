import 'dotenv/config'
import { defineConfig } from 'drizzle-kit'
import env from '@/src/lib/Shared/Env'

export default defineConfig({
  out: './drizzle',
  schema: './database/schema/schema.ts',
  dialect: 'mysql',
  dbCredentials: {
    host: env.DATABASE_HOST,
    port: env.DATABASE_PORT,
    user: env.DATABASE_USER,
    password: env.DATABASE_PASSWORD,
    database: env.DATABASE_NAME,
  },
})
