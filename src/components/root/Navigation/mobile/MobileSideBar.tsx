import MobileSideBarDialog from '@/components/root/Navigation/mobile/MobileSidebarDialog'
import { ArrowDownNarrowWide } from 'lucide-react'
import { MobileCloseButton, MobileMenubar } from '@/components/root/Navigation/mobile/MobileSidebarComponents'
import RenderSideBarItems from '@/components/root/Navigation/elements/RenderSideBarItems'
import AppVersion from '@/components/Shared/AppVersion'

export default function MobileSideBar({ children, visibilityBreakpoints }: { visibilityBreakpoints?: string; children?: React.ReactNode }) {
  return (
    <>
      <div className='flex h-screen flex-col md:hidden dark:bg-neutral-800'>
        <MobileMenubar />
        <div className='flex-1 bg-gray-100 dark:bg-neutral-900/60'>{children}</div>
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
            <AppVersion />
          </div>
        </div>
      </MobileSideBarDialog>
    </>
  )
}
