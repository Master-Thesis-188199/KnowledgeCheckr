'use client'

import { ReactNode } from 'react'
import { motion } from 'motion/react'
import Link, { LinkProps } from 'next/link'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/solid'
import { SideBarProps } from '@/components/root/Navigation/SideBar'
import { twMerge as tw } from 'tailwind-merge'
import { useSidebarStore } from '@/components/root/Navigation/SidebarStoreProvider'
import { Pin } from 'lucide-react'

export default function RenderSideBarItems() {
  const {
    config: { elements, title, icon },
  } = useSidebarStore((state) => state)

  return (
    <div className='flex flex-1 flex-col overflow-x-hidden overflow-y-auto'>
      {/* todo externalize header from <RenderSideBarItem> */}
      <SideBarHeader title={title} icon={icon} />

      <div className='mt-8 flex flex-col gap-2'>
        {elements.map((item, idx) => (
          <RenderSideBarItem key={idx} item={item} />
        ))}
      </div>
    </div>
  )
}

function SideBarHeader({ title, icon }: { title: string; icon: ReactNode }) {
  const { isOpen, isAnimationEnabled, toggleAnimation, canDeviceHover } = useSidebarStore((state) => state)

  return (
    <Link href='#' className='relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black'>
      {icon || <QuestionMarkCircleIcon className='size-7 min-h-7 min-w-7' />}

      <>
        <motion.span
          animate={{
            opacity: isAnimationEnabled ? (isOpen ? 1 : 0.2) : 1,
          }}
          exit={{ opacity: 0.5 }}
          className='overflow-hidden font-medium whitespace-pre text-black dark:text-white'>
          {title}
        </motion.span>

        <div className='flex-1' />
        <motion.div
          animate={{ opacity: isAnimationEnabled ? (isOpen ? 1 : 0.2) : 1, rotate: isAnimationEnabled ? 45 : 0 }}
          className={tw('flex justify-end overflow-hidden', !canDeviceHover && 'hidden')}
          onClick={toggleAnimation}>
          <Pin className={tw('size-5 stroke-1', !isAnimationEnabled && 'stroke-2')} />
        </motion.div>
      </>
    </Link>
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
