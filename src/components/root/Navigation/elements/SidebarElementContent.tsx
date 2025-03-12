'use client'

import { useSidebarStore } from '@/components/root/Navigation/SidebarStoreProvider'
import { motion } from 'motion/react'
import { twMerge } from 'tailwind-merge'

export default function SidebarElementContent({ children }: { children: React.ReactNode }) {
  const { isOpen, isAnimationEnabled } = useSidebarStore((state) => state)

  return (
    <motion.div
      initial={{
        display: isOpen ? 'inline-block' : 'none',
        opacity: isAnimationEnabled ? (isOpen ? 1 : 0.0) : 1,
      }}
      animate={{
        display: isOpen ? 'inline-block' : 'none',
        opacity: isAnimationEnabled ? (isOpen ? 1 : 0.0) : 1,
      }}
      className={twMerge('!m-0 inline-block overflow-hidden !p-0 text-sm whitespace-pre text-neutral-700 transition-transform duration-300 group-hover/sidebar:translate-x-1 dark:text-neutral-200')}>
      {children}
    </motion.div>
  )
}
