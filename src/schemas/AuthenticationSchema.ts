import { z } from 'zod'
import { schemaUtilities } from '@/src/schemas/utils/schemaUtilities'

const baseSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(8, { message: 'The password must be at least 8 characters long.' }),
  callbackURL: z.string().optional().default('/'),
})

export type LoginProps = z.infer<typeof baseSchema>
export const LoginSchema = baseSchema
const { validate: validateLoginProps, instantiate: instantiateLoginProps, safeParse: safeParseLoginProps } = schemaUtilities(LoginSchema)
export { instantiateLoginProps, safeParseLoginProps, validateLoginProps }

export const SignupSchema = baseSchema.extend({
  name: z.string().trim().min(1, { message: 'The name must be at least 1 characters long.' }),
})
export type SignupProps = z.infer<typeof SignupSchema>
const { validate: validateSignupProps, instantiate: instantiateSignupProps, safeParse: safeParseSignupProps } = schemaUtilities(SignupSchema)
export { instantiateSignupProps, safeParseSignupProps, validateSignupProps }
