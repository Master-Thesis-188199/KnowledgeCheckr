'use client'

import { ButtonHTMLAttributes } from 'react'
import { usePracticeStore } from '@/src/components/checks/[share_token]/practice/PracticeStoreProvider'
import { Button } from '@/src/components/shadcn/button'
import { cn } from '@/src/lib/Shared/utils'

export function PracticeNavigationNextButton({ ...props }: {} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const { nextQuestion } = usePracticeStore((store) => store)

  return <Button {...props} onClick={() => nextQuestion(true)} children='Next' className={cn('', props.className)} />
}

export function PracticeNavigationPreviousButton({ ...props }: {} & ButtonHTMLAttributes<HTMLButtonElement>) {
  const { previousQuestion } = usePracticeStore((store) => store)

  return <Button {...props} variant='outline' onClick={() => previousQuestion(true)} children='Previous' className={cn('', props.className)} />
}
