'use client'

import { useTabsContext } from '@/src/components/Shared/tabs/TabsProvider'
import { HTMLProps } from 'react'

export function TabSelect({ ...props }: HTMLProps<HTMLSelectElement>) {
  const { tabs, setCurrentTab, currentTab } = useTabsContext()

  //todo generade unique id -> generate uuid in provider
  return (
    <select
      id='tabs'
      name='tabs'
      className='flex w-full rounded-md p-2 ring-1 ring-neutral-400 ring-offset-3 ring-offset-neutral-100 outline-none focus:ring-neutral-600 dark:ring-neutral-500 dark:ring-offset-neutral-800 dark:focus:ring-neutral-400'
      onChange={(e) => {
        console.log(`selected tab: ${e.currentTarget.value}`)
        return setCurrentTab(tabs.find((tab) => tab.name === e.currentTarget.value)?.name ?? tabs[0].name)
      }}
      defaultValue={tabs.find((tab) => currentTab === tab.name)?.name}
      {...props}>
      {tabs.map((tab) => (
        <option key={tab.name}>{tab.name}</option>
      ))}
    </select>
  )
}
