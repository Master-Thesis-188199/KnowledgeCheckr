'use client'

import React, { Fragment } from 'react'
import { Transition } from '@headlessui/react'
import { twMerge } from 'tailwind-merge'
import { useSidebarStore } from '@/components/root/Navigation/SidebarStoreProvider'
import { motion } from 'motion/react'

/**
 * Renders the dialog that slides in from the left and displays renders the provided children in it
 * @param children The content / children that are rendered in the dialog
 */
export default function MobileSideBarDialog({ children, visibilityBreakpoints }: { children: React.ReactNode; visibilityBreakpoints?: string }) {
  const { isOpen, toggleSidebar } = useSidebarStore((state) => state)

  return (
    <>
      <Transition.Root show={isOpen} as={Fragment}>
        <div className={twMerge('relative z-50', visibilityBreakpoints)}>
          <Transition.Child
            as={Fragment}
            enter='transition-opacity ease-linear duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='transition-opacity ease-linear duration-300'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'>
            <div className='fixed inset-0 bg-neutral-900/80' onClick={toggleSidebar} />
          </Transition.Child>
        </div>
      </Transition.Root>

      <motion.div
        className={twMerge('fixed inset-0 z-50 flex', visibilityBreakpoints)}
        initial={{ display: 'none' }}
        animate={{ display: isOpen ? 'flex' : 'none', transition: { delay: 0, delayChildren: 0 } }}>
        <motion.div
          className='relative flex w-full max-w-xs flex-10 sm:max-w-sm'
          initial={{ translateX: '-100%' }}
          animate={{
            transition: {
              type: 'spring',
              bounce: 0,
              translate: {
                duration: 1.5,
              },
              opacity: {}, // sets some value for the opacity animation -> if removed that the animation is not as smooth.
            },
            translateX: isOpen ? '0%' : '-100%',
            opacity: isOpen ? 1 : 0,
          }}>
          {children}
        </motion.div>
        <div className='flex-1' onClick={toggleSidebar} />
      </motion.div>
    </>
  )
}
