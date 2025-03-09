import SidebarElement from '@/components/root/Navigation/elements/SidebarElement'
import { sideBarConfiguration } from '@/components/root/Navigation/SideBarConfiguration'
import { PinSidebarButton } from '@/components/root/Navigation/mobile/PinSidebarButton'

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
