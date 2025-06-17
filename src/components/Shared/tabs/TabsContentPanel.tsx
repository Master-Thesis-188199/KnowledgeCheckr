import { Tab, useTabsContext } from '@/src/components/Shared/tabs/TabsProvider'
import { cn } from '@/src/lib/Shared/utils'

export function TabsContentPanel({ children, tab, className }: { children: React.ReactNode; tab: Tab['name']; className?: string }) {
  const { currentTab, tabs } = useTabsContext()

  if (!tabs.some((t) => t.name.toLowerCase().includes(tab.toLowerCase()))) {
    throw new Error(`Tab with name "${tab}" does not exist in the current TabsProvider context.`)
  }

  return (
    <div data-current={currentTab.toLowerCase().includes(tab.toLowerCase())} className={cn(className, 'data-[current=false]:hidden')}>
      {children}
    </div>
  )
}
