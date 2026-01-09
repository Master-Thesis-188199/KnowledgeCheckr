import { z } from 'zod'
import { schemaUtilities } from '@/src/schemas/utils/schemaUtilities'

const baseSchema = z.object({
  email: z.string().email('Please enter a valid email address.'),
  password: z.string().min(8, { message: 'The password must be at least 8 characters long.' }),
})

export type LoginProps = z.infer<typeof baseSchema>
export const LoginSchema = baseSchema
const { validate: validateKnowledgeCheck, instantiate: instantiateKnowledgeCheck, safeParse: safeParseKnowledgeCheck } = schemaUtilities<LoginProps>(LoginSchema)
export { instantiateKnowledgeCheck, safeParseKnowledgeCheck, validateKnowledgeCheck }

export const SignupSchema = baseSchema.extend({
  name: z.string().trim().min(1, { message: 'The name must be at least 1 characters long.' }),
})
export type SignupSchema = z.infer<typeof SignupSchema>
const { validate: validateSignup, instantiate: instantiateSignup, safeParse: safeParseSignup } = schemaUtilities<SignupSchema>(SignupSchema)
export { instantiateSignup, safeParseSignup, validateSignup }
