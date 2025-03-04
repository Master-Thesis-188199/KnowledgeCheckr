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
        className={tw('hidden h-full max-w-[300px] flex-shrink-0 bg-neutral-100 px-4 py-4 md:flex md:flex-col dark:bg-neutral-800', className)}
        initial={{ width: isAnimationEnabled ? '60px' : '300px' }}
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
