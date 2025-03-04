'use client'

import { useSidebarStore } from '@/components/root/Navigation/SidebarStoreProvider'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { twMerge as tw } from 'tailwind-merge'
import { Transition } from '@headlessui/react'
import { motion } from 'motion/react'

export default function MobileSidebarToggleButton() {
  const { isOpen, toggleSidebar } = useSidebarStore((state) => state)
  const Icon = !isOpen ? Bars3Icon : XMarkIcon

  return (
    <button type='button' className='inline-block hover:cursor-pointer md:hidden' onClick={toggleSidebar}>
      <motion.div animate={{ opacity: 1, scale: 1 }} initial={{ opacity: 0, scale: 0.6 }}>
        <Transition show={isOpen} enter='transition duration-300' enterFrom='rotate-45 opacity-50' enterTo='rotate-0 opacity-100' leave='hidden'>
          <Icon className={tw('size-6', !isOpen && 'hidden')} />
        </Transition>

        <Transition show={!isOpen} enter='transition duration-300' enterFrom='-rotate-20 opacity-50' enterTo='rotate-0 opacity-100' leave='hidden'>
          <Icon className={tw('size-6', isOpen && 'hidden')} />
        </Transition>
      </motion.div>
    </button>
  )
}
