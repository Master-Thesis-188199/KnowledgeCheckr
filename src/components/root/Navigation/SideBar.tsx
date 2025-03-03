import { DesktopSidebar } from '@/components/root/Navigation/DesktopSideBar'
import MobileSideBar from '@/components/root/Navigation/MobileSideBar'
import { ReactNode } from 'react'
import { SidebarStoreProvider, SidebarStoreProviderProps } from '@/components/root/Navigation/SidebarStoreProvider'

export interface SideBarProps {
  title: string
  icon?: ReactNode
  elements: Array<{
    label: string
    icon: ReactNode
    href?: string
  }>
}

export default async function SideBar({ children, initialStoreProps }: { initialStoreProps: SidebarStoreProviderProps['initialStoreProps']; children: ReactNode }) {
  return (
    <SidebarStoreProvider initialStoreProps={initialStoreProps}>
      <div className='rounded-md flex flex-col md:flex-row pt-1.5 pr-1.5 pb-1.5 bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden h-[94vh]'>
        <DesktopSidebar />
        <MobileSideBar />

        <ContentPanel children={children} />
      </div>
    </SidebarStoreProvider>
  )
}

function ContentPanel({ children }: { children?: React.ReactNode }) {
  return (
    <div className='flex flex-1 '>
      <div className='overflow-auto p-2 md:p-4 rounded-tl-2xl rounded-t-2xl rounded-bl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full'>
        {children}
      </div>
    </div>
  )
}
