'use client'

import DisplayQuestion from '@/src/components/check/DisplayQuestion'
import { useExaminationStore } from '@/src/components/checks/[share_token]/ExaminationStoreProvider'
import { InfoIcon } from 'lucide-react'

export function ExamQuestionRenderer() {
  const { currentQuestionIndex, knowledgeCheck } = useExaminationStore((store) => store)
  if (knowledgeCheck.questions?.length === 0)
    return (
      <div className='mx-auto flex max-h-fit w-full max-w-7xl items-center justify-center gap-2 text-neutral-600 dark:text-neutral-300'>
        <InfoIcon className='size-5' />
        No questions available
      </div>
    )

  return <div className='mx-auto max-h-fit w-full max-w-7xl'>{<DisplayQuestion {...knowledgeCheck.questions.at(currentQuestionIndex)!} />}</div>
}
