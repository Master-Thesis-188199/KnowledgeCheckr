import { DesktopSidebar } from '@/components/root/Navigation/DesktopSideBar'
import MobileSideBar from '@/components/root/Navigation/MobileSideBar'
import { ReactNode } from 'react'
import { SidebarStoreProvider, SidebarStoreProviderProps } from '@/components/root/Navigation/SidebarStoreProvider'
import SidebarHoverabilityDetection from '@/components/root/Navigation/SidebarHoverabilityDetection'

export interface SideBarProps {
  title: string
  icon?: ReactNode
  elements: Array<{
    label: string
    icon: ReactNode
    href?: string
  }>
}

export default async function SideBar({ children, initialStoreProps }: { initialStoreProps?: SidebarStoreProviderProps['initialStoreProps']; children: ReactNode }) {
  return (
    <SidebarStoreProvider initialStoreProps={initialStoreProps}>
      <div className='mx-auto flex h-[94vh] w-full flex-1 flex-col overflow-hidden border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800'>
        <DesktopSidebar />
        <MobileSideBar />

        <ContentPanel children={children} />
        <SidebarHoverabilityDetection />
      </div>
    </SidebarStoreProvider>
  )
}

function ContentPanel({ children }: { children?: React.ReactNode }) {
  return (
    <div className='flex flex-1'>
      <div className='flex h-full w-full flex-1 flex-col gap-2 overflow-auto rounded-tl-2xl rounded-bl-2xl border border-neutral-200 bg-gray-100 p-2 md:p-4 dark:border-neutral-700 dark:bg-neutral-900/60'>
        {children}
      </div>
    </div>
  )
}
