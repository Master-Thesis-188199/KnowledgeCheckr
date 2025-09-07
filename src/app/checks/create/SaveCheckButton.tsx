'use client'

import { saveAction } from '@/src/app/checks/create/SaveAction'
import { useCreateCheckStore } from '@/src/components/check/create/CreateCheckProvider'
import { useNavigationAbort } from '@/src/components/navigation-abortion/NavigationAbortProvider'
import { Button } from '@/src/components/shadcn/button'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'
import { isRedirectError } from 'next/dist/client/components/redirect-error'

export function SaveCreateCheckButton() {
  const store = useCreateCheckStore((store) => store)
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
      aria-label='save created knowledge check'
      type='submit'
      formAction={() =>
        saveAction({ check }).catch((e) => {
          if (isRedirectError(e)) {
            sessionStorage.removeItem('create-check-store')
            clearNavigationAbort()
          }
        })
      }>
      Save
    </Button>
  )
}
