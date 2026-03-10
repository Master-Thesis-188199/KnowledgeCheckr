'use client'

import { LoaderCircleIcon } from 'lucide-react'
import { z } from 'zod'
import { Form } from '@/src/components/shadcn/form'
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from '@/src/components/shadcn/input-otp'
import SmoothPresenceTransition from '@/src/components/Shared/Animations/SmoothPresenceTransition'
import FormFieldError from '@/src/components/Shared/form/FormFieldError'
import useRHF from '@/src/hooks/Shared/form/useRHF'
import { cn } from '@/src/lib/Shared/utils'

const schema = z.object({
  shareToken: z.string().toUpperCase().length(8),
})

export function ShareTokenInput() {
  const { form } = useRHF(schema, { mode: 'onChange', defaultValues: () => ({ shareToken: '' }), delayError: 400 })
  const registration = form.register('shareToken')
  const isInvalid = form.formState.errors.shareToken && form.getValues().shareToken.length > 0

  return (
    <Form {...form}>
      <form onSubmit={(e) => e.preventDefault()} className='flex flex-col items-center gap-2'>
        <InputOTP
          {...registration}
          maxLength={schema.shape.shareToken.maxLength ?? 8}
          onChange={(input) => {
            form.clearErrors('root') // clears custom errors, like check not found
            return registration.onChange({ target: { value: input, name: 'shareToken' } })
          }}>
          <InputOTPGroup>
            <InputOTPSlot index={0} aria-invalid={isInvalid} />
            <InputOTPSlot index={1} aria-invalid={isInvalid} />
            <InputOTPSlot index={2} aria-invalid={isInvalid} />
            <InputOTPSlot index={3} aria-invalid={isInvalid} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={4} aria-invalid={isInvalid} />
            <InputOTPSlot index={5} aria-invalid={isInvalid} />
            <InputOTPSlot index={6} aria-invalid={isInvalid} />
            <InputOTPSlot index={7} aria-invalid={isInvalid} />
          </InputOTPGroup>
        </InputOTP>
        <FormFieldError showIcon errors={form.formState.errors} field='shareToken' className={cn(form.getValues().shareToken?.length === 0 && 'hidden')} />
      </form>

      <div className='-mt-6'>
        <SmoothPresenceTransition
          active={form.formState.isValid}
          presenceTiming={{ minVisibleMs: 450 }}
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 1, margin: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className='mt-6 flex items-center justify-center gap-2 text-muted-foreground'>
          <LoaderCircleIcon className='size-5 animate-spin' />
          Parsing token
        </SmoothPresenceTransition>
      </div>

      <div className='flex justify-center'>
        <FormFieldError showIcon errors={form.formState.errors} field='root' />
      </div>
    </Form>
  )
}
