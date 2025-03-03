'use client'

import { ReactNode } from 'react'
import { motion } from 'motion/react'
import Link, { LinkProps } from 'next/link'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/solid'
import { SideBarProps } from '@/components/root/Navigation/SideBar'
import { twMerge as tw } from 'tailwind-merge'
import { useSidebarStore } from '@/components/root/Navigation/SidebarStoreProvider'
import { RectangleGroupIcon } from '@heroicons/react/24/outline'

export default function RenderSideBarItems() {
  const {
    config: { elements, title, icon },
  } = useSidebarStore((state) => state)

  return (
    <div className='flex flex-col flex-1 overflow-y-auto overflow-x-hidden'>
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
  const { isOpen, isAnimationEnabled, toggleAnimation } = useSidebarStore((state) => state)

  return (
    <Link href='#' className='font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20'>
      {icon || <QuestionMarkCircleIcon className='size-7 min-w-7 min-h-7' />}

      <>
        <motion.span
          animate={{
            opacity: isAnimationEnabled ? (isOpen ? 1 : 0.2) : 1,
          }}
          exit={{ opacity: 0.5 }}
          className='font-medium text-black dark:text-white whitespace-pre overflow-hidden'>
          {title}
        </motion.span>

        <motion.div animate={{ opacity: isAnimationEnabled ? (isOpen ? 1 : 0.2) : 1 }} className='flex-1 flex justify-end overflow-hidden' onClick={toggleAnimation}>
          <RectangleGroupIcon className={tw('size-6', !isAnimationEnabled && 'stroke-2')} />
        </motion.div>
      </>
    </Link>
  )
}

export function RenderSideBarItem({ item, className, ...props }: { item: SideBarProps['elements'][number]; className?: string; props?: LinkProps }) {
  const { isAnimationEnabled, isOpen } = useSidebarStore((state) => state)

  return (
    <Link href={item.href || '#'} className={tw('flex items-center justify-start gap-3  group/sidebar py-2', className)} {...props}>
      {item.icon}

      <motion.span
        animate={{
          display: isAnimationEnabled ? (isOpen ? 'inline-block' : 'none') : 'inline-block',
          opacity: isAnimationEnabled ? (isOpen ? 1 : 0.0) : 1,
        }}
        className='text-neutral-700 dark:text-neutral-200 text-sm group-hover/sidebar:translate-x-1 transition duration-150 whitespace-pre inline-block !p-0 !m-0'>
        {item.label}
      </motion.span>
    </Link>
  )
}
