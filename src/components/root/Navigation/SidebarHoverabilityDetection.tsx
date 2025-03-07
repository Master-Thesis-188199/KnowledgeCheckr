'use client'

import { useSidebarStore } from '@/components/root/Navigation/SidebarStoreProvider'
import { useEffect } from 'react'
import { usePrimaryPointerQuery } from '@/hooks/root/Navigation/usePrimaryPointerQuery'
import useStylusPointerQuery from '@/hooks/root/Navigation/useStylusPointerQuery'

export default function SidebarHoverabilityDetection() {
  const { setDeviceHoverable } = useSidebarStore((state) => state)
  const primaryPointer = usePrimaryPointerQuery()
  const hasStylus = useStylusPointerQuery()

  useEffect(() => {
    if (primaryPointer === undefined) return
    const desktop_variant = document.getElementById('desktop-sidebar-container')
    const isDesktop = desktop_variant?.checkVisibility() === true

    if (!isDesktop) return

    if (primaryPointer === 'fine' && !hasStylus) {
      setDeviceHoverable(true)
      console.info(`Your device does support hovering -> hover animations are enabled.`)
    } else {
      console.info(`Your device does not support hovering ${primaryPointer} -> hover animations are disabled.`)
      setDeviceHoverable(false)
    }
  }, [primaryPointer])

  return null
}
