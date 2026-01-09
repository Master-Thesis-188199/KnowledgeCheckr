'use client'

import { useActionState, useEffect, useRef, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Form } from '@/src/components/shadcn/form'
import Field from '@/src/components/Shared/form/Field'
import FormFieldError from '@/src/components/Shared/form/FormFieldError'
import { cn } from '@/src/lib/Shared/utils'
import { LoginProps, LoginSchema } from '@/src/schemas/AuthenticationSchema'
import { signin } from '../../../lib/account/login/AccountActions'

export default function LoginForm({ callbackUrl, refererCallbackUrl }: { callbackUrl?: string; refererCallbackUrl?: string }) {
  const [state, formAction] = useActionState(signin, { success: false })
  const [isPending, start] = useTransition()

  const form = useForm<LoginProps>({
    resolver: zodResolver(LoginSchema),
    mode: 'onChange',
    delayError: 150,
    defaultValues: {
      email: state.values?.email,
      password: state.values?.password,
      callbackURL: callbackUrl,
    },
  })
  const {
    setError,
    formState: { errors, isValid },
    reset,
    handleSubmit,
  } = form

  const onSubmit = (formData: LoginProps) => {
    console.log(formData.callbackURL)
    start(() => {
      formAction(formData)
    })
  }

  useEffect(() => {
    if (state.fieldErrors) {
      Object.entries(state.fieldErrors).forEach(([key, msgs]) => {
        if (msgs?.length) {
          setError(key as keyof LoginProps, { type: 'server', message: msgs[0] })
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
    <Form {...form}>
      <form id='login-form' noValidate onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3'>
        <Field form={form} name='callbackURL' className='hidden' containerClassname='hidden' readOnly showLabel={false} />

        <div className='grid items-baseline justify-baseline gap-3 p-2 *:odd:mt-3 *:odd:first:mt-0'>
          <Field form={form} name='email' placeholder='user@email.com' type='email' />
          <Field form={form} name='password' placeholder='your password' type='password' />
        </div>

        <FormFieldError field='root' errors={errors} className='-mt-2 -mb-4 text-center' />

        <div className='mt-2 flex flex-col items-center justify-center gap-3'>
          <button
            disabled={!isValid}
            data-auth-provider='credential'
            type='submit'
            className={cn(
              'mt-2 w-full max-w-xs self-center rounded-lg px-4 py-2 ring-1 outline-0',
              'hover:cursor-pointer dark:hover:ring-[1.8px]',
              'bg-neutral-100/80 shadow-sm shadow-neutral-400/70 ring-neutral-400/70 dark:bg-neutral-700/40 dark:shadow-inherit dark:ring-neutral-700',
              'hover:ring-ring-hover dark:hover:ring-ring-hover hover:bg-neutral-50/80 hover:shadow-neutral-400 active:bg-neutral-200/90 active:ring-neutral-300 dark:hover:bg-neutral-700/70 dark:hover:shadow-inherit dark:active:bg-neutral-700/90 dark:active:ring-neutral-600',
            )}>
            Login
          </button>
          <p className='text-sm text-neutral-600/50 dark:text-neutral-400/70'>
            Don&apos;t have an Account?{' '}
            <Link
              href={{ pathname: '/account/login', query: { type: 'signup', referer: refererCallbackUrl } }}
              className='px-2 text-neutral-800 hover:cursor-pointer hover:underline dark:text-neutral-200'>
              Signup
            </Link>
          </p>
        </div>
      </form>
    </Form>
  )
}
