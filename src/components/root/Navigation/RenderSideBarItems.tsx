'use client'

import { motion } from 'motion/react'
import Link, { LinkProps } from 'next/link'
import { SideBarProps } from '@/components/root/Navigation/SideBar'
import { twMerge as tw } from 'tailwind-merge'
import { useSidebarStore } from '@/components/root/Navigation/SidebarStoreProvider'
import { Pin } from 'lucide-react'

export default function RenderSideBarItems() {
  const {
    config: { elements, title, icon },
  } = useSidebarStore((state) => state)

  return (
    <div className='relative flex flex-1 flex-col overflow-x-hidden overflow-y-auto'>
      {/* todo externalize header from <RenderSideBarItem> */}
      <PinSidebarButton />

      <div className='mt-8 flex flex-col gap-2'>
        {elements.map((item, idx) => (
          <RenderSideBarItem key={idx} item={item} />
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

export function RenderSideBarItem({ item, className, ...props }: { item: SideBarProps['elements'][number]; className?: string; props?: LinkProps }) {
  const { isAnimationEnabled, isOpen } = useSidebarStore((state) => state)

  return (
    <Link href={item.href || '#'} className={tw('group/sidebar flex items-center justify-start gap-3 py-2', className)} {...props}>
      {item.icon}

      <motion.span
        animate={{
          display: isAnimationEnabled ? (isOpen ? 'inline-block' : 'none') : 'inline-block',
          opacity: isAnimationEnabled ? (isOpen ? 1 : 0.0) : 1,
        }}
        className='!m-0 inline-block overflow-hidden !p-0 text-sm whitespace-pre text-neutral-700 transition-transform duration-300 group-hover/sidebar:translate-x-1 dark:text-neutral-200'>
        {item.label}
      </motion.span>
    </Link>
  )
}
