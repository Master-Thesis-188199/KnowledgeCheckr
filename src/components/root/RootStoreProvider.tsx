'use client'

import { createRootStore, RootState, type RootStore } from '@/hooks/root/RootStore'
import { useZustandStore } from '@/src/hooks/Shared/zustand/useZustandStore'
import { createContext, type ReactNode, useContext } from 'react'
import { useStore } from 'zustand'

export type RootStoreApi = ReturnType<typeof createRootStore>

export const RootStoreContext = createContext<RootStoreApi | undefined>(undefined)

export interface RootStoreProviderProps {
  children: ReactNode
  initialStoreProps?: RootState
}

export function RootStoreProvider({ children, initialStoreProps }: RootStoreProviderProps) {
  const props = useZustandStore({
    caching: false,
    createStoreFunc: createRootStore,
    initialStoreProps: initialStoreProps,
  })

  return <RootStoreContext.Provider value={props}>{children}</RootStoreContext.Provider>
}

export function useRootStore<T>(selector: (store: RootStore) => T): T {
  const counterStoreContext = useContext(RootStoreContext)

  if (!counterStoreContext) {
    throw new Error(`useRootStore must be used within RootStoreProvider`)
  }

  return useStore(counterStoreContext, selector)
}
