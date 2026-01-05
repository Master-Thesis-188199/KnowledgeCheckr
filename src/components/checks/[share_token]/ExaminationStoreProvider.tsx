'use client'

import { createContext, type ReactNode, useContext } from 'react'
import { format } from 'date-fns'
import { useStore } from 'zustand'
import { createExaminationStore, ExaminationState, ExaminationStore } from '@/hooks/checks/[share_token]/ExaminationStore'
import { useStoreCachingOptions, useZustandStore } from '@/src/hooks/Shared/zustand/useZustandStore'

export type ExaminationStoreApi = ReturnType<typeof createExaminationStore>

export const ExaminationStoreContext = createContext<ExaminationStoreApi | undefined>(undefined)

export interface ExaminationStoreProviderProps {
  children: ReactNode
  initialStoreProps?: ExaminationState
  options?: Partial<useStoreCachingOptions<ExaminationStore>>
}

export function ExaminationStoreProvider({ children, initialStoreProps, options }: ExaminationStoreProviderProps) {
  //todo consider switching to localStorage to ensure that users do not loose their progress e.g. when their browser / system crashes
  const props = useZustandStore({
    caching: true,
    createStoreFunc: createExaminationStore,
    initialStoreProps,
    options: {
      expiresAfter: 10 * 60 * 1000,
      discardCache: (cache) => cache?.knowledgeCheck.id !== initialStoreProps?.knowledgeCheck.id,
      cacheKey: 'examination-store',
      modifyCache: (cache) => {
        const formatUpdateDate = (date?: Date | string) => {
          if (!date) return 'undefined date'

          if (typeof date === 'string') {
            return format(new Date(Date.parse(date)), 'dd.LL.yyyy HH:mm:ss')
          }

          return format(date, 'dd.LL.yyyy HH:mm:ss')
        }

        // mutate cache when the underlying check (initialStoreProps) change, but preserve order, results and startedAt values
        if (initialStoreProps !== undefined && formatUpdateDate(cache?.knowledgeCheck.updatedAt) !== formatUpdateDate(initialStoreProps?.knowledgeCheck.updatedAt)) {
          console.warn('[Examination]: Check has been updated, mutating cache!')

          // preserve the cached order of questions
          const preservedQuestionsOrder = initialStoreProps.knowledgeCheck.questions.toSorted(
            (a, b) => cache.knowledgeCheck.questions.findIndex((q) => q.id === a.id) - cache.knowledgeCheck.questions.findIndex((q) => q.id === b.id),
          )

          const update: typeof initialStoreProps = {
            ...initialStoreProps,
            knowledgeCheck: {
              ...initialStoreProps.knowledgeCheck,
              questions: preservedQuestionsOrder,
            },
          }
          return { ...cache, ...update, results: cache.results, startedAt: cache.startedAt }
        }

        return cache
      },
      ...options,
    },
  }) // expire after 10 minutes of inactivity or when cached check-id differs from the initialStore-id (because ids are constants)

  return <ExaminationStoreContext.Provider value={props}>{children}</ExaminationStoreContext.Provider>
}

export function useExaminationStore<T>(selector: (store: ExaminationStore) => T): T {
  const storeContext = useContext(ExaminationStoreContext)

  if (!storeContext) {
    throw new Error(`useExaminationStore must be used within RootStoreProvider`)
  }

  return useStore(storeContext, selector)
}
