'use client'

import DisplayQuestion from '@/src/components/check/DisplayQuestion'
import { useExaminationStore } from '@/src/components/checks/[share_token]/ExaminationStoreProvider'
import { Button } from '@/src/components/shadcn/button'
import { motion } from 'framer-motion'
import { InfoIcon } from 'lucide-react'

export function ExamQuestionRenderer() {
  const { currentQuestionIndex, knowledgeCheck, nextQuestion, previousQuestion } = useExaminationStore((store) => store)
  if (knowledgeCheck.questions?.length === 0)
    return (
      <div className='mx-auto flex max-h-fit w-full max-w-7xl items-center justify-center gap-2 text-neutral-600 dark:text-neutral-300'>
        <InfoIcon className='size-5' />
        No questions available
      </div>
    )

  return (
    <motion.div
      key={currentQuestionIndex}
      animate={{
        scale: [1, 0.98, 1],
        opacity: [0.75, 1, 1],
        transition: { duration: 0.15, ease: 'easeInOut' },
      }}
      className='relative mx-auto max-h-fit w-full max-w-7xl'>
      {<DisplayQuestion {...knowledgeCheck.questions.at(currentQuestionIndex)!} />}
      <div className='absolute right-0 -bottom-16 left-0 flex justify-between px-8'>
        <Button variant='outline' onClick={previousQuestion}>
          Previous
        </Button>
        <Button onClick={nextQuestion}>Next</Button>
      </div>
    </motion.div>
  )
}
