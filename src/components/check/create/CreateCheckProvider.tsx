'use client'

import { createContext, type ReactNode, useContext, useRef } from 'react'
import { useStore } from 'zustand'
import { createCheckCreateStore, CreateCheckState, type CreateCheckStore } from '@/hooks/checks/create/CreateCheckStore'

export type CreateCheckStoreApi = ReturnType<typeof createCheckCreateStore>

const CreateCheckStoreContext = createContext<CreateCheckStoreApi | undefined>(undefined)

export interface CreateCheckStoreProviderProps {
  children: ReactNode
  initialStoreProps?: CreateCheckState
}

export function CreateCheckStoreProvider({ children, initialStoreProps }: CreateCheckStoreProviderProps) {
  const storeRef = useRef<CreateCheckStoreApi>(null)
  if (!storeRef.current) {
    storeRef.current = createCheckCreateStore(initialStoreProps)
  }

  return <CreateCheckStoreContext.Provider value={storeRef.current}>{children}</CreateCheckStoreContext.Provider>
}

export function useCreateCheckStore<T>(selector: (store: CreateCheckStore) => T): T {
  const counterStoreContext = useContext(CreateCheckStoreContext)

  if (!counterStoreContext) {
    throw new Error(`useCreateCheckStore must be used within CreateCheckStoreProvider`)
  }

  return useStore(counterStoreContext, selector)
}
