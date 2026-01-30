'use client'

import { Tooltip } from '@heroui/tooltip'
import { InfoIcon } from 'lucide-react'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { useCheckStore } from '@/src/components/checks/create/CreateCheckProvider'
import { useNavigationAbort } from '@/src/components/navigation-abortion/NavigationAbortProvider'
import { Button } from '@/src/components/shadcn/button'
import { saveAction } from '@/src/lib/checks/create/SaveAction'
import { cn } from '@/src/lib/Shared/utils'
import { safeParseKnowledgeCheck } from '@/src/schemas/KnowledgeCheck'

export function SaveCheckButton({ cacheKey, callbackPath }: { cacheKey?: string; callbackPath?: string }) {
  const store = useCheckStore((store) => store)
  const { clearNavigationAbort } = useNavigationAbort()
  const safeParse = safeParseKnowledgeCheck(store)

  if (!safeParse.success) {
    console.error('[SaveCheckButton]: Parsing of store data failed, save-button disabled. ', safeParse.error)
  }

  const formAction = () => {
    if (!safeParse.success) return undefined

    saveAction({ check: safeParse.data, callbackPath: callbackPath ?? '/checks' }).catch((e) => {
      if (isRedirectError(e)) {
        const key = cacheKey ?? 'check-store'
        const hasCache = !!sessionStorage.getItem(key)

        const stagesKey = 'create-check-stages'
        const hasCachedStage = !!sessionStorage.getItem(stagesKey)

        if (hasCachedStage) sessionStorage.removeItem(stagesKey)

        if (hasCache) {
          sessionStorage.removeItem(key)
        } else {
          console.debug(`[SaveCheckButton]: No cached data was found for cacheKey: ${key}.`)
        }

        clearNavigationAbort()
      }
    })
  }

  return (
    <Tooltip
      isDisabled={safeParse.success}
      content={
        <div className='flex items-center gap-1.5'>
          <InfoIcon className='text-destructive size-4' />
          This check cannot be saved at this moment, because it violates internal schema definitions.
        </div>
      }
      delay={250}
      offset={8}
      closeDelay={0}
      shouldFlip
      className={cn(
        'rounded-md bg-neutral-100 p-2 text-sm shadow-sm shadow-neutral-400 dark:bg-neutral-800 dark:text-neutral-300 dark:shadow-neutral-700',
        !safeParse.success && 'dark:text-red-400/90 dark:shadow-red-400/40',
      )}>
      <Button disabled={!safeParse.success} aria-label='save knowledge check' type='submit' formAction={formAction}>
        Save
      </Button>
    </Tooltip>
  )
}
