'use client'
import { twMerge as tw } from 'tailwind-merge'
import { useSidebarStore } from '@/components/root/Navigation/SidebarStoreProvider'
import ThemeSwitcher from '@/components/root/ThemeSwitcher'
import MobileSidebarToggleButton from '@/components/root/Navigation/mobile/MobilebarToggleButton'

export default function MobileSideBar({ className }: { className?: string }) {
  const {
    config: { title },
  } = useSidebarStore((state) => state)

  return (
    <div className={tw('h-10 w-full flex-row items-center justify-between bg-neutral-200/70 px-4 py-6 dark:bg-neutral-800', className)}>
      <MobileSidebarToggleButton />
      <span className='text-xl font-semibold'>{title}</span>
      <ThemeSwitcher />
    </div>
  )
}
