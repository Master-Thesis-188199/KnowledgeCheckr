'use client'

import { useSideBarContext } from '@/components/root/Navigation/SideBarProvider'
import { motion } from 'framer-motion'
import { twMerge as tw } from 'tailwind-merge'
import RenderSideBarItems, { RenderSideBarItem } from '@/components/root/Navigation/RenderSideBarItems'
import useDebounce from '@/hooks/Shared/useDebounce'
import { UserIcon } from '@heroicons/react/24/outline'

export const DesktopSidebar = ({ className, ...props }: React.ComponentProps<typeof motion.div>) => {
  const { isOpen, isAnimationEnabled, setOpen: _setOpen } = useSideBarContext()
  const CLOSE_DELAY = 500
  const { debounce: setOpen } = useDebounce(CLOSE_DELAY, _setOpen, (isOpen) => isOpen)

  return (
    <>
      <motion.div
        className={tw('h-full px-4 py-4 hidden md:flex md:flex-col bg-neutral-100 dark:bg-neutral-800 max-w-[300px] flex-shrink-0', className)}
        initial={{ width: '60px' }}
        animate={{
          width: isAnimationEnabled ? (isOpen ? '300px' : '60px') : '300px',
        }}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        {...props}>
        <RenderSideBarItems />
        {/*<div>*/}
        <RenderSideBarItem
          item={{
            label: 'Username',
            href: '#',
            icon: <UserIcon className='size-6 shrink-0 rounded-full' />,
          }}
        />
        {/*</div>*/}
      </motion.div>
    </>
  )
}
