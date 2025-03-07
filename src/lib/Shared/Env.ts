import 'server-only'
import { z } from 'zod'

export const envSchema = z.object({
  NEXTAUTH_URL: z.string().startsWith('http').includes('://'),
  NEXTAUTH_SECRET: z.string().base64(),

  NEXTAUTH_MONGODB_HOST_NAME: z.string().min(1, 'NEXTAUTH_MONGODB_HOST_NAME cannot be empty!'),

  NEXTAUTH_MONGODB_PORT: z
    .string()
    .min(1, 'NEXTAUTH_MONGODB_HOST_PORT cannot be empty!')
    .transform((val) => parseInt(val)),
  NEXTAUTH_MONGODB_DATABASE_NAME: z.string().min(1, 'NEXTAUTH_MONGODB_DATABASE_NAME cannot be empty!'),
  NEXTAUTH_MONGODB_EXTRA_URI_ARGS: z
    .string()
    .regex(/^(?:[^&=]+=[^&=]+)(?:&[^&=]+=[^&=]+)*$/g, "Invalid URI Argument Format. Must be in the form 'key=value' joined by '&'.")
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
