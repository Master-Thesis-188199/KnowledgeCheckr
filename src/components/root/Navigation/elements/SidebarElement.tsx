import { twMerge } from 'tailwind-merge'
import Link from 'next/link'
import SidebarBannerContent from '@/components/root/Navigation/user/SidebarBannerContent'

export default function SidebarElement({ children, icon, className, href }: { children: React.ReactNode; className?: string; href: string; icon: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={twMerge('group/sidebar flex items-center justify-start gap-4 rounded-md py-2 hover:cursor-pointer hover:bg-neutral-200/75 hover:font-semibold dark:hover:bg-neutral-700', className)}>
      {icon}
      <SidebarBannerContent>{children}</SidebarBannerContent>
    </Link>
  )
}
