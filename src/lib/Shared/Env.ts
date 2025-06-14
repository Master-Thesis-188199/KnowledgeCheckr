import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

export const envSchema = z.object({
  BETTER_AUTH_URL: z.string().url(),
  NEXT_PUBLIC_BASE_URL: z.string().startsWith('http').includes('://'),
  AUTH_SECRET: z.string().base64(),

  DATABASE_HOST: z.union([
    z.string().regex(/^\S*$/, { message: 'When using the service-name as the database host, make sure that it does not contain any spaces! (Alternatively provide a valid URL / IP)' }),
    z.string().ip({ message: 'Please provide a valid database host url / ip / service-name' }),
    z.string().url({ message: 'Please provide a valid database host url / ip / service-name' }),
    // .min(1, 'The database host must not be empty!')
  ]),
  DATABASE_PORT: z
    .string()
    .min(1, 'AUTH_MONGODB_HOST_PORT cannot be empty!')
    .transform((val) => parseInt(val)),
  DATABASE_NAME: z.string().min(1, 'AUTH_MONGODB_HOST_NAME cannot be empty!'),
  DATABASE_USER: z.string().min(1, 'The database user must not be empty!'),
  DATABASE_PASSWORD: z.string().optional(),

  AUTH_GITHUB_ID: z.string().min(1, 'NEXTAUTH_GITHUB_ID cannot be empty!'),
  AUTH_GITHUB_SECRET: z.string().min(1, 'NEXTAUTH_GITHUB_SECRET cannot be empty!'),

  AUTH_GOOGLE_ID: z.string().min(1, 'NEXTAUTH_GOOGLE_ID cannot be empty!'),
  AUTH_GOOGLE_SECRET: z.string().min(1, 'NEXTAUTH_GOOGLE_SECRET cannot be empty!'),

  SHOW_APP_VERSION: z
    .string()
    .transform((val) => val.toLowerCase().trim() === 'true')
    .optional(),
})

const res = envSchema.safeParse(process.env)
if (res.error) {
  const e = new Error(`Missing Environment Variables: \n ${JSON.stringify(res.error.flatten().fieldErrors, null, 2)}`)
  e.stack = ''
  throw e
}

const env = envSchema.parse(process.env) as z.infer<typeof envSchema>
export default env
