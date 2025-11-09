'use client'

import { createContext, useContext } from 'react'
import { useStore } from 'zustand'
import { createPracticeStore, PracticeStore } from '@/src/hooks/checks/[share_token]/practice/PracticeStore'
import { useStoreCachingOptions, useZustandStore } from '@/src/hooks/Shared/zustand/useZustandStore'
import { StoreCachingOptions, StoreState_fromStore } from '@/types/Shared/ZustandStore'

interface StoreProviderProps<TStore extends object> {
  children: React.ReactNode
  initialStoreProps?: Partial<StoreState_fromStore<TStore>>
  options?: Required<Pick<StoreCachingOptions, 'cacheKey'>> & Partial<Omit<useStoreCachingOptions<TStore>, ''>>
}

export type PracticeStoreApi = ReturnType<typeof createPracticeStore>
export const PracticeStoreContext = createContext<PracticeStoreApi | undefined>(undefined)

export function PracticeStoreProvider({ children, initialStoreProps }: Omit<StoreProviderProps<PracticeStore>, 'options'>) {
  const props = useZustandStore({
    caching: false,
    createStoreFunc: createPracticeStore,
    initialStoreProps,
  })

  return <PracticeStoreContext.Provider value={props}>{children}</PracticeStoreContext.Provider>
}

export function usePracticeStore<T>(selector: (store: PracticeStore) => T): T {
  const storeContext = useContext(PracticeStoreContext)

  if (!storeContext) {
    throw new Error(`usePracticeStore must be used within PracticeStoreProvider`)
  }

  return useStore(storeContext, selector)
}
