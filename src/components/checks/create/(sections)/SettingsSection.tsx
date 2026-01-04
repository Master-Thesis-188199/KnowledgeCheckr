'use client'

import { UsersIcon } from '@heroicons/react/24/outline'
import { format } from 'date-fns'
import { EyeIcon, GraduationCapIcon, PlayIcon } from 'lucide-react'
import { useWatch } from 'react-hook-form'
import { InputGroup } from '@/src/components/checks/create/(sections)/GeneralSection'
import { useCheckStore } from '@/src/components/checks/create/CreateCheckProvider'
import { Form } from '@/src/components/shadcn/form'
import Card from '@/src/components/Shared/Card'
import Field from '@/src/components/Shared/form/Field'
import { TabButton } from '@/src/components/Shared/tabs/TabButton'
import { TabsContentPanel } from '@/src/components/Shared/tabs/TabsContentPanel'
import { TabSelect } from '@/src/components/Shared/tabs/TabSelect'
import TabsProvider, { useTabsContext } from '@/src/components/Shared/tabs/TabsProvider'
import useRHF from '@/src/hooks/Shared/form/useRHF'
import { cn } from '@/src/lib/Shared/utils'
import { KnowledgeCheckSettingsSchema } from '@/src/schemas/KnowledgeCheckSettingsSchema'

const tabs = [
  { name: 'General', icon: EyeIcon },
  { name: 'Practice', icon: PlayIcon },
  { name: 'Examination', icon: GraduationCapIcon },
  { name: 'Sharing', icon: UsersIcon },
]
export default function SettingsSection() {
  const { updateSettings, settings } = useCheckStore((state) => state)

  const { form, baseFieldProps } = useRHF(KnowledgeCheckSettingsSchema, {
    mode: 'all',
    delayError: 100,
    defaultValues: settings,
  })

  const {
    control,
    getValues,
    formState: { errors },
  } = form

  const { examTimeFrameSeconds } = useWatch({ control })

  return (
    <Form {...form}>
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
            <div className='grid grid-cols-[auto_1fr] gap-4 gap-x-7'>
              <Field
                {...baseFieldProps}
                name='questionOrder'
                label='Randomize Question Order'
                labelClassname='mt-0.5'
                className='place-self-start'
                type='checkbox'
                onChange={({ checked }) => (checked ? 'random' : 'create-order')}
              />
              <Field
                {...baseFieldProps}
                name='answerOrder'
                label='Randomize Answer Order'
                labelClassname='mt-0.5'
                className='place-self-start'
                type='checkbox'
                onChange={({ checked }) => (checked ? 'random' : 'create-order')}
              />
            </div>
          </TabsContentPanel>
          <TabsContentPanel tab='practice'>
            <TemporarySettingsOptions />
          </TabsContentPanel>
          <TabsContentPanel tab='examination'>
            <div
              className={cn(
                'grid grid-cols-1 items-baseline justify-baseline gap-3 *:last:mb-4 *:odd:mt-3 *:odd:first:mt-0',
                '@md:grid-cols-[auto_1fr] @md:gap-7 @md:gap-x-7 @md:*:last:mb-0 @md:*:odd:mt-0',
              )}>
              <Field
                {...baseFieldProps}
                onChange={({ value }) =>
                  value
                    .split(':')
                    .map((el, i) => parseInt(el) * (i === 0 ? 3600 : 60))
                    .reduce((a, b) => a + b, 0)
                }
                modifyValue={(value: number) => format(new Date(value * 1000 - 3600 * 1000), 'HH:mm')}
                type='time'
                name='examTimeFrameSeconds'
                label='Examination Time Frame'
                list='time-values'>
                <span className='pt-1 pl-3 text-sm tracking-wider text-neutral-500/80 dark:text-neutral-400'>{humanReadableDuration(examTimeFrameSeconds, !!errors.examTimeFrameSeconds)}</span>
              </Field>

              <datalist id='time-values'>
                <option value='00:30' label='30 minutes'></option>
                <option value='00:45' label='45 minutes'></option>
                <option value='01:00' label='60 minutes'></option>
                <option value='01:30' label='90 minutes'></option>
              </datalist>
            </div>
          </TabsContentPanel>
          <TabsContentPanel tab='sharing'>
            <TemporarySettingsOptions />
          </TabsContentPanel>
        </TabsProvider>
      </Card>
    </Form>
  )
}

/**
 * Produces a human readable time format based on the provided seconds, e.g. 1 minute, 1 hour and 2 minutes, ...
 * @param seconds The seconds to transform into a human readable string
 * @param isErrorneous When set to true the function will return null
 * @returns A human readable string or nothing when `isErrorneous` is set to true or `seconds` is undefined.
 */
function humanReadableDuration(seconds?: number, isErrorneous?: boolean) {
  if (isErrorneous || seconds === undefined) return null

  return format(new Date(seconds * 1000 - 3600 * 1000), 'H:m')
    .split(':')
    .filter(Boolean)
    .map((el, i, segments) => {
      const val = parseInt(el)
      if (segments.length === 1) return `${el} minute${val > 1 ? 's' : ''}`

      if (el === '0') return ''
      const suffix = i === 0 ? 'hour' : 'minute'
      return `${el} ${suffix}${val > 1 ? 's' : ''}`
    })
    .filter(Boolean)
    .join(' and ')
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
