'use client'

import { motion } from 'motion/react'
import { twMerge as tw } from 'tailwind-merge'
import { useSidebarStore } from '@/components/root/Navigation/SidebarStoreProvider'
import { Pin } from 'lucide-react'
import SidebarElement from '@/components/root/Navigation/elements/SidebarElement'

export default function RenderSideBarItems() {
  const {
    config: { elements, title, icon },
  } = useSidebarStore((state) => state)

  return (
    <div className='relative flex flex-1 flex-col overflow-y-auto'>
      {/* todo externalize header from <RenderSideBarItem> */}
      <PinSidebarButton />

      <div className='mt-8 flex flex-col gap-2 md:gap-3'>
        {elements.map((item, idx) => (
          <SidebarElement key={idx} icon={item.icon} href={item.href || '#'} children={item.label} />
        ))}
      </div>
    </div>
  )
}

function PinSidebarButton() {
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
