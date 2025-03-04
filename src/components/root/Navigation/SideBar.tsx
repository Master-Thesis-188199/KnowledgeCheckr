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

export default async function SideBar({ children, initialStoreProps }: { initialStoreProps?: SidebarStoreProviderProps['initialStoreProps']; children: ReactNode }) {
  return (
    <SidebarStoreProvider initialStoreProps={initialStoreProps}>
      <DesktopSidebar children={children} />

      <MobileSideBar />
    </SidebarStoreProvider>
  )
}
