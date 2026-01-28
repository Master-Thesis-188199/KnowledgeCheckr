'use client'

import React from 'react'
import { GraduationCapIcon, Share2Icon } from 'lucide-react'
import { UseFormProps } from 'react-hook-form'
import { TbSettingsAutomation } from 'react-icons/tb'
import { ExaminationSettings } from '@/src/components/checks/create/(sections)/(settings)/ExaminationSettings'
import PracticeSettings from '@/src/components/checks/create/(sections)/(settings)/PracticeSettings'
import { useCheckStore } from '@/src/components/checks/create/CreateCheckProvider'
import { Form } from '@/src/components/shadcn/form'
import Card from '@/src/components/Shared/Card'
import { CardStageJumpButton } from '@/src/components/Shared/CardStageJumpButton'
import useRHF from '@/src/hooks/Shared/form/useRHF'
import { useScopedI18n } from '@/src/i18n/client-localization'
import { cn } from '@/src/lib/Shared/utils'
import { KnowledgeCheckSettings, KnowledgeCheckSettingsSchema } from '@/src/schemas/KnowledgeCheckSettingsSchema'

export default function SettingsSection({ jumpBackButtons, ...config }: { jumpBackButtons?: boolean } & Omit<UseFormProps<KnowledgeCheckSettings>, 'resolver' | 'defaultValues'>) {
  const { updateSettings, settings } = useCheckStore((state) => state)
  const t = useScopedI18n('Checks.Create.SettingSection')

  const { form, baseFieldProps } = useRHF(KnowledgeCheckSettingsSchema, {
    mode: 'all',
    delayError: 100,
    defaultValues: () => settings,
    ...config,
  })

  const { getValues } = form

  return (
    <Form {...form}>
      <form onChange={() => updateSettings(getValues())} className='@container my-4 grid grid-cols-1 gap-10 @[700px]:grid-cols-[repeat(auto-fill,minmax(600px,1fr))]'>
        <Card className='relative row-span-2' disableInteractions>
          {jumpBackButtons && <CardStageJumpButton targetStage={3} />}
          <CardHeading title={t('ExaminationSettings.title')} Icon={GraduationCapIcon} />
          <ExaminationSettings baseFieldProps={baseFieldProps} />
        </Card>

        <Card className='relative' disableInteractions>
          {jumpBackButtons && <CardStageJumpButton targetStage={3} />}
          <CardHeading title={t('PracticeSettings.title')} Icon={TbSettingsAutomation} />
          <PracticeSettings baseFieldProps={baseFieldProps} />
        </Card>
        <Card className='relative' disableInteractions>
          {jumpBackButtons && <CardStageJumpButton targetStage={3} />}
          <CardHeading title={t('ShareSettings.title')} Icon={Share2Icon} iconClass='size-4.5' />
        </Card>
      </form>
    </Form>
  )
}

function CardHeading({ title, Icon, iconClass }: { title: string; Icon: React.ComponentType<{ className?: string }>; iconClass?: string }) {
  return (
    <div className='header -m-4 mb-5 flex flex-col rounded-t-md border-b border-neutral-400 bg-neutral-300 p-2 px-3 text-neutral-600 dark:border-neutral-500 dark:bg-neutral-700/60 dark:text-neutral-300/90'>
      <div className='flex items-center justify-between'>
        <h2 className='flex items-center gap-2'>
          <Icon className={cn('size-5.5', iconClass)} />
          <span className=''>{title}</span>
        </h2>
      </div>
    </div>
  )
}
