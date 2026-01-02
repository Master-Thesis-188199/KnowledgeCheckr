'use client'

import { ComponentType, InputHTMLAttributes, useCallback } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { addDays, format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import { useCheckStore } from '@/src/components/checks/create/CreateCheckProvider'
import { Form } from '@/src/components/shadcn/form'
import Card from '@/src/components/Shared/Card'
import Field from '@/src/components/Shared/form/Field'
import Input from '@/src/components/Shared/form/Input'
import { cn } from '@/src/lib/Shared/utils'
import { KnowledgeCheckSchema, safeParseKnowledgeCheck } from '@/src/schemas/KnowledgeCheck'
import { Any } from '@/types'

export default function GeneralSection() {
  const { updateCheck, ...check } = useCheckStore((state) => state)
  const now = useCallback(() => new Date(Date.now()), [])()

  const form = useForm({
    resolver: zodResolver(KnowledgeCheckSchema),
    defaultValues: {
      ...check,

      // the date-value causes the input to not display the `Date` object
      openDate: format(check.openDate ?? now, 'yyyy-LL-dd') as Any,
      closeDate: format(check.closeDate ?? addDays(now, 14), 'yyyy-LL-dd') as Any,
    },
    mode: 'all',
  })

  return (
    <Form {...form}>
      <Card
        as='form'
        onChange={() => {
          const values = form.getValues()

          const { success, error } = safeParseKnowledgeCheck(values)
          if (!success) {
            for (const [key, messages] of Object.entries(error.formErrors.fieldErrors)) {
              if (!messages) continue

              for (const msg of messages) form.setError(key as Any, { message: msg, type: 'custom' })
            }
          } else {
            form.clearErrors()

            // transfer form-values into create-store
            console.debug('Updating store with:', values)
            updateCheck(values)
          }
        }}
        className='@container flex flex-col gap-8 p-3'
        disableInteractions>
        <div className='header -m-3 flex flex-col rounded-t-md border-b border-neutral-400 bg-neutral-300 p-2 px-3 text-neutral-600 dark:border-neutral-500 dark:bg-neutral-700/60 dark:text-neutral-300'>
          <div className='flex items-center justify-between'>
            <h2 className=''>General Information</h2>
          </div>
        </div>

        <div
          className={cn(
            // prettier-ignore
            'grid p-2',
            'grid-cols-1 items-baseline justify-baseline gap-3 *:last:mb-4 *:odd:mt-6 *:odd:first:mt-0',
            '@md:grid-cols-[auto_1fr] @md:gap-9 @md:gap-x-7 @md:*:last:mb-0 @md:*:odd:mt-0',
            'dark:**:[&::-webkit-calendar-picker-indicator]:brightness-80',
            'dark:**:[&::-webkit-inner-spin-button]:brightness-80',
          )}>
          <Field form={form} name='name' type='text' />
          <Field form={form} name='description' placeholder='Describe the concept of your knowledge check using a few words.' type='text' />
          <Field form={form} name='difficulty' type='number' onChange={({ valueAsNumber }) => valueAsNumber} />
          <Field form={form} label='Start Date' name='openDate' type='date' />
          <Field form={form} label='Deadline' name='closeDate' type='date' />
        </div>
      </Card>
    </Form>
  )
}

export function InputGroup<E extends ComponentType>({ label, as, ...props }: { label: string; as?: E } & InputHTMLAttributes<HTMLInputElement>) {
  const Element = as || Input

  return (
    <>
      <label className='text-neutral-600 dark:text-neutral-400'>{label}</label>
      <Element
        placeholder='Enter some text'
        {...props}
        className={twMerge(
          'focus:ring-ring-focus dark:focus:ring-ring-focus hover:ring-ring-hover dark:hover:ring-ring-hover rounded-md px-3 py-1.5 text-neutral-600 ring-1 ring-neutral-400 outline-none placeholder:text-neutral-400/90 hover:cursor-text focus:ring-[1.2px] dark:text-neutral-300/80 dark:ring-neutral-500 dark:placeholder:text-neutral-400/50',
          props.className,
        )}
      />
    </>
  )
}
