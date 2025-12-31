'use client'

import { UsersIcon } from '@heroicons/react/24/outline'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { EyeIcon, GraduationCapIcon, PlayIcon } from 'lucide-react'
import { Controller, useForm, useWatch } from 'react-hook-form'
import { InputGroup } from '@/src/components/checks/create/(sections)/GeneralSection'
import { useCheckStore } from '@/src/components/checks/create/CreateCheckProvider'
import Card from '@/src/components/Shared/Card'
import FormFieldError from '@/src/components/Shared/form/FormFieldError'
import Input from '@/src/components/Shared/form/Input'
import { TabButton } from '@/src/components/Shared/tabs/TabButton'
import { TabsContentPanel } from '@/src/components/Shared/tabs/TabsContentPanel'
import { TabSelect } from '@/src/components/Shared/tabs/TabSelect'
import TabsProvider, { useTabsContext } from '@/src/components/Shared/tabs/TabsProvider'
import { KnowledgeCheckSettings, KnowledgeCheckSettingsSchema } from '@/src/schemas/KnowledgeCheckSettingsSchema'

const tabs = [
  { name: 'General', icon: EyeIcon },
  { name: 'Practice', icon: PlayIcon },
  { name: 'Examination', icon: GraduationCapIcon },
  { name: 'Sharing', icon: UsersIcon },
]
export default function SettingsSection() {
  const { updateSettings, settings } = useCheckStore((state) => state)

  const {
    control,
    getValues,
    formState: { errors },
  } = useForm<KnowledgeCheckSettings>({
    resolver: zodResolver(KnowledgeCheckSettingsSchema),
    mode: 'all',
    delayError: 100,
    defaultValues: settings,
  })

  const { examTimeFrameSeconds } = useWatch({ control })

  return (
    <Card as='form' onChange={() => updateSettings(getValues())} className='@container flex break-inside-avoid-column flex-col gap-8 p-3' disableInteractions>
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
            <div className='border-b border-neutral-400/70 dark:border-neutral-400'>
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
              render={({ field }) => <input type='checkbox' {...field} checked={field.value === 'random'} onChange={(e) => field.onChange(e.target.checked ? 'random' : 'create-order')} />}
            />
          </label>

          <label className='flex items-center gap-3'>
            Randomize Answer Order
            <Controller
              name='answerOrder'
              control={control}
              render={({ field }) => <input type='checkbox' {...field} checked={field.value === 'random'} onChange={(e) => field.onChange(e.target.checked ? 'random' : 'create-order')} />}
            />
          </label>
        </TabsContentPanel>
        <TabsContentPanel tab='practice'>
          <TemporarySettingsOptions />
        </TabsContentPanel>
        <TabsContentPanel tab='examination'>
          <label className='mb-4 flex items-center gap-3'>
            Examination Time Frame
            <Controller
              name='examTimeFrameSeconds'
              control={control}
              render={({ field }) => (
                <div className='relative'>
                  <Input
                    className='text-center invalid:!ring-red-400/80'
                    min={'00:01'}
                    max={'05:00'}
                    list='time-values'
                    type='time'
                    {...field}
                    value={format(new Date(field.value * 1000 - 3600 * 1000), 'HH:mm')}
                    onChange={(e) => {
                      const seconds = e.target.value
                        .split(':')
                        .map((el, i) => parseInt(el) * (i === 0 ? 3600 : 60))
                        .reduce((a, b) => a + b, 0)
                      return field.onChange(seconds)
                    }}
                  />

                  <datalist id='time-values'>
                    <option value='00:30' label='30 minutes'></option>
                    <option value='00:45' label='45 minutes'></option>
                    <option value='01:00' label='60 minutes'></option>
                    <option value='01:30' label='90 minutes'></option>
                  </datalist>

                  <span className='absolute -bottom-5 left-2.5 text-sm tracking-wider text-neutral-500/80 dark:text-neutral-400'>
                    {format(new Date(examTimeFrameSeconds! * 1000 - 3600 * 1000), 'HH:mm')
                      .split(':')
                      .map((el, i) => `${el}${i === 0 ? 'h' : 'm'}`)
                      .join(':')}
                  </span>
                </div>
              )}
            />
            <FormFieldError errors={errors} field='examTimeFrameSeconds' />
            <FormFieldError errors={errors} field='root' />
          </label>
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
