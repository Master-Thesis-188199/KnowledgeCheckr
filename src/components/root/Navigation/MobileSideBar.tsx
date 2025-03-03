'use client'
import { twMerge as tw } from 'tailwind-merge'

export default function MobileSideBar() {
  return <div className={tw('h-10 px-4 py-4 flex flex-row md:hidden  items-center justify-between bg-neutral-100 dark:bg-neutral-800 w-full')}>Mobile Sidebar</div>
}
