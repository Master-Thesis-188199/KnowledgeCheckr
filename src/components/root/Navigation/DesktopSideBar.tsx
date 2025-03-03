'use client'

import { motion } from 'framer-motion'
import { twMerge as tw } from 'tailwind-merge'
import { useSidebarStore } from '@/components/root/Navigation/SidebarStoreProvider'
import RenderSideBarItems, { RenderSideBarItem } from '@/components/root/Navigation/RenderSideBarItems'
import { UserIcon } from '@heroicons/react/24/outline'

export const DesktopSidebar = ({ className, ...props }: React.ComponentProps<typeof motion.div>) => {
  const { isOpen, isAnimationEnabled, debounceClosure } = useSidebarStore((state) => state)

  return (
    <>
      <motion.div
        className={tw('h-full px-4 py-4 hidden md:flex md:flex-col bg-neutral-100 dark:bg-neutral-800 max-w-[300px] flex-shrink-0', className)}
        initial={{ width: '60px' }}
        animate={{
          width: isAnimationEnabled ? (isOpen ? '300px' : '60px') : '300px',
        }}
        onMouseEnter={() => debounceClosure(true)}
        onMouseLeave={() => debounceClosure(false)}
        {...props}>
        <RenderSideBarItems />

        <RenderSideBarItem
          item={{
            label: 'Username',
            href: '#',
            icon: <UserIcon className='size-6 shrink-0 rounded-full' />,
          }}
        />
      </motion.div>
    </>
  )
}
