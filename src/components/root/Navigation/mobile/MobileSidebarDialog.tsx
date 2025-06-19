'use client'

import React, { Fragment, useEffect } from 'react'
import { Transition } from '@headlessui/react'
import { twMerge } from 'tailwind-merge'
import { useSidebarStore } from '@/components/root/Navigation/SidebarStoreProvider'
import { motion, useAnimate } from 'motion/react'
import Link, { LinkProps } from 'next/link'
import { useBreakpoints } from '@/src/hooks/Shared/useBreakpoints'

/**
 * Renders the dialog that slides in from the left and displays renders the provided children in it
 * @param children The content / children that are rendered in the dialog
 */
export default function MobileSideBarDialog({ children, visibilityBreakpoints }: { children: React.ReactNode; visibilityBreakpoints?: string }) {
  const { isOpen, toggleSidebar } = useSidebarStore((state) => state)
  const [scope, animate] = useAnimate()

  const EXIT_ANIMATION_TIME = 1.6

  const animateDialog = async () => {
    const { current } = scope
    if (!current) return

    if (isOpen) {
      animate(current, { x: '100%' }, { duration: 0.4 })
      await animate(current, { opacity: 1 }, { duration: 0.4 })

      return
    }

    animate(current, { x: '-80%' }, { duration: EXIT_ANIMATION_TIME })
    await animate(current, { opacity: 0 }, { duration: EXIT_ANIMATION_TIME * 0.35 })
  }

  useEffect(() => {
    animateDialog()
  }, [isOpen])

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
        className={twMerge('fixed inset-0 z-50 flex md:inset-full', visibilityBreakpoints)}
        initial={{ display: 'none' }}
        animate={{ display: isOpen ? 'flex' : 'none', transition: { delay: isOpen ? 0 : 0.3, delayChildren: 0 } }}>
        <motion.div className='relative flex w-full max-w-xs flex-10 sm:max-w-sm' initial={{ translateX: '-100%' }} ref={scope}>
          {children}
        </motion.div>
        <div className='flex-1' onClick={toggleSidebar} />
      </motion.div>
    </>
  )
}

/**
 * This component renders a simple next-Link component and passes along its properties to this element. It sets the onNavigate event-handler to close the Sidebar on smaller screens (mobile-devices).
 * @param props that are passes to the Link component
 */
export function CloseMobileSidebarLink({ ...props }: { children: React.ReactNode; className?: string } & Omit<LinkProps, 'onNavigate'>) {
  const { isSm, isCustom, ...breakPoints } = useBreakpoints()
  const { toggleSidebar } = useSidebarStore((state) => state)

  const closeOnNavigate = () => {
    //? Don't close sidebar for desktop screens
    if (Object.values(breakPoints).some((point) => !!point)) return

    toggleSidebar()
  }

  return <Link {...props} onNavigate={closeOnNavigate} />
}
