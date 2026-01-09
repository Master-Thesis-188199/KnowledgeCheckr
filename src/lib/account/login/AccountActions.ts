'use server'

import { redirect } from 'next/navigation'
import { auth } from '@/src/lib/auth/server'
import _logger from '@/src/lib/log/Logger'
import { LoginProps, LoginSchema, SignupSchema } from '@/src/schemas/AuthenticationSchema'
// eslint-disable-next-line unused-imports/no-unused-imports, @typescript-eslint/no-unused-vars
import { Any } from '@/types'

const logger = _logger.createModuleLogger('/' + import.meta.url.split('/').reverse().slice(0, 2).reverse().join('/')!)

export type AuthState = {
  success: boolean
  fieldErrors?: {
    email?: string[]
    password?: string[]
    name?: string[]
  }
  rootError?: string
  values?: {
    email?: string
    password?: string
    name?: string
    callbackUrl: string | undefined
  }
}

export type LoginAuthState = {
  success: boolean
  fieldErrors?: { [key in keyof LoginProps]?: string[] }
  rootError?: string
  values?: Partial<LoginProps>
}

export async function loginAction(_: LoginAuthState, values: LoginProps): Promise<LoginAuthState> {
  'use server'

  const parsed = LoginSchema.safeParse(values)

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten()
    return { success: false, fieldErrors, values }
  }

  const { callbackURL, ...data } = parsed.data

  try {
    await auth.api.signInEmail({ body: data })
  } catch (e: Any) {
    if (e?.statusCode === 401) {
      return { success: false, rootError: 'Wrong e-mail address or password.', values }
    }

    logger.error(e)
    return { success: false, rootError: 'Something went wrong - please try again.', values }
  }

  // uses form-callback value or the default-value from the `LoginSchema`
  redirect(callbackURL)
}

export async function signup(_: AuthState, formData: FormData): Promise<AuthState> {
  'use server'

  const values = {
    name: formData.get('name')?.toString(),
    email: formData.get('email')?.toString(),
    password: formData.get('password')?.toString(),
    callbackUrl: formData.get('callbackUrl')!.toString(),
  }

  const parsed = SignupSchema.safeParse(values)

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten()
    return { success: false, fieldErrors, values }
  }

  try {
    await auth.api.signUpEmail({ body: parsed.data })
  } catch (e: Any) {
    if (e?.statusCode === 409) {
      return {
        success: false,
        rootError: 'That e-mail address is already registered.',
        values,
      }
    }

    if (e?.body?.message) {
      return {
        success: false,
        rootError: `${e.body.message}${!e.body.message.endsWith('!') ? '!' : ''}`, //+ e.body.message.endsWith('!') ? '' : '!',
        values,
      }
    }

    logger.error(e)
    return {
      success: false,
      rootError: 'Could not create your account - please try again later.',
      values,
    }
  }

  redirect(values.callbackUrl ?? '/')
}
