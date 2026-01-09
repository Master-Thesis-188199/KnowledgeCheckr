/* app/account/login/SignupForm.tsx */
'use client'

import { useActionState, useEffect, useRef, useTransition } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { toast } from 'react-toastify'
import { Button } from '@/src/components/shadcn/button'
import { Form } from '@/src/components/shadcn/form'
import Field from '@/src/components/Shared/form/Field'
import FormFieldError from '@/src/components/Shared/form/FormFieldError'
import { cn } from '@/src/lib/Shared/utils'
import { SignupProps, SignupSchema } from '@/src/schemas/AuthenticationSchema'
import { signupAction } from '../../../lib/account/login/AccountActions'

export default function SignupForm({ callbackUrl, refererCallbackUrl }: { callbackUrl?: string; refererCallbackUrl?: string }) {
  const [state, formAction] = useActionState(signupAction, { success: false })
  const [isPending, start] = useTransition()

  const form = useForm<SignupProps>({
    resolver: zodResolver(SignupSchema),
    delayError: 150,
    mode: 'onChange',
    defaultValues: {
      name: state.values?.name ?? '',
      email: state.values?.email ?? '',
      password: state.values?.password ?? '',
      callbackURL: callbackUrl,
    },
  })

  // prettier-ignore
  const { setError, formState: { errors, isValid, isLoading, isSubmitting, isValidating }, reset, handleSubmit } = form

  const onSubmit = (formData: SignupProps) => {
    console.log(formData.callbackURL)
    start(() => {
      formAction(formData)
    })
  }

  useEffect(() => {
    if (state.fieldErrors) {
      Object.entries(state.fieldErrors).forEach(([_key, msgs]) => {
        const key = _key as keyof SignupProps
        if (msgs?.length) {
          setError(key, { type: 'server', message: msgs[0] })
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
    if (state.success) {
      reset()
    }
  }, [state.success, reset])

  return (
    <Form {...form}>
      <form id='signup-form' noValidate onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3'>
        <Field form={form} name='callbackURL' className='hidden' containerClassname='hidden' readOnly showLabel={false} />

        <div className='grid items-baseline justify-baseline gap-3 p-2 *:odd:mt-4 *:odd:first:mt-0'>
          <Field form={form} label='Username' name='name' placeholder='your username' type='text' />
          <Field form={form} name='email' placeholder='user@email.com' type='email' />
          <Field form={form} name='password' placeholder='your password' type='password' />
        </div>

        <FormFieldError field='root' errors={errors} className='-mt-2 -mb-4 text-center' />

        <div className='mt-4 flex flex-col items-center justify-center gap-3'>
          <Button
            variant='base'
            isLoading={isLoading || isValidating || isSubmitting || isPending}
            disabled={!isValid}
            data-auth-provider='credential'
            type='submit'
            size='lg'
            className={cn('w-full max-w-xs')}>
            Create account
          </Button>
          <p className='text-sm text-neutral-400 dark:text-neutral-400/70'>
            Already have an Account?
            <Link
              href={{ pathname: '/account/login', query: { type: 'signin', referer: refererCallbackUrl } }}
              className='px-2 text-neutral-600 hover:cursor-pointer hover:underline dark:text-neutral-200'>
              Signin
            </Link>
          </p>
        </div>
      </form>
    </Form>
  )
}
