'use client'

import { createContext, type ReactNode, useContext } from 'react'
import { useStore } from 'zustand'
import { createMultiStageStore, MultiStageState, type MultiStageStore } from '@/hooks/Shared/MultiStage/MultiStageStore'
import { useStoreCachingOptions, useZustandStore } from '@/src/hooks/Shared/zustand/useZustandStore'
import { StoreCachingOptions } from '@/types/Shared/ZustandStore'

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

  cacheOptions: Required<Pick<StoreCachingOptions, 'cacheKey'>> & Partial<Omit<useStoreCachingOptions<MultiStageStore>, ''>>
}

export function MultiStageStoreProvider({ children, initialStoreProps, cacheOptions }: MultiStageStoreProviderProps) {
  const props = useZustandStore<MultiStageStore, Partial<MultiStageState>>({
    caching: true,
    createStoreFunc: createMultiStageStore,
    initialStoreProps,
    options: cacheOptions,
  })

  return <MultiStageStoreContext.Provider value={props}>{children}</MultiStageStoreContext.Provider>
}

export function useMultiStageStore<T>(selector: (store: MultiStageStore) => T): T {
  const counterStoreContext = useContext(MultiStageStoreContext)

  if (!counterStoreContext) {
    throw new Error(`useMultiStageStore must be used within MultiStageStoreProvider`)
  }

  return useStore(counterStoreContext, selector)
}
