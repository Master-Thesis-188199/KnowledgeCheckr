'use client'
import { twMerge as tw } from 'tailwind-merge'
import { useSidebarStore } from '@/components/root/Navigation/SidebarStoreProvider'
import ThemeSwitcher from '@/components/root/ThemeSwitcher'
import MobileSidebarToggleButton from '@/components/root/Navigation/mobile/MobilebarToggleButton'
import MobileSideBarDialog from '@/components/root/Navigation/mobile/MobileSidebarDialog'
import RenderSideBarItems from '@/components/root/Navigation/RenderSideBarItems'
import { ArrowDownNarrowWide } from 'lucide-react'

export default function MobileSideBar({ visibilityBreakpoints }: { visibilityBreakpoints?: string }) {
  const {
    config: { title },
  } = useSidebarStore((state) => state)

  return (
    <>
      <div id='mobile-sidebar-menubar' className={tw('w-full flex-row items-center justify-between bg-neutral-200/70 px-4 py-3 shadow shadow-neutral-300 dark:bg-neutral-800', visibilityBreakpoints)}>
        <MobileSidebarToggleButton />
        <span className='text-xl font-semibold'>{title}</span>
        <ThemeSwitcher />
      </div>
      <MobileSideBarDialog visibilityBreakpoints={visibilityBreakpoints}>
        <div className='flex grow flex-col gap-y-5 overflow-y-auto bg-white pb-2 dark:bg-neutral-800'>
          <div className='flex shrink-0 items-center justify-between border-solid border-gray-400 bg-neutral-200/70 px-2 py-4 pl-4 shadow shadow-neutral-300 dark:border-gray-200 dark:bg-neutral-900'>
            <ArrowDownNarrowWide className='size-6' />
            <span className='flex-1 pr-4 text-center text-lg leading-6 font-semibold text-gray-700 dark:text-gray-200'>Navigation</span>
            <MobileSidebarToggleButton />
          </div>

          <div className='h-full px-[14px] text-gray-600 dark:text-gray-300/90'>
            <RenderSideBarItems />
          </div>
        </div>
      </MobileSideBarDialog>
    </>
  )
}
