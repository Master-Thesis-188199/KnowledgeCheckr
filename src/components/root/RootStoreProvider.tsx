'use client'

import { createContext, type ReactNode, useContext, useRef } from 'react'
import { useStore } from 'zustand'
import { createRootStore, RootState, type RootStore } from '@/hooks/root/RootStore'

export type RootStoreApi = ReturnType<typeof createRootStore>

export const RootStoreContext = createContext<RootStoreApi | undefined>(undefined)

export interface RootStoreProviderProps {
  children: ReactNode
  initialStoreProps?: RootState
}

export function RootStoreProvider({ children, initialStoreProps }: RootStoreProviderProps) {
  const storeRef = useRef<RootStoreApi>(null)
  if (!storeRef.current) {
    storeRef.current = createRootStore(initialStoreProps)
  }

  return <RootStoreContext.Provider value={storeRef.current}>{children}</RootStoreContext.Provider>
}

export function useRootStore<T>(selector: (store: RootStore) => T): T {
  const counterStoreContext = useContext(RootStoreContext)

  if (!counterStoreContext) {
    throw new Error(`useRootStore must be used within RootStoreProvider`)
  }

  return useStore(counterStoreContext, selector)
}
