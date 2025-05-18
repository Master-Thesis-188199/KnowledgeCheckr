'use client'

import { AuthState, signup } from '@/src/app/account/login/actions'
import Input from '@/src/components/Shared/form/Input'
import { TriangleAlert } from 'lucide-react'
import Link from 'next/link'
import { useActionState, useEffect, useRef } from 'react'
import { twMerge } from 'tailwind-merge'

const initialState: AuthState = { success: false }
export default function SignupForm() {
  const [state, formAction] = useActionState(signup, initialState)
  const isFirst = useRef(true)

  useEffect(() => {
    if (isFirst.current) {
      isFirst.current = false
      return
    }

    if (state.rootError) {
      console.error(state.rootError)
    }

    if (state.success) {
      console.info('Account created - welcome aboard!')
    }
  }, [state])

  return (
    <form action={formAction} className='flex flex-col gap-6'>
      <label className='flex flex-col gap-2'>
        Username
        <Input name='name' type='text' placeholder='Alexander' />
        {state.fieldErrors?.name && (
          <div aria-label={`field-error-name`} className={'text-[15px] text-red-400 dark:text-red-400/80'}>
            {state.fieldErrors?.name?.at(0)}
          </div>
        )}
      </label>

      <label className='flex flex-col gap-1'>
        Email
        <Input name='email' type='email' placeholder='you@example.com' />
        {state.fieldErrors?.email && (
          <div aria-label={`field-error-email`} className={'text-[15px] text-red-400 dark:text-red-400/80'}>
            {state.fieldErrors?.email?.at(0)}
          </div>
        )}
      </label>

      <label className='flex flex-col gap-1'>
        Password
        <Input name='password' type='password' placeholder='••••••••' />
        {state.fieldErrors?.password && (
          <div aria-label={`field-error-password`} className={'text-[15px] text-red-400 dark:text-red-400/80'}>
            {state.fieldErrors?.password?.at(0)}
          </div>
        )}
      </label>

      <div className={twMerge('-mt-2 -mb-4', state?.rootError?.length || 0 > 0 ? '' : 'hidden')}>
        <div aria-label={`field-error-password`} className={'flex items-center justify-center gap-1.5 text-[15px] text-red-400 dark:text-red-400/80'}>
          <TriangleAlert className='inline-block size-4 text-red-400 dark:text-red-400/80' />
          {state.rootError}
        </div>
      </div>

      <div className='mt-2 flex flex-col items-center justify-center gap-3'>
        <button
          type='submit'
          className='mt-2 w-full max-w-xs self-center rounded-lg bg-neutral-300 px-4 py-2 ring-1 ring-neutral-400 outline-0 hover:cursor-pointer hover:bg-neutral-400/40 hover:ring-[1.8px] hover:ring-neutral-400/70 active:bg-neutral-700/90 active:ring-neutral-600 dark:bg-neutral-700/40 dark:ring-neutral-700 dark:hover:bg-neutral-700/70 dark:hover:ring-neutral-600/80'>
          Create account
        </button>
        <p className='text-sm text-neutral-400 dark:text-neutral-400/70'>
          Already have an Account?
          <Link href='/account/login?type=signin' className='px-2 text-neutral-600 hover:cursor-pointer hover:underline dark:text-neutral-200'>
            Signin
          </Link>
        </p>
      </div>
    </form>
  )
}
