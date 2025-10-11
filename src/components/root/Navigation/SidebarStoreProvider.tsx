'use client'

import { createSidebarStore, SidebarState, type SidebarStore } from '@/hooks/root/SidebarStore'
import { useCacheCreateStoreOptions } from '@/src/hooks/Shared/useCacheCreateStore'
import { useZustandStore } from '@/src/hooks/Shared/zustand/useZustandStore'
import { StoreCachingOptions } from '@/types/Shared/ZustandStore'
import { createContext, type ReactNode, useContext } from 'react'
import { useStore } from 'zustand'

export type SidebarStoreApi = ReturnType<typeof createSidebarStore>

export const SidebarStoreContext = createContext<SidebarStoreApi | undefined>(undefined)

export interface SidebarStoreProviderProps {
  children: ReactNode
  initialStoreProps?: SidebarState

  options?: Required<Pick<StoreCachingOptions, 'cacheKey'>> & Partial<Omit<useCacheCreateStoreOptions<SidebarState>, ''>>
}

export function SidebarStoreProvider({ children, initialStoreProps, options = { cacheKey: 'sidebar-store' } }: SidebarStoreProviderProps) {
  const props = useZustandStore({
    caching: true,
    createStoreFunc: createSidebarStore,
    initialStoreProps,
    options,
  })

  return <SidebarStoreContext.Provider value={props}>{children}</SidebarStoreContext.Provider>
}

export function useSidebarStore<T>(selector: (store: SidebarStore) => T): T {
  const counterStoreContext = useContext(SidebarStoreContext)

  if (!counterStoreContext) {
    throw new Error(`useSidebarStore must be used within SidebarStoreProvider`)
  }

  return useStore(counterStoreContext, selector)
}
