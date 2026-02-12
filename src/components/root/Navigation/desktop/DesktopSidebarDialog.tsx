'use client'

import { motion } from 'framer-motion'
import { twMerge as tw } from 'tailwind-merge'
import { useSidebarStore } from '@/components/root/Navigation/SidebarStoreProvider'

export default function DesktopSidebarDialog({ children, visibilityBreakpoints }: { children: React.ReactNode; visibilityBreakpoints?: string }) {
  const { isOpen, isPinned, canDeviceHover, debounceClosure } = useSidebarStore((state) => state)

  return (
    <motion.div
      className={tw('flex min-h-full max-w-[300px] flex-shrink-0 bg-neutral-100 px-2 py-2 md:flex-col dark:bg-neutral-800', visibilityBreakpoints)}
      initial={{ width: !isPinned ? '60px' : '300px' }}
      animate={{
        width: !isPinned ? (isOpen ? '300px' : '60px') : '300px',
      }}
      onMouseEnter={() => (canDeviceHover ? debounceClosure(true) : null)}
      onMouseLeave={() => (canDeviceHover ? debounceClosure(false) : null)}>
      {children}
    </motion.div>
  )
}
