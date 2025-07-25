'use client'

import { createExaminationStore, ExaminationState, type ExaminationStore } from '@/hooks/checks/[share_token]/ExaminationStore'
import { createContext, type ReactNode, useContext, useRef } from 'react'
import { useStore } from 'zustand'

export type ExaminationStoreApi = ReturnType<typeof createExaminationStore>

export const ExaminationStoreContext = createContext<ExaminationStoreApi | undefined>(undefined)

export interface ExaminationStoreProviderProps {
  children: ReactNode
  initialStoreProps?: ExaminationState
}

export function ExaminationStoreProvider({ children, initialStoreProps }: ExaminationStoreProviderProps) {
  const storeRef = useRef<ExaminationStoreApi>(null)
  if (!storeRef.current) {
    storeRef.current = createExaminationStore(initialStoreProps)
  }

  return <ExaminationStoreContext.Provider value={storeRef.current}>{children}</ExaminationStoreContext.Provider>
}

export function useExaminationStore<T>(selector: (store: ExaminationStore) => T): T {
  const storeContext = useContext(ExaminationStoreContext)

  if (!storeContext) {
    throw new Error(`useExaminationStore must be used within RootStoreProvider`)
  }

  return useStore(storeContext, selector)
}
