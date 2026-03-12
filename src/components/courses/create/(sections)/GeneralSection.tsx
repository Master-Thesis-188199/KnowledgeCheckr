'use client'

import { ComponentType, InputHTMLAttributes, useCallback, useEffect } from 'react'
import { addDays, format } from 'date-fns'
import isEmpty from 'lodash/isEmpty'
import { UseFormProps, useWatch } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import CollaboratorSelection from '@/src/components/courses/create/(sections)/CollaboratorSelection'
import { useCourseStore } from '@/src/components/courses/create/CreateCourseProvider'
import { Form, FormLabel } from '@/src/components/shadcn/form'
import Card from '@/src/components/Shared/Card'
import { CardStageJumpButton } from '@/src/components/Shared/CardStageJumpButton'
import Field from '@/src/components/Shared/form/Field'
import Input from '@/src/components/Shared/form/Input'
import { useMultiStageStore } from '@/src/components/Shared/MultiStageProgress/MultiStageStoreProvider'
import useRHF from '@/src/hooks/Shared/form/useRHF'
import { useScopedI18n } from '@/src/i18n/client-localization'
import { cn } from '@/src/lib/Shared/utils'
import { Course, CourseSchema, safeParseCourse } from '@/src/schemas/CourseSchema'
import { Any } from '@/types'

export default function GeneralSection({ jumpBackButton, ...config }: { jumpBackButton?: boolean } & Omit<UseFormProps<Course>, 'resolver' | 'defaultValues'>) {
  const { setEnabled, enabled } = useMultiStageStore((store) => store)
  const { updateCourse, ...course } = useCourseStore((state) => state)
  const FIELDS = ['name', 'description', 'closeDate', 'openDate', 'difficulty'] as Array<keyof Course>
  const now = useCallback(() => new Date(Date.now()), [])()

  const t = useScopedI18n('Checks.Create.GeneralSection')

  const { form, baseFieldProps } = useRHF(CourseSchema, {
    defaultValues: () => ({
      ...course,

      // the date-value causes the input to not display the `Date` object
      openDate: format(course.openDate ?? now, 'yyyy-LL-dd') as Any,
      closeDate: format(course.closeDate ?? addDays(now, 14), 'yyyy-LL-dd') as Any,
    }),
    mode: 'all',
    ...config,
  })

  const formValues = useWatch({ control: form.control })

  /**
   * This effect when called checks whether the form changes. When it has no errors it re-enables the `MultiStage` navigation, in case it was disabled.
   * When the form has errors, the navigation is disabled and a reason is set.
   */
  useEffect(() => {
    if (isEmpty(form.formState.errors)) {
      // only update the state once
      if (!enabled) setEnabled(true)
      return
    }

    const errors = Object.keys(form.formState.errors)

    const msg = `Please resolve ${errors.length > 1 ? 'all' : '1'} error${errors.length > 1 ? 's' : ''} in the form on your screen, to continue`
    console.warn(msg)
    setEnabled(false, msg)
  }, [formValues, enabled, setEnabled, form.formState.errors])

  return (
    <Form {...form}>
      <Card
        as='form'
        onChange={() => {
          const values = form.getValues()

          form.clearErrors()

          const { success, error } = safeParseCourse(values)
          if (!success) {
            for (const [, issue] of Object.entries(error.issues)) {
              if (!issue) continue
              const fieldName = issue.path.at(-1) as unknown as (typeof FIELDS)[number]

              if (!FIELDS.includes(fieldName)) {
                console.warn(`[Form]: Detected error for '${fieldName}' but is not part of relevant fields`, FIELDS, ', ignoring error.', issue.message)
                continue
              }

              form.setError(fieldName as Any, { message: issue.message, type: issue.code })
            }

            return
          }

          // transfer form-values into create-store
          console.debug('Updating store with:', values)
          updateCourse(values)
        }}
        className='@container relative flex flex-col gap-8 p-3'
        disableInteractions>
        {jumpBackButton && <CardStageJumpButton targetStage={1} />}
        <div className='header -m-3 flex flex-col rounded-t-md border-b border-neutral-400 bg-neutral-300 p-2 px-3 text-neutral-600 dark:border-neutral-500 dark:bg-neutral-700/60 dark:text-neutral-300'>
          <div className='flex items-center justify-between'>
            <h2 className=''>{t('title')}</h2>
          </div>
        </div>

        <div
          className={cn(
            // prettier-ignore
            'grid p-2',
            'grid-cols-1 items-baseline justify-baseline gap-3 *:last:mb-4 *:odd:mt-3 *:odd:first:mt-0',
            '@md:grid-cols-[auto_1fr] @md:gap-7 @md:gap-x-7 @md:*:last:mb-0 @md:*:odd:mt-0',
            'dark:**:[&::-webkit-calendar-picker-indicator]:brightness-80',
            'dark:**:[&::-webkit-inner-spin-button]:brightness-80',
          )}>
          <Field {...baseFieldProps} name='name' type='text' label={t('name_label')} placeholder={t('name_placeholder')} />
          <Field {...baseFieldProps} name='description' label={t('description_label')} placeholder={t('description_placeholder')} type='text' />
          <Field {...baseFieldProps} name='difficulty' label={t('difficulty_label')} min={0} type='number' onChange={({ valueAsNumber }) => valueAsNumber} />
          <Field {...baseFieldProps} label={t('openDate_label')} name='openDate' type='date' />
          <Field {...baseFieldProps} label={t('closeDate_label')} name='closeDate' type='date' />
          <>
            <FormLabel>{t('collaborators_label')}</FormLabel>
            <CollaboratorSelection />
          </>
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
          'rounded-md px-3 py-1.5 text-neutral-600 ring-1 ring-neutral-400 outline-none placeholder:text-neutral-400/90 hover:cursor-text hover:ring-ring-hover focus:ring-[1.2px] focus:ring-ring-focus dark:text-neutral-300/80 dark:ring-neutral-500 dark:placeholder:text-neutral-400/50 dark:hover:ring-ring-hover dark:focus:ring-ring-focus',
          props.className,
        )}
      />
    </>
  )
}
