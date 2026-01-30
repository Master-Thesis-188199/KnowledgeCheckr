import { useFormContext, useWatch } from 'react-hook-form'
import Field from '@/src/components/Shared/form/Field'
import useRHF from '@/src/hooks/Shared/form/useRHF'
import { useScopedI18n } from '@/src/i18n/client-localization'
import { cn } from '@/src/lib/Shared/utils'
import { KnowledgeCheckSettings, KnowledgeCheckSettingsSchema } from '@/src/schemas/KnowledgeCheckSettingsSchema'

export default function ShareSettings({ baseFieldProps }: {} & Pick<ReturnType<typeof useRHF<typeof KnowledgeCheckSettingsSchema>>, 'baseFieldProps'>) {
  const t = useScopedI18n('Checks.Create.SettingSection.ShareSettings')
  const { control } = useFormContext<KnowledgeCheckSettings>()
  const { shareAccessibility } = useWatch({ control: control })

  return (
    <div
      className={cn('grid grid-cols-1 items-baseline justify-baseline gap-3 *:last:mb-4 *:odd:mt-3 *:odd:first:mt-0', '@md:grid-cols-[auto_1fr] @md:gap-7 @md:gap-x-7 @md:*:last:mb-0 @md:*:odd:mt-0')}>
      <div className='grid grid-cols-[auto_1fr] items-baseline justify-baseline gap-7 gap-x-7 *:last:mb-0 *:odd:mt-0 @md:col-span-2'>
        <Field {...baseFieldProps} name='shareAccessibility' label={t('shareAccessibility')} labelClassname='mt-0.5' className='place-self-start' type='checkbox' checked={shareAccessibility} />
      </div>
    </div>
  )
}
