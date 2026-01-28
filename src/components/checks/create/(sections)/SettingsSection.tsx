'use client'

import { UsersIcon } from '@heroicons/react/24/outline'
import { EyeIcon, GraduationCapIcon, PlayIcon } from 'lucide-react'
import { useWatch } from 'react-hook-form'
import { ExaminationSettings } from '@/src/components/checks/create/(sections)/(settings)/ExaminationSettings'
import PracticeSettings from '@/src/components/checks/create/(sections)/(settings)/PracticeSettings'
import { InputGroup } from '@/src/components/checks/create/(sections)/GeneralSection'
import { useCheckStore } from '@/src/components/checks/create/CreateCheckProvider'
import { Form } from '@/src/components/shadcn/form'
import Card from '@/src/components/Shared/Card'
import { TabButton } from '@/src/components/Shared/tabs/TabButton'
import { TabsContentPanel } from '@/src/components/Shared/tabs/TabsContentPanel'
import { TabSelect } from '@/src/components/Shared/tabs/TabSelect'
import TabsProvider, { Tab, useTabsContext } from '@/src/components/Shared/tabs/TabsProvider'
import useRHF from '@/src/hooks/Shared/form/useRHF'
import { useScopedI18n } from '@/src/i18n/client-localization'
import { KnowledgeCheckSettingsSchema } from '@/src/schemas/KnowledgeCheckSettingsSchema'

export default function SettingsSection() {
  const { updateSettings, settings } = useCheckStore((state) => state)
  const t = useScopedI18n('Checks.Create.SettingSection')

  const tabs: Tab[] = [
    { key: 'general', name: t('tabs.general'), icon: EyeIcon },
    { key: 'practice', name: t('tabs.practice'), icon: PlayIcon },
    { key: 'examination', name: t('tabs.examination'), icon: GraduationCapIcon },
    { key: 'sharing', name: t('tabs.sharing'), icon: UsersIcon },
  ]

  const { form, baseFieldProps } = useRHF(KnowledgeCheckSettingsSchema, {
    mode: 'all',
    delayError: 100,
    defaultValues: () => settings,
  })

  const { getValues } = form
  const { practice } = useWatch({ control: form.control })

  return (
    <Form {...form}>
      <Card as='form' onChange={() => updateSettings(getValues())} className='@container flex break-inside-avoid-column flex-col gap-8 p-3' disableInteractions>
        <div className='header -m-3 flex flex-col rounded-t-md border-b border-neutral-400 bg-neutral-300 p-2 px-3 text-neutral-600 dark:border-neutral-500 dark:bg-neutral-700/60 dark:text-neutral-300'>
          <div className='flex items-center justify-between'>
            <h2 className=''>{t('title')}</h2>
          </div>
        </div>
        <TabsProvider tabs={tabs}>
          <div className=''>
            <div className='mx-2 sm:hidden'>
              <label htmlFor='tabs' className='sr-only'>
                {t('tabs.sr_only_label')}
              </label>

              <TabSelect id='tabs' />
            </div>

            <div className='-mt-2 hidden sm:block'>
              <div className='border-b border-neutral-400/70 dark:border-neutral-400'>
                <nav className='-mb-px flex justify-between px-4' aria-label='Tabs'>
                  {tabs.map((tab) => (
                    <TabButton key={tab.name} tab={tab} />
                  ))}
                </nav>
              </div>
            </div>
          </div>

          <TabsContentPanel tabKey='general'>
            <div className='grid grid-cols-[auto_1fr] gap-4 gap-x-7'></div>
          </TabsContentPanel>
          <TabsContentPanel tabKey='practice'>
            <PracticeSettings baseFieldProps={baseFieldProps} />
          </TabsContentPanel>
          <TabsContentPanel tabKey='examination'>
            <ExaminationSettings baseFieldProps={baseFieldProps} />
          </TabsContentPanel>
          <TabsContentPanel tabKey='sharing'>
            <TemporarySettingsOptions />
          </TabsContentPanel>
        </TabsProvider>
      </Card>
    </Form>
  )
}

function TemporarySettingsOptions() {
  const { currentTab } = useTabsContext()

  return (
    <div className='-mt-2'>
      <div className='grid grid-cols-[auto_1fr] items-center gap-9 gap-x-7 p-2'>
        <InputGroup label={currentTab} placeholder='Configure your KnowledgeCheck' />
        <InputGroup label={currentTab} placeholder='Configure your KnowledgeCheck' />
        <InputGroup label={currentTab} placeholder='Configure your KnowledgeCheck' />
      </div>
    </div>
  )
}
