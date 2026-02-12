'use client'

import { PanelLeftIcon } from 'lucide-react'
import { useSidebarStore } from '@/src/components/root/Navigation/SidebarStoreProvider'
import { Button } from '@/src/components/shadcn/button'

export default function ToggleSidebarButton() {
  const { toggleSidebar } = useSidebarStore((store) => store)
  return (
    <Button variant='ghost' size='icon' className='size-7 p-0' onClick={toggleSidebar}>
      <PanelLeftIcon />
    </Button>
  )
}
