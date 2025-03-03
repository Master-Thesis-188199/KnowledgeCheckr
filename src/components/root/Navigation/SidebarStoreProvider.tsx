'use client'

import { createContext, type ReactNode, useContext, useRef } from 'react'
import { useStore } from 'zustand'
import { createSidebarStore, SidebarState, type SidebarStore } from '@/hooks/root/SidebarStore'

export type SidebarStoreApi = ReturnType<typeof createSidebarStore>

export const SidebarStoreContext = createContext<SidebarStoreApi | undefined>(undefined)

export interface SidebarStoreProviderProps {
  children: ReactNode
  initialStoreProps?: SidebarState
}

export function SidebarStoreProvider({ children, initialStoreProps }: SidebarStoreProviderProps) {
  const storeRef = useRef<SidebarStoreApi>(null)
  if (!storeRef.current) {
    storeRef.current = createSidebarStore(initialStoreProps)
  }

  return <SidebarStoreContext.Provider value={storeRef.current}>{children}</SidebarStoreContext.Provider>
}

export function useSidebarStore<T>(selector: (store: SidebarStore) => T): T {
  const counterStoreContext = useContext(SidebarStoreContext)

  if (!counterStoreContext) {
    throw new Error(`useSidebarStore must be used within SidebarStoreProvider`)
  }

  return useStore(counterStoreContext, selector)
}
