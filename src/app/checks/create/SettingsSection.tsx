'use client'

import { InputGroup } from '@/src/app/checks/create/GeneralSection'
import { useCreateCheckStore } from '@/src/components/check/create/CreateCheckProvider'
import Card from '@/src/components/Shared/Card'
import { TabsContentPanel } from '@/src/components/Shared/tabs/TabsContentPanel'
import TabsProvider, { useTabsContext } from '@/src/components/Shared/tabs/TabsProvider'
import { cn } from '@/src/lib/Shared/utils'
import { UsersIcon } from '@heroicons/react/24/outline'
import { EyeIcon, GraduationCapIcon, PlayIcon } from 'lucide-react'
import { useState } from 'react'

const tabs = [
  { name: 'General', icon: EyeIcon },
  { name: 'Practice', icon: PlayIcon },
  { name: 'Examination', icon: GraduationCapIcon },
  { name: 'Sharing', icon: UsersIcon },
]
export default function SettingsSection() {
  const {} = useCreateCheckStore((state) => state)
  const [currentTab, setTab] = useState(tabs[0])

  return (
    <Card className='@container flex break-inside-avoid-column flex-col gap-8 p-3' disableHoverStyles>
      <div className='header -m-3 flex flex-col rounded-t-md border-b border-neutral-400 bg-neutral-300 p-2 px-3 text-neutral-600 dark:border-neutral-500 dark:bg-neutral-700/60 dark:text-neutral-300'>
        <div className='flex items-center justify-between'>
          <h2 className=''>Settings</h2>
        </div>
      </div>
      <TabsProvider tabs={tabs} currentTab={currentTab}>
        <div className=''>
          <div className='mx-2 sm:hidden'>
            <label htmlFor='tabs' className='sr-only'>
              Select a tab
            </label>

            <select
              id='tabs'
              name='tabs'
              className='flex w-full rounded-md p-2 ring-1 ring-neutral-400 ring-offset-3 ring-offset-neutral-100 outline-none focus:ring-neutral-600 dark:ring-neutral-500 dark:ring-offset-neutral-800 dark:focus:ring-neutral-400'
              onChange={(e) => {
                console.log(`selected tab: ${e.currentTarget.value}`)
                return setTab(tabs.find((tab) => tab.name === e.currentTarget.value) || tabs[0])
              }}
              defaultValue={tabs.find((tab) => currentTab === tab)?.name}>
              {tabs.map((tab) => (
                <option key={tab.name}>{tab.name}</option>
              ))}
            </select>
          </div>

          <div className='-mt-2 hidden sm:block'>
            <div className='border-b border-neutral-400'>
              <nav className='-mb-px flex justify-between px-4' aria-label='Tabs'>
                {tabs.map((tab) => (
                  <button
                    type='button'
                    onClick={() => setTab(tab)}
                    key={tab.name}
                    className={cn(
                      tab === currentTab
                        ? 'border-neutral-800 font-semibold text-neutral-600 dark:border-neutral-100 dark:text-neutral-200'
                        : 'border-transparent text-neutral-400 hover:cursor-pointer hover:border-neutral-500 hover:text-neutral-500 dark:text-neutral-400/80 dark:hover:border-gray-300 dark:hover:text-neutral-300',

                      'group inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium',
                    )}>
                    <tab.icon
                      className={cn(
                        tab === currentTab
                          ? 'stroke-2 text-neutral-600 dark:text-neutral-200'
                          : 'text-neutral-400 group-hover:text-neutral-500 dark:text-neutral-500 dark:group-hover:text-neutral-400',

                        'mr-2 -ml-0.5 h-5 w-5',
                      )}
                      aria-hidden='true'
                    />

                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>
        </div>

        <TabsContentPanel tab='general'>
          <TemporarySettingsOptions />
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
