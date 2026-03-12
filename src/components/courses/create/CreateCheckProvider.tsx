'use client'

import { createContext, type ReactNode, useContext } from 'react'
import { useStore } from 'zustand'
import UnsavedCheckChangesAlert from '@/src/components/courses/create/UnsavedCheckChangesAlert'
import { CourseState, CourseStore, createCourseStore } from '@/src/hooks/courses/create/CreateCourseStore'
import { useStoreCachingOptions, useZustandStore } from '@/src/hooks/Shared/zustand/useZustandStore'
import { StoreCachingOptions } from '@/types/Shared/ZustandStore'

export type CheckStoreApi = ReturnType<typeof createCourseStore>

const CheckStoreContext = createContext<CheckStoreApi | undefined>(undefined)

export interface CheckStoreProviderProps {
  children: ReactNode
  initialStoreProps?: Partial<CourseState>
  options?: Required<Pick<StoreCachingOptions, 'cacheKey'>> & Partial<Omit<useStoreCachingOptions<CourseStore>, ''>>
}

export function CheckStoreProvider({ children, initialStoreProps, options = { cacheKey: 'courses-store' } }: CheckStoreProviderProps) {
  const props = useZustandStore({
    caching: true,
    createStoreFunc: createCourseStore,
    initialStoreProps,
    options: {
      //     //? discard cache when cached check-id truly differs from the initialStore-id (because ids are constants)
      //     //? drafted courses may not be discarded when they were either not yet cached or when no initialProps were provided (thus indicating that a new check is being created)
      discardCache: (cache) => cache?.id !== undefined && initialStoreProps?.id !== undefined && cache?.id !== initialStoreProps?.id,
      debounceTime: 750,
      ...options,
    },
  })

  return (
    <CheckStoreContext.Provider value={props}>
      <UnsavedCheckChangesAlert />
      {children}
    </CheckStoreContext.Provider>
  )
}

export function useCheckStore<T>(selector: (store: CourseStore) => T): T {
  const counterStoreContext = useContext(CheckStoreContext)

  if (!counterStoreContext) {
    throw new Error(`useCheckStore must be used within CheckStoreProvider`)
  }

  return useStore(counterStoreContext, selector)
}
