import { DesktopSidebar } from '@/components/root/Navigation/desktop/DesktopSideBar'
import MobileSideBar from '@/components/root/Navigation/mobile/MobileSideBar'
import { SidebarStoreProvider, SidebarStoreProviderProps } from '@/components/root/Navigation/SidebarStoreProvider'
import { ActiveDelimiter } from '@/src/components/root/Navigation/ActiveDelimiter'
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
        <MobileSideBar children={children} />
      </ConditionalBreakpointRendering>

      <ConditionalBreakpointRendering showBreakPoint='768px' logIdentifier='desktop-sidebar'>
        <DesktopSidebar className='flex' children={children} />
      </ConditionalBreakpointRendering>

      <ActiveDelimiter />
    </SidebarStoreProvider>
  )
}
