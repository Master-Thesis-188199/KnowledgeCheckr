import { z } from 'zod'
import { Translator } from '@/src/i18n/locales/types'
import { localizedSchemaUtilities } from '@/src/schemas/utils/localizedSchemaUtilities'

const getBaseSchema = (t: Translator) =>
  z.object({
    email: z.string().email(t('schemas.Authentication.email.email_constraint_message')),
    password: z.string().min(8, { message: t('schemas.Authentication.password.min_constraint_message', { count: 8 }) }),
    callbackURL: z.string().optional().default('/'),
  })

export const getLoginSchema = getBaseSchema
export type LoginProps = z.output<ReturnType<typeof getLoginSchema>>

const { validate: validateLoginProps, instantiate: instantiateLoginProps, safeParse: safeParseLoginProps } = localizedSchemaUtilities(getLoginSchema)
export { instantiateLoginProps, safeParseLoginProps, validateLoginProps }

export const getSignupSchema = (t: Translator) =>
  getBaseSchema(t).extend({
    name: z
      .string()
      .trim()
      .min(1, { message: t('schemas.Authentication.name.min_constraint_message', { count: 1 }) }),
  })

export type SignupProps = z.output<ReturnType<typeof getSignupSchema>>
const { validate: validateSignupProps, instantiate: instantiateSignupProps, safeParse: safeParseSignupProps } = localizedSchemaUtilities(getSignupSchema)
export { instantiateSignupProps, safeParseSignupProps, validateSignupProps }
