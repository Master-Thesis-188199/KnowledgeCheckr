'use client'

import { CheckState, CheckStore, createCheckStore } from '@/hooks/checks/create/CreateCheckStore'
import UnsavedCheckChangesAlert from '@/src/components/check/create/UnsavedCheckChangesAlert'
import useCacheCreateStore, { useCacheCreateStoreOptions } from '@/src/hooks/Shared/useCacheCreateStore'
import { createContext, type ReactNode, useContext } from 'react'
import { useStore } from 'zustand'

export type CheckStoreApi = ReturnType<typeof createCheckStore>

const CheckStoreContext = createContext<CheckStoreApi | undefined>(undefined)

export interface CheckStoreProviderProps {
  children: ReactNode
  initialStoreProps?: CheckState
  options?: useCacheCreateStoreOptions<CheckState>
}

export function CheckStoreProvider({ children, initialStoreProps, options }: CheckStoreProviderProps) {
  const props = useCacheCreateStore<CheckStore>(options?.cacheKey ?? 'check-store', createCheckStore, initialStoreProps, {
    //? discard cache when cached check-id truly differs from the initialStore-id (because ids are constants)
    //? drafted checks may not be discarded when they were either not yet cached or when no initialProps were provided (thus indicating that a new check is being created)
    discardCache: (cache) => cache?.id !== undefined && initialStoreProps?.id !== undefined && cache?.id !== initialStoreProps?.id,
    cacheKey: 'check-store',
    ...options,
  })

  return (
    <CheckStoreContext.Provider value={props}>
      <UnsavedCheckChangesAlert />
      {children}
    </CheckStoreContext.Provider>
  )
}

export function useCheckStore<T>(selector: (store: CheckStore) => T): T {
  const counterStoreContext = useContext(CheckStoreContext)

  if (!counterStoreContext) {
    throw new Error(`useCheckStore must be used within CheckStoreProvider`)
  }

  return useStore(counterStoreContext, selector)
}
