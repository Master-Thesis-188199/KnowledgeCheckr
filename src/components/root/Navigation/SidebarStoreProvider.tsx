'use client'

import { createSidebarStore, SidebarState, type SidebarStore } from '@/hooks/root/SidebarStore'
import { useSessionStorageContext } from '@/src/hooks/root/SessionStorage'
import { useCacheCreateStoreOptions } from '@/src/hooks/Shared/useCacheCreateStore'
import { StoreCachingOptions, StoreState_fromStore } from '@/types/Shared/ZustandStore'
import { createContext, type ReactNode, useContext, useRef } from 'react'
import { useStore } from 'zustand'

export type SidebarStoreApi = ReturnType<typeof createSidebarStore>

export const SidebarStoreContext = createContext<SidebarStoreApi | undefined>(undefined)

export interface SidebarStoreProviderProps {
  children: ReactNode
  initialStoreProps?: SidebarState

  options?: Required<Pick<StoreCachingOptions, 'cacheKey'>> & Partial<Omit<useCacheCreateStoreOptions<SidebarState>, ''>>
}

export function SidebarStoreProvider({ children, initialStoreProps, options = { cacheKey: 'sidebar-store' } }: SidebarStoreProviderProps) {
  const storeRef = useRef<SidebarStoreApi>(null)
  const { getStoredValue } = useSessionStorageContext()

  if (!storeRef.current) {
    const cached = getStoredValue<StoreState_fromStore<SidebarStore>>(options.cacheKey)
    if (cached) Object.assign(cached, { config: initialStoreProps?.config ?? {} })

    storeRef.current = createSidebarStore({ initialState: cached ?? initialStoreProps, options })
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
