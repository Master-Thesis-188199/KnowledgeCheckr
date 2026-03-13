'use client'

import { InfoIcon } from 'lucide-react'
import { isRedirectError } from 'next/dist/client/components/redirect-error'
import { useCourseStore } from '@/src/components/courses/create/CreateCourseProvider'
import { useNavigationAbort } from '@/src/components/navigation-abortion/NavigationAbortProvider'
import { Button } from '@/src/components/shadcn/button'
import Tooltip from '@/src/components/Shared/Tooltip'
import { saveAction } from '@/src/lib/courses/create/SaveAction'
import { cn } from '@/src/lib/Shared/utils'
import { safeParseCourse } from '@/src/schemas/CourseSchema'

export function SaveCourseButton({ cacheKey, callbackPath }: { cacheKey?: string; callbackPath?: string }) {
  const store = useCourseStore((store) => store)
  const { clearNavigationAbort } = useNavigationAbort()
  const safeParse = safeParseCourse(store)

  if (!safeParse.success) {
    console.error('[SaveCourseButton]: Parsing of store data failed, save-button disabled. ', safeParse.error)
  }

  const formAction = () => {
    if (!safeParse.success) return undefined

    saveAction({ course: safeParse.data, callbackPath: callbackPath ?? '/courses' }).catch((e) => {
      if (isRedirectError(e)) {
        const key = cacheKey ?? 'courses-store'
        const hasCache = !!sessionStorage.getItem(key)

        const stagesKey = 'create-course-stages'
        const hasCachedStage = !!sessionStorage.getItem(stagesKey)

        if (hasCachedStage) sessionStorage.removeItem(stagesKey)

        if (hasCache) {
          sessionStorage.removeItem(key)
        } else {
          console.debug(`[SaveCourseButton]: No cached data was found for cacheKey: ${key}.`)
        }

        clearNavigationAbort()
      }
    })
  }

  return (
    <Tooltip
      disabled={safeParse.success}
      content={
        <div className='flex items-center gap-1.5'>
          <InfoIcon className='size-4 text-destructive' />
          This course cannot be saved at this moment, because it violates internal schema definitions.
        </div>
      }
      delay={250}
      className={cn(
        'rounded-md bg-neutral-100 p-2 text-sm shadow-sm shadow-neutral-400 dark:bg-neutral-800 dark:text-neutral-300 dark:shadow-neutral-700',
        !safeParse.success && 'dark:text-red-400/90 dark:shadow-red-400/40',
      )}>
      <Button disabled={!safeParse.success} aria-label='save course' type='submit' formAction={formAction}>
        Save
      </Button>
    </Tooltip>
  )
}
