'use client'

import { createExaminationStore, ExaminationState, ExaminationStore } from '@/hooks/checks/[share_token]/ExaminationStore'
import useCacheCreateStore, { useCacheCreateStoreOptions } from '@/src/hooks/Shared/useCacheCreateStore'
import { createContext, type ReactNode, useContext } from 'react'
import { useStore } from 'zustand'

export type ExaminationStoreApi = ReturnType<typeof createExaminationStore>

export const ExaminationStoreContext = createContext<ExaminationStoreApi | undefined>(undefined)

export interface ExaminationStoreProviderProps {
  children: ReactNode
  initialStoreProps?: ExaminationState
  options?: useCacheCreateStoreOptions<ExaminationState>
}

export function ExaminationStoreProvider({ children, initialStoreProps, options }: ExaminationStoreProviderProps) {
  //todo consider switching to localStorage to ensure that users do not loose their progress e.g. when their browser / system crashes
  const props = useCacheCreateStore<ExaminationState>(options?.cacheKey ?? 'examination-store', createExaminationStore, initialStoreProps, {
    expiresAfter: 10 * 60 * 1000,
    discardCache: (cache) => cache?.knowledgeCheck.id !== initialStoreProps?.knowledgeCheck.id,
    ...options,
  }) //expire after 10 minutes of inactivity or when cached check-id differs from the initialStore-id (because ids are constants)

  return <ExaminationStoreContext.Provider value={props}>{children}</ExaminationStoreContext.Provider>
}

export function useExaminationStore<T>(selector: (store: ExaminationStore) => T): T {
  const storeContext = useContext(ExaminationStoreContext)

  if (!storeContext) {
    throw new Error(`useExaminationStore must be used within RootStoreProvider`)
  }

  return useStore(storeContext, selector)
}
