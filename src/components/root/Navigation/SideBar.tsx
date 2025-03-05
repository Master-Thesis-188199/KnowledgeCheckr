import { DesktopSidebar } from '@/components/root/Navigation/DesktopSideBar'
import { ReactNode } from 'react'
import { SidebarStoreProvider, SidebarStoreProviderProps } from '@/components/root/Navigation/SidebarStoreProvider'
import MobileSideBar from '@/components/root/Navigation/MobileSideBar'

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
      <DesktopSidebar children={children} className='hidden md:flex' />
      <MobileSideBar children={children} visibilityBreakpoints='flex md:hidden md:static opacity-100 md:opacity-0' />
    </SidebarStoreProvider>
  )
}
