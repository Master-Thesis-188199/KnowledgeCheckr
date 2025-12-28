/* app/account/login/LoginForm.tsx */
'use client'

import { useActionState, useEffect, useRef } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { z } from 'zod'
import FormFieldError from '@/src/components/Shared/form/FormFieldError'
import Input from '@/src/components/Shared/form/Input'
import { cn } from '@/src/lib/Shared/utils'
import { LoginSchema } from '@/src/schemas/AuthenticationSchema'
import { signin } from '../../../lib/account/login/AccountActions'

type FormValues = z.infer<typeof LoginSchema>

export default function LoginForm({ callbackUrl }: { callbackUrl?: string }) {
  const [state, formAction] = useActionState(signin, { success: false, values: { callbackUrl: undefined } })

  const {
    register,
    trigger,
    setError,
    formState: { errors, isValid },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(LoginSchema),
    mode: 'onChange',
    delayError: 150,
    defaultValues: {
      email: state.values?.email,
      password: state.values?.password,
    },
  })

  useEffect(() => {
    if (state.fieldErrors) {
      Object.entries(state.fieldErrors).forEach(([key, msgs]) => {
        if (msgs?.length) {
          setError(key as keyof FormValues, { type: 'server', message: msgs[0] })
        }
      })
    }

    if (state.rootError) {
      setError('root', { type: 'server', message: state.rootError })
    }
  }, [state.fieldErrors, state.rootError, setError])

  const first = useRef(true)
  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }

    if (state.rootError) {
      toast(state.rootError, { type: 'error' })
    }
  }, [state.rootError, state.success])

  useEffect(() => {
    if (state.success) reset()
  }, [state.success, reset])

  return (
    <form
      id='login-form'
      noValidate
      action={formAction}
      onSubmit={async (e) => {
        const ok = await trigger()
        if (!ok) e.preventDefault()
      }}
      className='flex flex-col gap-6'>
      <input className='hidden' name='callbackUrl' readOnly value={callbackUrl} />

      <label className='flex flex-col gap-1'>
        Email
        <Input type='email' {...register('email')} className='input' defaultValue={state.values?.email} />
        <FormFieldError field='email' errors={errors} />
      </label>

      <label className='flex flex-col gap-1'>
        Password
        <Input type='password' {...register('password')} className='input' defaultValue={state.values?.password} />
        <FormFieldError field='password' errors={errors} />
      </label>

      <FormFieldError field='root' errors={errors} className='-mt-2 -mb-4 text-center' />

      <div className='mt-2 flex flex-col items-center justify-center gap-3'>
        <button
          disabled={!isValid}
          data-auth-provider='credential'
          type='submit'
          className={cn(
            'mt-2 w-full max-w-xs self-center rounded-lg px-4 py-2 ring-1 outline-0',
            'hover:cursor-pointer hover:ring-[1.8px]',
            'bg-neutral-300 ring-neutral-400 dark:bg-neutral-700/40 dark:ring-neutral-700',
            'hover:bg-neutral-400/40 hover:ring-neutral-400/70 active:bg-neutral-200/90 active:ring-neutral-300 dark:hover:bg-neutral-700/70 dark:hover:ring-neutral-600/80 dark:active:bg-neutral-700/90 dark:active:ring-neutral-600',
          )}>
          Login
        </button>
        <p className='text-sm text-neutral-400 dark:text-neutral-400/70'>
          Don&apos;t have an Account?{' '}
          <Link href={{ pathname: '/account/login', query: { type: 'signup', referer: callbackUrl } }} className='px-2 text-neutral-600 hover:cursor-pointer hover:underline dark:text-neutral-200'>
            Signup
          </Link>
        </p>
      </div>
    </form>
  )
}
