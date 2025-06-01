/* app/account/login/SignupForm.tsx */
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { useActionState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import FormFieldError from '@/src/components/Shared/form/FormFieldError'
import Input from '@/src/components/Shared/form/Input'
import { SignupSchema } from '@/src/schemas/AuthenticationSchema'
import Link from 'next/link'
import { toast } from 'react-toastify'
import { signup } from './actions'

type FormValues = z.infer<typeof SignupSchema>

export default function SignupForm() {
  const [state, formAction] = useActionState(signup, { success: false, values: {} })

  const {
    register,
    trigger,
    setError,
    formState: { errors, isValid },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(SignupSchema),
    delayError: 150,
    mode: 'onChange',
    defaultValues: {
      name: state.values?.name,
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
    if (state.success) {
      reset()
    }
  }, [state.success, reset])

  return (
    <form
      id='signup-form'
      noValidate
      action={formAction}
      onSubmit={async (e) => {
        const ok = await trigger()
        if (!ok) e.preventDefault()
      }}
      className='flex flex-col gap-6'>
      <label className='flex flex-col gap-1'>
        Username
        <Input {...register('name')} className='input' defaultValue={state.values?.name} />
        <FormFieldError field='name' errors={errors} />
      </label>

      <label className='flex flex-col gap-1'>
        Email
        <Input {...register('email')} className='input' defaultValue={state.values?.email} />
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
          type='submit'
          disabled={!isValid}
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
