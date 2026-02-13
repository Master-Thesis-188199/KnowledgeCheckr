import { ArrowDownNarrowWide } from 'lucide-react'
import RenderSideBarItems from '@/components/root/Navigation/elements/RenderSideBarItems'
import SidebarUserBanner from '@/components/root/Navigation/elements/SidebarUserBanner'
import { MobileCloseButton, MobileMenubar } from '@/components/root/Navigation/mobile/MobileSidebarComponents'
import MobileSideBarDialog from '@/components/root/Navigation/mobile/MobileSidebarDialog'
import AppVersion from '@/components/Shared/AppVersion'
import SidebarContentPanel from '@/src/components/root/Navigation/SidebarContentPanel'

export default function MobileSideBar({ children, visibilityBreakpoints }: { visibilityBreakpoints?: string; children?: React.ReactNode }) {
  return (
    <>
      <div className='flex min-h-screen flex-col bg-transparent md:hidden dark:bg-neutral-800'>
        <MobileMenubar />
        <SidebarContentPanel className='flex-1 border-0 bg-gray-100 dark:bg-neutral-900/60'>{children} </SidebarContentPanel>
      </div>

      <MobileSideBarDialog visibilityBreakpoints={visibilityBreakpoints}>
        <div className='flex grow flex-col overflow-y-auto bg-white pb-2 dark:bg-neutral-800'>
          <div className='flex shrink-0 items-center justify-between border-solid border-gray-400 bg-neutral-200/70 px-2 py-4 pl-4 shadow-sm shadow-neutral-500 dark:border-gray-200 dark:bg-neutral-900 dark:shadow-neutral-400'>
            <ArrowDownNarrowWide className='size-6' />
            <span className='flex-1 pr-4 text-center text-lg/6 font-semibold text-gray-700 dark:text-gray-200'>Navigation</span>
            <MobileCloseButton />
          </div>

          <div className='h-full px-[14px] text-gray-600 dark:text-gray-300/90'>
            <RenderSideBarItems />
          </div>

          <div className='px-2'>
            <SidebarUserBanner />
            <AppVersion />
          </div>
        </div>
      </MobileSideBarDialog>
    </>
  )
}
