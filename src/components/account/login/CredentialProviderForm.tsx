'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { z } from 'zod'
import { Button } from '@/src/components/shadcn/button'
import { Form } from '@/src/components/shadcn/form'
import FormFieldError from '@/src/components/Shared/form/FormFieldError'
import { RHFServerAction, UseRHFFormProps } from '@/src/hooks/Shared/form/react-hook-form/type'
import useRHF from '@/src/hooks/Shared/form/useRHF'
import { cn } from '@/src/lib/Shared/utils'
import { LoginSchema } from '@/src/schemas/AuthenticationSchema'

export default function CredentialProviderForm<Schema extends z.ZodSchema = typeof LoginSchema>({
  schema,
  formAction,
  formProps,
  refererCallbackUrl,
  currentMode,
  renderFields,
}: {
  currentMode: 'signUp' | 'login'
  schema: Schema
  formProps?: UseRHFFormProps<Schema>
  formAction: RHFServerAction<Schema>
  refererCallbackUrl?: string
  renderFields: (args: { form: ReturnType<typeof useRHF<Schema>>['form'] }) => React.ReactNode
}) {
  const { form, runServerValidation, isServerValidationPending, state } = useRHF<Schema>(
    schema,
    {
      mode: 'onChange',
      delayError: 150,
      ...formProps,
    },
    { serverAction: formAction },
  )

  const {
    handleSubmit,
    formState: { isValid, isLoading, isSubmitting, isValidating, errors },
    setError,
    reset,
  } = form

  const onSubmit = (data: z.infer<Schema>) => runServerValidation(data)

  useEffect(() => {
    if (state.fieldErrors) {
      Object.entries(state.fieldErrors).forEach(([_key, msgs]) => {
        const key = _key as z.infer<Schema>
        if (msgs?.length) {
          setError(key, { type: 'server', message: msgs[0] })
        }
      })
    }

    if (state.rootError) {
      setError('root', { type: 'server', message: state.rootError })
    }
  }, [state.fieldErrors, state.rootError, setError])

  useEffect(() => {
    if (state.success) reset()
  }, [state.success, reset])

  return (
    <Form {...form}>
      <form id='credentials-form' noValidate onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3'>
        <div className='grid items-baseline justify-baseline gap-3 p-2 *:odd:mt-4 *:odd:first:mt-0'>{renderFields({ form })}</div>

        <FormFieldError field='root' errors={errors} className='-mt-2 -mb-4 text-center' />

        <div className='mt-4 flex flex-col items-center justify-center gap-3'>
          <Button
            variant='base'
            isLoading={isLoading || isValidating || isSubmitting || isServerValidationPending}
            disabled={!isValid}
            data-auth-provider='credential'
            type='submit'
            size='lg'
            className={cn('w-full max-w-xs')}>
            {currentMode === 'login' ? 'Login' : 'Create Account'}
          </Button>
          <SwitchAuthenticationMode currentMode={currentMode} refererCallbackUrl={refererCallbackUrl} />
        </div>
      </form>
    </Form>
  )
}

function SwitchAuthenticationMode({ currentMode, refererCallbackUrl }: { currentMode: 'signUp' | 'login'; refererCallbackUrl?: string }) {
  const message = currentMode === 'login' ? <>Don&apos;t have an Account? </> : <> Already have an Account?</>

  return (
    <p className='text-sm text-neutral-400 dark:text-neutral-400/70'>
      {message}
      <Link
        href={{ pathname: '/account/login', query: { type: currentMode === 'login' ? 'signup' : 'signin', referer: refererCallbackUrl } }}
        className='px-2 text-neutral-600 hover:cursor-pointer hover:underline dark:text-neutral-200'>
        {currentMode === 'login' ? 'Signup' : 'Login'}
      </Link>
    </p>
  )
}
