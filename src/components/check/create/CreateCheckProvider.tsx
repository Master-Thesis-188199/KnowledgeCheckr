'use client'

import { createCheckCreateStore, CreateCheckState, type CreateCheckStore } from '@/hooks/checks/create/CreateCheckStore'
import UnsavedCheckChangesAlert from '@/src/components/check/create/UnsavedCheckChangesAlert'
import useCacheCreateStore from '@/src/hooks/Shared/useCacheCreateStore'
import { createContext, type ReactNode, useContext } from 'react'
import { useStore } from 'zustand'

export type CreateCheckStoreApi = ReturnType<typeof createCheckCreateStore>

const CreateCheckStoreContext = createContext<CreateCheckStoreApi | undefined>(undefined)

export interface CreateCheckStoreProviderProps {
  children: ReactNode
  initialStoreProps?: CreateCheckState
}

export function CreateCheckStoreProvider({ children, initialStoreProps }: CreateCheckStoreProviderProps) {
  const props = useCacheCreateStore<CreateCheckState>('create-check-store', createCheckCreateStore, initialStoreProps, {
    //? discard cache when cached check-id truly differs from the initialStore-id (because ids are constants)
    //? drafted checks may not be discarded when they were either not yet cached or when no initialProps were provided (thus indicating that a new check is being created)
    discardCache: (cache) => cache?.id !== undefined && initialStoreProps?.id !== undefined && cache?.id !== initialStoreProps?.id,
  })

  return (
    <CreateCheckStoreContext.Provider value={props}>
      <UnsavedCheckChangesAlert />
      {children}
    </CreateCheckStoreContext.Provider>
  )
}

export function useCreateCheckStore<T>(selector: (store: CreateCheckStore) => T): T {
  const counterStoreContext = useContext(CreateCheckStoreContext)

  if (!counterStoreContext) {
    throw new Error(`useCreateCheckStore must be used within CreateCheckStoreProvider`)
  }

  return useStore(counterStoreContext, selector)
}
