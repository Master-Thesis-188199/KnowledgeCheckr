import { twMerge } from 'tailwind-merge'
import SidebarElementContent from '@/components/root/Navigation/elements/SidebarElementContent'
import { PinSidebarButton } from '@/components/root/Navigation/mobile/PinSidebarButton'
import { sideBarConfiguration } from '@/components/root/Navigation/SideBarConfiguration'
import { CloseMobileSidebarLink } from '@/src/components/root/Navigation/mobile/MobileSidebarDialog'
import { SidebarItem } from '@/src/components/root/Navigation/SideBar'
import { cn } from '@/src/lib/Shared/utils'

export default function RenderSideBarItems() {
  const { elements } = sideBarConfiguration

  return (
    <div className='relative flex flex-1 flex-col overflow-y-auto'>
      {/* todo externalize header from <RenderSideBarItem> */}
      <PinSidebarButton />

      <div className='mt-8 flex flex-col gap-2 md:gap-3'>
        {elements.map((item, idx) => (item.type === 'navigation' ? <NavigationSidebarElement key={idx} {...item} /> : <SeparatorElement key={item.type + idx} {...item} />))}
      </div>
    </div>
  )
}

function SeparatorElement({ classes }: {} & Extract<SidebarItem, { type: 'separator' }>) {
  return <div className={cn('h-1 border border-neutral-700 dark:border-neutral-200', classes)} />
}

export function NavigationSidebarElement({ label, icon, className, href }: { className?: string } & Omit<Extract<SidebarItem, { type: 'navigation' }>, 'type'>) {
  return (
    <CloseMobileSidebarLink
      aria-label='sidebar item'
      href={href ?? '#'}
      className={twMerge('group/sidebar flex items-center justify-start gap-4 rounded-md py-2 hover:cursor-pointer hover:bg-neutral-200/75 hover:font-semibold dark:hover:bg-neutral-700', className)}>
      {icon}
      <SidebarElementContent>{label}</SidebarElementContent>
    </CloseMobileSidebarLink>
  )
}
