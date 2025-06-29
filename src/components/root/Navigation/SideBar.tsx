import { DesktopSidebar } from '@/components/root/Navigation/desktop/DesktopSideBar'
import MobileSideBar from '@/components/root/Navigation/mobile/MobileSideBar'
import { SidebarStoreProvider, SidebarStoreProviderProps } from '@/components/root/Navigation/SidebarStoreProvider'
import ConditionalBreakpointRendering from '@/src/components/Shared/ConditionalBreakpointRendering'
import { ReactNode } from 'react'

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
      <ConditionalBreakpointRendering hideBreakPoint='768px' logIdentifier='mobile-sidebar'>
        <MobileSideBar children={children} visibilityBreakpoints='flex md:hidden opacity-100 md:opacity-0' />
      </ConditionalBreakpointRendering>

      <ConditionalBreakpointRendering showBreakPoint='768px' logIdentifier='desktop-sidebar'>
        <DesktopSidebar className='hidden md:flex' children={children} />
      </ConditionalBreakpointRendering>
    </SidebarStoreProvider>
  )
}
