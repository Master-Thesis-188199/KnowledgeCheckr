'use client'

import { saveAction } from '@/src/app/checks/create/SaveAction'
import { useCreateCheckStore } from '@/src/components/check/create/CreateCheckProvider'
import { Button } from '@/src/components/shadcn/button'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'
import { User } from 'better-auth'

export function SaveCreateCheckButton({ user_id }: { user_id: User['id'] }) {
  const store = useCreateCheckStore((store) => store)
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
    <Button aria-label='save created knowledge check' type='submit' formAction={() => saveAction({ check })}>
      Save
    </Button>
  )
}
