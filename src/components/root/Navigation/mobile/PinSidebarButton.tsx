'use client'

import { Pin } from 'lucide-react'
import { motion } from 'motion/react'
import { twMerge as tw } from 'tailwind-merge'
import { useSidebarStore } from '@/components/root/Navigation/SidebarStoreProvider'

export function PinSidebarButton() {
  const { isOpen, isAnimationEnabled, toggleAnimation, canDeviceHover } = useSidebarStore((state) => state)

  return (
    <motion.div
      initial={{ opacity: isAnimationEnabled ? 0 : 1 }}
      animate={{ opacity: isAnimationEnabled ? (isOpen ? 1 : 0) : 1, rotate: isAnimationEnabled ? 45 : 0 }}
      className={tw('absolute top-1.5 right-1.5 hidden md:flex', !canDeviceHover && 'hidden')}
      onClick={toggleAnimation}>
      <Pin className={tw('size-5 stroke-1', !isAnimationEnabled && 'stroke-2')} />
    </motion.div>
  )
}
