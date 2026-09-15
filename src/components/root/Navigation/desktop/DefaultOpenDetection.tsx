'use client'

import { useEffect } from 'react'
import { useSidebarStore } from '@/components/root/Navigation/SidebarStoreProvider'
import { useSessionStorageContext } from '@/src/hooks/root/SessionStorage'
import { SidebarState } from '@/src/hooks/root/SidebarStore'

/**
 * This component essentially uses a single useEffect that is executed on mount, to check whether the SidebarStore-cookie is set. When it is not set, then the desktop sidebar will be opened and pinned
 * @returns
 */
export default function DefaultOpenDetection() {
  const { getStoredValue } = useSessionStorageContext()
  const { setOpen, togglePinned, isPinned } = useSidebarStore((state) => state)

  useEffect(() => {
    console.log('Checking first time visit')
    const desktop_variant = document.getElementById('desktop-sidebar-container')
    const isDesktop = desktop_variant?.checkVisibility() === true

    // default open on mobile sidebar not needed
    if (!isDesktop) return
    const sidebarStore = getStoredValue<SidebarState>('sidebar-store')

    // Sidebar-store cookie is set --> was changed at some point
    if (sidebarStore != null) return

    setOpen(true)
    if (!isPinned) togglePinned()
  }, [])

  return null
}
