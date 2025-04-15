import RenderSideBarItems from '@/components/root/Navigation/elements/RenderSideBarItems'
import SidebarUserBanner from '@/components/root/Navigation/elements/SidebarUserBanner'
import { MobileCloseButton, MobileMenubar } from '@/components/root/Navigation/mobile/MobileSidebarComponents'
import MobileSideBarDialog from '@/components/root/Navigation/mobile/MobileSidebarDialog'
import AppVersion from '@/components/Shared/AppVersion'
import { ArrowDownNarrowWide } from 'lucide-react'

export default function MobileSideBar({ children, visibilityBreakpoints }: { visibilityBreakpoints?: string; children?: React.ReactNode }) {
  return (
    <>
      <div className='flex h-screen flex-col md:hidden dark:bg-neutral-800'>
        <MobileMenubar />
        <main className='flex-1 bg-gray-100 p-4 dark:bg-neutral-900/60'>{children}</main>
      </div>

      <MobileSideBarDialog visibilityBreakpoints={visibilityBreakpoints}>
        <div className='flex grow flex-col overflow-y-auto bg-white pb-2 dark:bg-neutral-800'>
          <div className='flex shrink-0 items-center justify-between border-solid border-gray-400 bg-neutral-200/70 px-2 py-4 pl-4 shadow shadow-neutral-300 dark:border-gray-200 dark:bg-neutral-900'>
            <ArrowDownNarrowWide className='size-6' />
            <span className='flex-1 pr-4 text-center text-lg leading-6 font-semibold text-gray-700 dark:text-gray-200'>Navigation</span>
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
