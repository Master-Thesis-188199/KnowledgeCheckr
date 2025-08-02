'use client'

import { createCheckCreateStore, CreateCheckState, type CreateCheckStore } from '@/hooks/checks/create/CreateCheckStore'
import UnsavedCheckChangesAlert from '@/src/components/check/create/UnsavedCheckChangesAlert'
import { useSessionStorageContext } from '@/src/hooks/root/SessionStorage'
import { validateKnowledgeCheck } from '@/src/schemas/KnowledgeCheck'
import { createContext, type ReactNode, useContext, useRef } from 'react'
import { useStore } from 'zustand'

export type CreateCheckStoreApi = ReturnType<typeof createCheckCreateStore>

const CreateCheckStoreContext = createContext<CreateCheckStoreApi | undefined>(undefined)

export interface CreateCheckStoreProviderProps {
  children: ReactNode
  initialStoreProps?: CreateCheckState
}

export function CreateCheckStoreProvider({ children, initialStoreProps }: CreateCheckStoreProviderProps) {
  const storeRef = useRef<CreateCheckStoreApi>(null)
  const { getStoredValue } = useSessionStorageContext()

  if (!storeRef.current) {
    storeRef.current = createCheckCreateStore(getStoredValue<CreateCheckState>('create-check-store', { validation: validateKnowledgeCheck }) ?? initialStoreProps)
  }

  return (
    <CreateCheckStoreContext.Provider value={storeRef.current}>
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
