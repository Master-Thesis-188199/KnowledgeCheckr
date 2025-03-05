'use client'
import { twMerge as tw } from 'tailwind-merge'
import { useSidebarStore } from '@/components/root/Navigation/SidebarStoreProvider'
import ThemeSwitcher from '@/components/root/ThemeSwitcher'
import MobileSideBarDialog from '@/components/root/Navigation/mobile/MobileSidebarDialog'
import RenderSideBarItems from '@/components/root/Navigation/RenderSideBarItems'
import { ArrowDownNarrowWide } from 'lucide-react'
import { motion } from 'motion/react'
import { Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

export default function MobileSideBar({ children, visibilityBreakpoints }: { visibilityBreakpoints?: string; children?: React.ReactNode }) {
  return (
    <>
      <div className='flex h-screen flex-col md:hidden dark:bg-neutral-800'>
        <Menubar />
        <div className='flex-1 bg-gray-100 dark:bg-neutral-900/60'>{children}</div>
      </div>

      <MobileSideBarDialog visibilityBreakpoints={visibilityBreakpoints}>
        <div className='flex grow flex-col gap-y-5 overflow-y-auto bg-white pb-2 dark:bg-neutral-800'>
          <div className='flex shrink-0 items-center justify-between border-solid border-gray-400 bg-neutral-200/70 px-2 py-4 pl-4 shadow shadow-neutral-300 dark:border-gray-200 dark:bg-neutral-900'>
            <ArrowDownNarrowWide className='size-6' />
            <span className='flex-1 pr-4 text-center text-lg leading-6 font-semibold text-gray-700 dark:text-gray-200'>Navigation</span>
            <CloseButton />
          </div>

          <div className='h-full px-[14px] text-gray-600 dark:text-gray-300/90'>
            <RenderSideBarItems />
          </div>
        </div>
      </MobileSideBarDialog>
    </>
  )
}

export function Menubar() {
  const {
    config: { title },
  } = useSidebarStore((state) => state)
  return (
    <div
      id='mobile-sidebar-menubar'
      className='flex w-full flex-row items-center justify-between bg-white px-4 py-3 text-neutral-600 shadow shadow-neutral-300 dark:bg-neutral-900 dark:text-neutral-200 dark:shadow-neutral-600'>
      <OpenButton />
      <span className='text-xl font-semibold'>{title}</span>
      <ThemeSwitcher />
    </div>
  )
}

export function OpenButton() {
  const { toggleSidebar } = useSidebarStore((state) => state)

  return (
    <button type='button' className='group inline-block transition-transform hover:cursor-pointer active:scale-105 active:stroke-2 md:hidden' onClick={toggleSidebar}>
      <motion.div animate={{ opacity: 1, scale: 1 }} initial={{ opacity: 0, scale: 0.6 }}>
        <Transition show={true} enter='transition duration-300' enterFrom='-rotate-20 opacity-50' enterTo='rotate-0 opacity-100' leave='hidden'>
          <Bars3Icon className={tw('size-6 group-hover:stroke-black group-hover:stroke-2 dark:group-hover:stroke-white')} />
        </Transition>
      </motion.div>
    </button>
  )
}

export function CloseButton() {
  const { toggleSidebar } = useSidebarStore((state) => state)

  return (
    <button type='button' className='group inline-block transition-transform hover:cursor-pointer active:scale-110 active:stroke-3 md:hidden' onClick={toggleSidebar}>
      <motion.div animate={{ opacity: 1, scale: 1 }} initial={{ opacity: 0, scale: 0.6 }}>
        <Transition show={true} enter='transition duration-300' enterFrom='-rotate-20 opacity-50' enterTo='rotate-0 opacity-100' leave='hidden'>
          <XMarkIcon className={tw('size-6 group-hover:scale-105 group-hover:stroke-red-400 group-hover:stroke-2')} />
        </Transition>
      </motion.div>
    </button>
  )
}
