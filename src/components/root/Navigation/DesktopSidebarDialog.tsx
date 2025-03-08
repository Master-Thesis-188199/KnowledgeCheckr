'use client'

import { useSidebarStore } from '@/components/root/Navigation/SidebarStoreProvider'
import { motion } from 'framer-motion'
import { twMerge as tw } from 'tailwind-merge'

export default function DesktopSidebarDialog({ children, visibilityBreakpoints }: { children: React.ReactNode; visibilityBreakpoints?: string }) {
  const { isOpen, isAnimationEnabled, debounceClosure } = useSidebarStore((state) => state)

  return (
    <motion.div
      className={tw('flex h-full max-w-[300px] flex-shrink-0 bg-neutral-100 px-2 py-2 md:flex-col dark:bg-neutral-800', visibilityBreakpoints)}
      initial={{ width: isAnimationEnabled ? '60px' : '300px' }}
      animate={{
        width: isAnimationEnabled ? (isOpen ? '300px' : '60px') : '300px',
      }}
      onMouseEnter={() => debounceClosure(true)}
      onMouseLeave={() => debounceClosure(false)}>
      {children}
    </motion.div>
  )
}
