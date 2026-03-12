'use client'

import { createContext, type ReactNode, useContext } from 'react'
import { useStore } from 'zustand'
import UnsavedCourseChangesAlert from '@/src/components/courses/create/UnsavedCourseChangesAlert'
import { CourseState, CourseStore, createCourseStore } from '@/src/hooks/courses/create/CreateCourseStore'
import { useStoreCachingOptions, useZustandStore } from '@/src/hooks/Shared/zustand/useZustandStore'
import { StoreCachingOptions } from '@/types/Shared/ZustandStore'

export type CourseStoreApi = ReturnType<typeof createCourseStore>

const CourseStoreContext = createContext<CourseStoreApi | undefined>(undefined)

export interface CourseStoreProviderProps {
  children: ReactNode
  initialStoreProps?: Partial<CourseState>
  options?: Required<Pick<StoreCachingOptions, 'cacheKey'>> & Partial<Omit<useStoreCachingOptions<CourseStore>, ''>>
}

export function CourseStoreProvider({ children, initialStoreProps, options = { cacheKey: 'courses-store' } }: CourseStoreProviderProps) {
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
    <CourseStoreContext.Provider value={props}>
      <UnsavedCourseChangesAlert />
      {children}
    </CourseStoreContext.Provider>
  )
}

export function useCourseStore<T>(selector: (store: CourseStore) => T): T {
  const counterStoreContext = useContext(CourseStoreContext)

  if (!counterStoreContext) {
    throw new Error(`useCourseStore must be used within CourseStoreProvider`)
  }

  return useStore(counterStoreContext, selector)
}
