'use client'

import { useSidebarStore } from '@/components/root/Navigation/SidebarStoreProvider'
import { useEffect } from 'react'
import { usePrimaryPointerQuery } from '@/hooks/root/Navigation/usePrimaryPointerQuery'
import useStylusPointerQuery from '@/hooks/root/Navigation/useStylusPointerQuery'
import { useSessionStorageContext } from '@/src/hooks/root/SessionStorage'
import { SidebarState } from '@/src/hooks/root/SidebarStore'

export default function SidebarHoverabilityDetection() {
  const { getStoredValue } = useSessionStorageContext()
  const { setDeviceHoverable } = useSidebarStore((state) => state)
  const primaryPointer = usePrimaryPointerQuery()
  const hasStylus = useStylusPointerQuery()

  useEffect(() => {
    if (primaryPointer === undefined) return
    const desktop_variant = document.getElementById('desktop-sidebar-container')
    const isDesktop = desktop_variant?.checkVisibility() === true

    if (!isDesktop) return
    const sidebarStore = getStoredValue<SidebarState>('sidebar-store')

    if (primaryPointer === 'fine' && !hasStylus) {
      // Prevent re-rendering if the state is already set
      if (sidebarStore && sidebarStore.canDeviceHover) return
      setDeviceHoverable(true)
      console.info(`Your device does support hovering -> hover animations are enabled.`)
    } else {
      // Prevent re-rendering if the state is already set
      if (sidebarStore && !sidebarStore.canDeviceHover) return
      setDeviceHoverable(false)
      console.info(`Your device does not support hovering ${primaryPointer} -> hover animations are disabled.`)
    }
  }, [primaryPointer])

  return null
}
