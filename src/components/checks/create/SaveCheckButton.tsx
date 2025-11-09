'use client'

import { saveAction } from '@/src/lib/checks/create/SaveAction'
import { useNavigationAbort } from '@/src/components/navigation-abortion/NavigationAbortProvider'
import { Button } from '@/src/components/shadcn/button'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { useCheckStore } from '@/src/components/checks/create/CreateCheckProvider'

export function SaveCheckButton({ cacheKey }: { cacheKey?: string }) {
  const store = useCheckStore((store) => store)
  const { clearNavigationAbort } = useNavigationAbort()
  const check: KnowledgeCheck = {
    id: store.id,
    name: store.name,
    description: store.description,
    share_key: store.share_key,
    closeDate: store.closeDate,
    difficulty: store.difficulty,
    openDate: store.openDate,
    questionCategories: store.questionCategories,
    questions: store.questions,
  }

  return (
    <Button
      aria-label='save knowledge check'
      type='submit'
      formAction={() =>
        saveAction({ check }).catch((e) => {
          if (isRedirectError(e)) {
            const key = cacheKey ?? 'check-store'
            const hasCache = !!sessionStorage.getItem(key)

            if (hasCache) {
              sessionStorage.removeItem(key)
            } else {
              console.debug(`[SaveCheckButton]: No cached data was found for cacheKey: ${key}.`)
            }

            clearNavigationAbort()
          }
        })
      }>
      Save
    </Button>
  )
}
