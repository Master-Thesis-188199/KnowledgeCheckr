'use client'

import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { useCheckStore } from '@/src/components/checks/create/CreateCheckProvider'
import { useNavigationAbort } from '@/src/components/navigation-abortion/NavigationAbortProvider'
import { Button } from '@/src/components/shadcn/button'
import { saveAction } from '@/src/lib/checks/create/SaveAction'
import { safeParseKnowledgeCheck } from '@/src/schemas/KnowledgeCheck'

export function SaveCheckButton({ cacheKey }: { cacheKey?: string }) {
  const store = useCheckStore((store) => store)
  const { clearNavigationAbort } = useNavigationAbort()
  const safeParse = safeParseKnowledgeCheck(store)

  if (!safeParse.success) {
    console.error('[SaveCheckButton]: Parsing of store data failed, save-button disabled. ', safeParse.error)
  }

  return (
    <Button
      disabled={!safeParse.success}
      aria-label='save knowledge check'
      type='submit'
      formAction={() =>
        safeParse.success
          ? saveAction({ check: safeParse.data }).catch((e) => {
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
          : new Promise(() => null)
      }>
      Save
    </Button>
  )
}
