'use client'

import { Transition } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { motion } from 'motion/react'
import { twMerge as tw } from 'tailwind-merge'
import { useSidebarStore } from '@/components/root/Navigation/SidebarStoreProvider'
import ThemeSwitcher from '@/components/root/ThemeSwitcher'
import LanguageSwitcher from '@/src/components/i18n/LanguageSwitcher'
import { sideBarConfiguration } from '@/src/components/root/Navigation/SideBarConfiguration'

export function MobileMenubar() {
  return (
    <div
      id='mobile-sidebar-menubar'
      className='sticky inset-x-0 top-0 z-50 flex w-full flex-row items-center justify-between bg-white px-4 py-3 text-neutral-600 shadow shadow-neutral-300 dark:bg-neutral-900 dark:text-neutral-200 dark:shadow-neutral-600'>
      <OpenButton />
      <span className='tracking-widest'>{sideBarConfiguration.title}</span>
      <div className='flex items-center gap-4'>
        <ThemeSwitcher />
        <LanguageSwitcher />
      </div>
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
