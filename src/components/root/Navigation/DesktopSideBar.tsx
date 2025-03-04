'use client'

import { motion } from 'framer-motion'
import { twMerge as tw } from 'tailwind-merge'
import { useSidebarStore } from '@/components/root/Navigation/SidebarStoreProvider'
import RenderSideBarItems, { RenderSideBarItem } from '@/components/root/Navigation/RenderSideBarItems'
import { UserIcon } from '@heroicons/react/24/outline'
import SidebarHoverabilityDetection from '@/components/root/Navigation/SidebarHoverabilityDetection'
import ThemeSwitcher from '@/components/root/ThemeSwitcher'

export const DesktopSidebar = ({ className, children }: { children: React.ReactNode; className?: string }) => {
  const { isOpen, isAnimationEnabled, debounceClosure } = useSidebarStore((state) => state)

  return (
    <div className={tw('h-screen flex-col', className)}>
      <MenuBar />

      <div id='desktop-sidebar-container' className='mx-auto flex w-full flex-1 flex-col overflow-hidden border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800'>
        <motion.div
          className={tw('flex h-full max-w-[300px] flex-shrink-0 bg-neutral-100 px-4 py-4 md:flex-col dark:bg-neutral-800', className)}
          initial={{ width: isAnimationEnabled ? '60px' : '300px' }}
          animate={{
            width: isAnimationEnabled ? (isOpen ? '300px' : '60px') : '300px',
          }}
          onMouseEnter={() => debounceClosure(true)}
          onMouseLeave={() => debounceClosure(false)}>
          <RenderSideBarItems />

          <RenderSideBarItem
            item={{
              label: 'Username',
              href: '#',
              icon: <UserIcon className='size-6 shrink-0 rounded-full' />,
            }}
          />
        </motion.div>

        <ContentPanel children={children} />
        <SidebarHoverabilityDetection />
      </div>
    </div>
  )
}

function ContentPanel({ children }: { children?: React.ReactNode }) {
  return (
    <div className='flex flex-1'>
      <div className='flex h-full w-full flex-1 flex-col gap-2 overflow-auto rounded-tl-2xl rounded-bl-2xl border border-neutral-200 bg-gray-100 p-2 md:p-4 dark:border-neutral-700 dark:bg-neutral-900/60'>
        {children}
      </div>
    </div>
  )
}

function MenuBar() {
  return (
    <div className='flex items-center justify-between bg-white px-4 py-3 text-neutral-600 dark:bg-neutral-900 dark:text-neutral-200 dark:shadow-neutral-600'>
      <span className='text-xl font-semibold'>KnowledgeCheckr</span>
      <div className='flex items-center gap-2'>
        <ThemeSwitcher />
      </div>
    </div>
  )
}
