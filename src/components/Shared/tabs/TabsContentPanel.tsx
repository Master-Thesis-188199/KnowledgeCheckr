import { Tab, useTabsContext } from '@/src/components/Shared/tabs/TabsProvider'
import { cn } from '@/src/lib/Shared/utils'

export function TabsContentPanel({ children, tabKey, className }: { children: React.ReactNode; tabKey: Tab['key']; className?: string }) {
  const { currentTab, tabs } = useTabsContext()

  if (!tabs.some((t) => t.key.toLowerCase().includes(tabKey.toLowerCase()))) {
    throw new Error(`Tab with key "${tabKey}" does not exist in the current TabsProvider context.`)
  }

  return (
    <div data-current={currentTab.toLowerCase().includes(tabKey.toLowerCase())} className={cn(className, 'data-[current=false]:hidden')}>
      {children}
    </div>
  )
}
