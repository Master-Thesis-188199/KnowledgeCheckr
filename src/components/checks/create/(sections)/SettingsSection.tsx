'use client'

import { UsersIcon } from '@heroicons/react/24/outline'
import { zodResolver } from '@hookform/resolvers/zod'
import { EyeIcon, GraduationCapIcon, PlayIcon } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { InputGroup } from '@/src/components/checks/create/(sections)/GeneralSection'
import { useCheckStore } from '@/src/components/checks/create/CreateCheckProvider'
import Card from '@/src/components/Shared/Card'
import { TabButton } from '@/src/components/Shared/tabs/TabButton'
import { TabsContentPanel } from '@/src/components/Shared/tabs/TabsContentPanel'
import { TabSelect } from '@/src/components/Shared/tabs/TabSelect'
import TabsProvider, { useTabsContext } from '@/src/components/Shared/tabs/TabsProvider'
import { instantiateKnowledgeCheckSettings, KnowledgeCheckSettings, KnowledgeCheckSettingsSchema } from '@/src/schemas/KnowledgeCheckSettingsSchema'

const tabs = [
  { name: 'General', icon: EyeIcon },
  { name: 'Practice', icon: PlayIcon },
  { name: 'Examination', icon: GraduationCapIcon },
  { name: 'Sharing', icon: UsersIcon },
]
export default function SettingsSection() {
  const {} = useCheckStore((state) => state)

  const { control, handleSubmit, reset } = useForm<KnowledgeCheckSettings>({
    resolver: zodResolver(KnowledgeCheckSettingsSchema),
    defaultValues: instantiateKnowledgeCheckSettings(),
  })

  const onSubmit = (data: KnowledgeCheckSettings) => {
    console.log(JSON.stringify(data, null, 2))
    reset({}) //todo ...introduce default values
  }

  return (
    <Card as='form' onSubmit={handleSubmit(onSubmit)} className='@container flex break-inside-avoid-column flex-col gap-8 p-3' disableHoverStyles>
      <div className='header -m-3 flex flex-col rounded-t-md border-b border-neutral-400 bg-neutral-300 p-2 px-3 text-neutral-600 dark:border-neutral-500 dark:bg-neutral-700/60 dark:text-neutral-300'>
        <div className='flex items-center justify-between'>
          <h2 className=''>Settings</h2>
        </div>
      </div>
      <TabsProvider tabs={tabs}>
        <div className=''>
          <div className='mx-2 sm:hidden'>
            <label htmlFor='tabs' className='sr-only'>
              Select a tab
            </label>

            <TabSelect id='tabs' />
          </div>

          <div className='-mt-2 hidden sm:block'>
            <div className='border-b border-neutral-400'>
              <nav className='-mb-px flex justify-between px-4' aria-label='Tabs'>
                {tabs.map((tab) => (
                  <TabButton key={tab.name} tab={tab} />
                ))}
              </nav>
            </div>
          </div>
        </div>

        <TabsContentPanel tab='general'>
          <label className='flex items-center gap-3'>
            Randomize Question Order
            <Controller
              name='questionOrder'
              control={control}
              render={({ field }) => (
                <input
                  type='checkbox'
                  defaultChecked={field.value === 'random'}
                  {...field}
                  onChange={(event) => {
                    field.onChange(Object.assign(event, { target: { value: event.target.checked === true ? 'random' : 'create-order' } }))
                  }}
                />
              )}
            />
          </label>

          <label className='flex items-center gap-3'>
            Randomize Answer Order
            <Controller
              name='answerOrder'
              control={control}
              render={({ field }) => (
                <input
                  type='checkbox'
                  defaultChecked={field.value === 'random'}
                  {...field}
                  onChange={(event) => {
                    field.onChange(Object.assign(event, { target: { value: event.target.checked === true ? 'random' : 'create-order' } }))
                  }}
                />
              )}
            />
          </label>
        </TabsContentPanel>
        <TabsContentPanel tab='practice'>
          <TemporarySettingsOptions />
        </TabsContentPanel>
        <TabsContentPanel tab='examination'>
          <TemporarySettingsOptions />
        </TabsContentPanel>
        <TabsContentPanel tab='sharing'>
          <TemporarySettingsOptions />
        </TabsContentPanel>
      </TabsProvider>
    </Card>
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
