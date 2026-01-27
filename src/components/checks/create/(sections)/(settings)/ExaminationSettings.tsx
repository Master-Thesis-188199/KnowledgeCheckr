import { format } from 'date-fns'
import { useFormContext, useWatch } from 'react-hook-form'
import Field from '@/src/components/Shared/form/Field'
import useRHF from '@/src/hooks/Shared/form/useRHF'
import { useScopedI18n } from '@/src/i18n/client-localization'
import { cn } from '@/src/lib/Shared/utils'
import { KnowledgeCheckSettings, KnowledgeCheckSettingsSchema } from '@/src/schemas/KnowledgeCheckSettingsSchema'

export function ExaminationSettings({ baseFieldProps }: {} & Pick<ReturnType<typeof useRHF<typeof KnowledgeCheckSettingsSchema>>, 'baseFieldProps'>) {
  const t = useScopedI18n('Checks.Create.SettingSection.ExaminationSettings')
  const {
    control,
    formState: { errors },
  } = useFormContext<KnowledgeCheckSettings>()

  const { examination } = useWatch({ control })
  const { examTimeFrameSeconds, questionOrder, answerOrder, enableExaminations } = examination!
  const humanReadableTimeFrame = useHumanReadableDuration(examTimeFrameSeconds, !!errors.examination?.examTimeFrameSeconds)

  return (
    <div
      className={cn('grid grid-cols-1 items-baseline justify-baseline gap-3 *:last:mb-4 *:odd:mt-3 *:odd:first:mt-0', '@md:grid-cols-[auto_1fr] @md:gap-7 @md:gap-x-7 @md:*:last:mb-0 @md:*:odd:mt-0')}>
      <Field
        {...baseFieldProps}
        name='examination.enableExaminations'
        label={t('enableExaminations_label')}
        labelClassname='mt-0.5'
        className='place-self-start'
        type='checkbox'
        checked={enableExaminations}
      />

      <Field
        {...baseFieldProps}
        disabled={!enableExaminations}
        name='examination.questionOrder'
        label={t('questionOrder_label')}
        labelClassname='mt-0.5'
        className='place-self-start'
        type='checkbox'
        onChange={({ checked }) => (checked ? 'random' : 'create-order')}
        checked={questionOrder === 'random'}
      />
      <Field
        {...baseFieldProps}
        disabled={!enableExaminations}
        name='examination.answerOrder'
        label={t('answerOrder_label')}
        labelClassname='mt-0.5'
        className='place-self-start'
        type='checkbox'
        onChange={({ checked }) => (checked ? 'random' : 'create-order')}
        checked={answerOrder === 'random'}
      />

      <Field
        {...baseFieldProps}
        disabled={!enableExaminations}
        onChange={({ value }) =>
          value
            .split(':')
            .map((el, i) => parseInt(el) * (i === 0 ? 3600 : 60))
            .reduce((a, b) => a + b, 0)
        }
        modifyValue={(value: number) => {
          const hours = Math.floor(value / 3600)
          const minutes = Math.floor((value % 3600) / 60)
          return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}` // --> HH:mm format
        }}
        type='time'
        name='examination.examTimeFrameSeconds'
        label={t('examTimeFrameSeconds_label')}
        list='time-values'>
        <span className='pt-1 pl-3 text-sm tracking-wider text-neutral-500/80 dark:text-neutral-400'>{humanReadableTimeFrame}</span>
      </Field>

      <datalist id='time-values'>
        <option value='00:30' label='30 minutes'></option>
        <option value='00:45' label='45 minutes'></option>
        <option value='01:00' label='60 minutes'></option>
        <option value='01:30' label='90 minutes'></option>
      </datalist>

      <Field {...baseFieldProps} disabled={!enableExaminations} name='examination.examinationAttemptCount' label={t('examinationAttemptCount_label')} type='number' min={0} />

      <Field
        {...baseFieldProps}
        disabled={!enableExaminations}
        label={t('startDate_label')}
        modifyValue={(date) => {
          if (date instanceof Date) return format(date, 'yyyy-MM-dd hh:mm')

          return date
        }}
        name='examination.startDate'
        type='datetime-local'
      />
      <Field
        {...baseFieldProps}
        disabled={!enableExaminations}
        label={t('endDate_label')}
        modifyValue={(date) => {
          if (date === null) return ''

          if (date instanceof Date) return format(date, 'yyyy-MM-dd hh:mm')

          return date
        }}
        name='examination.endDate'
        type='datetime-local'
      />
    </div>
  )
}

/**
 * Produces a human readable time format based on the provided seconds, e.g. 1 minute, 1 hour and 2 minutes, ...
 * @param seconds The seconds to transform into a human readable string
 * @param isErrorneous When set to true the function will return null
 * @returns A human readable string or nothing when `isErrorneous` is set to true or `seconds` is undefined.
 */
function useHumanReadableDuration(seconds?: number, isErrorneous?: boolean) {
  const t = useScopedI18n('Shared.Timestamp')
  if (isErrorneous || seconds === undefined) return null

  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)

  const segments: string[] = []
  if (hours > 0) segments.push(t('hour', { count: hours }))
  if (minutes > 0) segments.push(t('minute', { count: minutes }))

  return segments.join(` ${t('join_word')} `)
}
