'use client'

import { useSidebarStore } from '@/components/root/Navigation/SidebarStoreProvider'
import ThemeSwitcher from '@/components/root/ThemeSwitcher'
import { motion } from 'motion/react'
import { Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { twMerge as tw } from 'tailwind-merge'

export function MobileMenubar() {
  const {
    config: { title },
  } = useSidebarStore((state) => state)
  return (
    <div
      id='mobile-sidebar-menubar'
      className='sticky inset-x-0 top-0 z-50 flex w-full flex-row items-center justify-between bg-white px-4 py-3 text-neutral-600 shadow shadow-neutral-300 dark:bg-neutral-900 dark:text-neutral-200 dark:shadow-neutral-600'>
      <OpenButton />
      <span className='tracking-widest'>{title}</span>
      <ThemeSwitcher />
    </div>
  )
}

function OpenButton() {
  const { toggleSidebar } = useSidebarStore((state) => state)

  return (
    <button type='button' aria-label='open mobile sidebar' className='group inline-block transition-transform hover:cursor-pointer active:scale-105 active:stroke-2 md:hidden' onClick={toggleSidebar}>
      <motion.div animate={{ opacity: 1, scale: 1 }} initial={{ opacity: 0, scale: 0.6 }}>
        <Transition show={true} enter='transition duration-300' enterFrom='-rotate-20 opacity-50' enterTo='rotate-0 opacity-100' leave='hidden'>
          <Bars3Icon className={tw('size-6 group-hover:stroke-black group-hover:stroke-2 dark:group-hover:stroke-white')} />
        </Transition>
      </motion.div>
    </button>
  )
}

export function MobileCloseButton() {
  const { toggleSidebar } = useSidebarStore((state) => state)

  return (
    <button type='button' aria-label='close mobile sidebar' className='group inline-block transition-transform hover:cursor-pointer active:scale-110 active:stroke-3 md:hidden' onClick={toggleSidebar}>
      <motion.div animate={{ opacity: 1, scale: 1 }} initial={{ opacity: 0, scale: 0.6 }}>
        <Transition show={true} enter='transition duration-300' enterFrom='-rotate-20 opacity-50' enterTo='rotate-0 opacity-100' leave='hidden'>
          <XMarkIcon className={tw('size-6 group-hover:scale-105 group-hover:stroke-red-400 group-hover:stroke-2')} />
        </Transition>
      </motion.div>
    </button>
  )
}
