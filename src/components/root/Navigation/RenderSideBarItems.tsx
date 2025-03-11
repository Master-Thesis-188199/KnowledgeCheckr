import { sideBarConfiguration } from '@/components/root/Navigation/SideBarConfiguration'
import { PinSidebarButton } from '@/components/root/Navigation/mobile/PinSidebarButton'
import Link from 'next/link'
import { twMerge } from 'tailwind-merge'
import SidebarBannerContent from '@/components/root/Navigation/user/SidebarBannerContent'

export default function RenderSideBarItems() {
  const { elements } = sideBarConfiguration

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

export function SidebarElement({ children, icon, className, href }: { children: React.ReactNode; className?: string; href: string; icon: React.ReactNode }) {
  return (
    <Link
      href={href}
      className={twMerge('group/sidebar flex items-center justify-start gap-4 rounded-md py-2 hover:cursor-pointer hover:bg-neutral-200/75 hover:font-semibold dark:hover:bg-neutral-700', className)}>
      {icon}
      <SidebarBannerContent>{children}</SidebarBannerContent>
    </Link>
  )
}
