'use client'

import { Pin } from 'lucide-react'
import { motion } from 'motion/react'
import { twMerge as tw } from 'tailwind-merge'
import { useSidebarStore } from '@/components/root/Navigation/SidebarStoreProvider'

export function PinSidebarButton() {
  const { isOpen, isPinned, togglePinned, canDeviceHover } = useSidebarStore((state) => state)

  return (
    <motion.button
      aria-label='pin sidebar'
      initial={{ opacity: !isPinned ? 0 : 1 }}
      animate={{ opacity: !isPinned ? (isOpen ? 1 : 0) : 1, rotate: !isPinned ? 45 : 0 }}
      className={tw('absolute top-1.5 right-1.5 flex', !canDeviceHover && 'hidden')}
      onClick={togglePinned}>
      <Pin className={tw('size-5 stroke-1', isPinned && 'stroke-2')} />
    </motion.button>
  )
}
