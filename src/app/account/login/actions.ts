'use server'

import { auth } from '@/src/lib/auth/server'
import { Any } from '@/types'
import { redirect } from 'next/navigation'
import { z } from 'zod'

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, { message: 'The password must be at least 8 characters long.' }),
})

export type AuthState = {
  success: boolean
  fieldErrors?: {
    email?: string[]
    password?: string[]
    name?: string[]
  }
  rootError?: string
}

export async function signin(_: AuthState, formData: FormData): Promise<AuthState> {
  'use server'

  const parsed = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten()
    return { success: false, fieldErrors }
  }

  try {
    await auth.api.signInEmail({ body: parsed.data })
  } catch (e: Any) {
    if (e?.statusCode === 401) {
      return { success: false, rootError: 'Wrong e-mail address or password.' }
    }

    console.error(e)
    return { success: false, rootError: 'Something went wrong - please try again.' }
  }

  redirect('/')
}

const SignupSchema = z.object({
  name: z.string().trim().min(1, { message: 'The name must be at least 1 characters long.' }),
  email: z.string().email(),
  password: z.string().min(8, { message: 'The password must be at least 8 characters long.' }),
})

export async function signup(_: AuthState, formData: FormData): Promise<AuthState> {
  'use server'

  const parsed = SignupSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!parsed.success) {
    const { fieldErrors } = parsed.error.flatten()
    return { success: false, fieldErrors }
  }

  try {
    await auth.api.signUpEmail({ body: parsed.data })
  } catch (e: Any) {
    if (e?.statusCode === 409) {
      return {
        success: false,
        rootError: 'That e-mail address is already registered.',
      }
    }

    if (e?.body.message) {
      return {
        success: false,
        rootError: `${e.body.message}${!e.body.message.endsWith('!') ? '!' : ''}`, //+ e.body.message.endsWith('!') ? '' : '!',
      }
    }

    console.error(e)
    return {
      success: false,
      rootError: 'Could not create your account - please try again later.',
    }
  }

  redirect('/')
}
