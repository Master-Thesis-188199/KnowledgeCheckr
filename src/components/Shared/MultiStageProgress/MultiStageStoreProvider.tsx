'use client'

import { createMultiStageStore, MultiStageState, type MultiStageStore } from '@/hooks/Shared/MultiStage/MultiStageStore'
import { createContext, type ReactNode, useContext, useRef } from 'react'
import { useStore } from 'zustand'

export interface Stage {
  stage: number
  title?: string
  description?: string
}

export type MultiStageStoreApi = ReturnType<typeof createMultiStageStore>

export const MultiStageStoreContext = createContext<MultiStageStoreApi | undefined>(undefined)

export interface MultiStageStoreProviderProps {
  children: ReactNode
  initialStoreProps?: Partial<MultiStageState>
}

export function MultiStageStoreProvider({ children, initialStoreProps }: MultiStageStoreProviderProps) {
  const storeRef = useRef<MultiStageStoreApi>(null)

  if (!storeRef.current) {
    storeRef.current = createMultiStageStore({ initialState: initialStoreProps })
  }

  return <MultiStageStoreContext.Provider value={storeRef.current}>{children}</MultiStageStoreContext.Provider>
}

export function useMultiStageStore<T>(selector: (store: MultiStageStore) => T): T {
  const counterStoreContext = useContext(MultiStageStoreContext)

  if (!counterStoreContext) {
    throw new Error(`useMultiStageStore must be used within MultiStageStoreProvider`)
  }

  return useStore(counterStoreContext, selector)
}
