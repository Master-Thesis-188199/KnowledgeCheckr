import dotenv from 'dotenv'
import { z } from 'zod'

dotenv.config()

export const envSchema = z
  .object({
    BETTER_AUTH_URL: z.string().url().describe('Defines the trusted domains at which users can authenticate themselves'),
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

    AUTH_GITHUB_ENABLED: z.boolean().optional().default(false),
    AUTH_GITHUB_ID: z.string().min(1, 'AUTH_GITHUB_ID cannot be empty!').optional(),
    AUTH_GITHUB_SECRET: z.string().min(1, 'AUTH_GITHUB_SECRET cannot be empty!').optional(),

    AUTH_GOOGLE_ENABLED: z.boolean().optional().default(false),
    AUTH_GOOGLE_ID: z.string().min(1, 'AUTH_GOOGLE_ID cannot be empty!').optional(),
    AUTH_GOOGLE_SECRET: z.string().min(1, 'AUTH_GOOGLE_SECRET cannot be empty!').optional(),

    SHOW_APP_VERSION: z
      .string()
      .transform((val) => val.toLowerCase().trim() === 'true')
      .optional(),
    NEXT_PUBLIC_MODE: z.preprocess((v) => v ?? process.env.NODE_ENV ?? 'production', z.enum(['test', 'production', 'development'])),
    //* Custom Provider
    DEX_PROVIDER_URL: z
      .union([
        z.string().regex(/^\S*$/, { message: 'When using the service-name as the host, make sure that it does not contain any spaces! (Alternatively provide a valid URL / IP)' }),
        z.string().ip({ message: 'Please provide a valid host url / ip / service-name' }),
        z.string().url({ message: 'Please provide a valid host url / ip / service-name' }),
      ])
      .optional(),
    DEX_CLIENT_ID: z.string().optional().default('nextjs-client').catch('nextjs-client'),
    DEX_CLIENT_SECRET: z.string().optional().default('dev-secret').catch('dev-secret'),
    CAPTURE_CLIENT_LOGS: z
      .string()
      .optional()
      .transform((val) => val?.toString().toLowerCase().trim() === 'true'),
    ENABLE_FILE_LOGGING: z
      .string()
      .transform((val) => val.toLowerCase().trim() === 'true')
      .optional()
      .default('true'),
  })
  .superRefine((env, ctx) => {
    if (env.NEXT_PUBLIC_MODE === 'test') {
      // DEX_PROVIDER_URL required in test
      if (!env.DEX_PROVIDER_URL) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['DEX_PROVIDER_URL'],
          message: 'DEX_PROVIDER_URL is required when MODE is "test".',
        })
      }

      // DEX_CLIENT_ID required in test
      if (!env.DEX_CLIENT_ID) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['DEX_CLIENT_ID'],
          message: 'DEX_CLIENT_ID is required when MODE is "test".',
        })
      }

      // DEX_CLIENT_SECRET required in test
      if (!env.DEX_CLIENT_SECRET) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['DEX_CLIENT_SECRET'],
          message: 'DEX_CLIENT_SECRET is required when MODE is "test".',
        })
      }
    }

    // Provider checks + logging
    const providers = [
      { name: 'GitHub', idKey: 'AUTH_GITHUB_ID' as const, secretKey: 'AUTH_GITHUB_SECRET' as const },
      { name: 'Google', idKey: 'AUTH_GOOGLE_ID' as const, secretKey: 'AUTH_GOOGLE_SECRET' as const },
    ]

    for (const p of providers) {
      const id = env[p.idKey]
      const secret = env[p.secretKey]

      const hasId = id !== undefined && id.length > 0
      const hasSecret = secret !== undefined && secret.length > 0

      // both missing: disabled
      if (!hasId && !hasSecret) {
        // console.info(`[.env] ${p.name} sign-in disabled (provide ${p.idKey} and ${p.secretKey} to enable it).`)
        continue
      }

      // partial auth-secrets --> throw error
      if (!hasId || !hasSecret) {
        if (!hasId) console.info(`[.env] ${p.name} sign-in disabled (missing ${p.idKey}).`)
        if (!hasSecret) console.info(`[.env] ${p.name} sign-in disabled (missing ${p.secretKey}).`)

        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: [!hasId ? p.idKey : p.secretKey],
          message: `${p.name} auth requires BOTH ${p.idKey} and ${p.secretKey} (either set both or leave both empty).`,
        })
        continue
      }
    }
  })
  .transform((schema): typeof schema => {
    const AUTH_GITHUB_ENABLED: boolean = schema.AUTH_GITHUB_ID !== undefined && schema.AUTH_GITHUB_SECRET !== undefined && schema.AUTH_GITHUB_ID.length > 0 && schema.AUTH_GITHUB_SECRET.length > 0
    const AUTH_GOOGLE_ENABLED: boolean = schema.AUTH_GOOGLE_ID !== undefined && schema.AUTH_GOOGLE_SECRET !== undefined && schema.AUTH_GOOGLE_ID.length > 0 && schema.AUTH_GOOGLE_SECRET.length > 0

    if (!AUTH_GITHUB_ENABLED) console.info('[.env] Overriding `AUTH_GITHUB_ENABLED`; GitHub sign-in disabled. (provide `AUTH_GITHUB_ID` and `AUTH_GITHUB_SECRET` variables to enable it)')
    if (!AUTH_GOOGLE_ENABLED) console.info('[.env] Overriding `AUTH_GOOGLE_ENABLED`; Google sign-in disabled. (provide `AUTH_GOOGLE_ID` and `AUTH_GOOGLE_SECRET` variables to enable it)')

    return {
      ...schema,
      AUTH_GITHUB_ENABLED,
      AUTH_GOOGLE_ENABLED,
    }
  })

const res = envSchema.safeParse(process.env)
if (res.error) {
  const e = new Error(`Missing Environment Variables: \n ${JSON.stringify(res.error.flatten().fieldErrors, null, 2)}`)
  e.stack = ''
  throw e
}

const env = res.data
export default env
