'use client'

import { Tab, useTabsContext } from '@/src/components/Shared/tabs/TabsProvider'
import { cn } from '@/src/lib/Shared/utils'

export function TabButton({ tab }: { tab: Tab }) {
  const { currentTab, setCurrentTab } = useTabsContext()
  const isActive = tab.name === currentTab

  return (
    <button
      type='button'
      onClick={() => setCurrentTab(tab.key)}
      key={tab.key}
      className={cn(
        isActive
          ? 'border-neutral-800 font-semibold text-neutral-600 dark:border-neutral-100 dark:text-neutral-200'
          : 'border-transparent text-neutral-400 hover:cursor-pointer hover:border-neutral-500 hover:text-neutral-500 dark:text-neutral-400/80 dark:hover:border-gray-300 dark:hover:text-neutral-300',
        'group inline-flex items-center border-b-2 px-1 py-4 text-sm font-medium',
      )}>
      <tab.icon
        className={cn(
          isActive ? 'stroke-2 text-neutral-600 dark:text-neutral-200' : 'text-neutral-400 group-hover:text-neutral-500 dark:text-neutral-500 dark:group-hover:text-neutral-400',
          'mr-2 -ml-0.5 size-5',
        )}
        aria-hidden='true'
      />

      <span>{tab.name}</span>
    </button>
  )
}
