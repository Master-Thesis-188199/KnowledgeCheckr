import { useSideBarContext } from '@/components/root/Navigation/SideBarProvider'
import { ReactNode } from 'react'
import { motion } from 'motion/react'
import Link, { LinkProps } from 'next/link'
import { RectangleGroupIcon } from '@heroicons/react/24/outline'
import { QuestionMarkCircleIcon } from '@heroicons/react/24/solid'
import { SideBarProps } from '@/components/root/Navigation/SideBar'
import { twMerge as tw } from 'tailwind-merge'

export default function RenderSideBarItems() {
  const {
    config: { elements, title, icon },
  } = useSideBarContext()

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
  const { isOpen } = useSideBarContext()

  return (
    <Link href='#' className='font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20'>
      {icon || <QuestionMarkCircleIcon className='size-7 ' />}
      {isOpen && (
        <>
          <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className='font-medium text-black dark:text-white whitespace-pre'>
            {title}
          </motion.span>

          {/*todo disable animation when pin is clicked*/}
          <div className='flex-1 flex justify-end' onClick={() => console.log('Pin clicked...')}>
            <RectangleGroupIcon className='size-6' />
          </div>
        </>
      )}
    </Link>
  )
}

export function RenderSideBarItem({ item, className, ...props }: { item: SideBarProps['elements'][number]; className?: string; props?: LinkProps }) {
  const { isAnimationEnabled, isOpen } = useSideBarContext()

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
