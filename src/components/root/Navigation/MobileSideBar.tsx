'use client'
import { twMerge as tw } from 'tailwind-merge'

export default function MobileSideBar({ className }: { className?: string }) {
  return <div className={tw('h-10 w-full flex-row items-center justify-between bg-neutral-100 px-4 py-4 dark:bg-neutral-800', className)}>Mobile Sidebar</div>
}
