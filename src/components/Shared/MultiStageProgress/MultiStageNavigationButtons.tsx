'use client'

import { Button, buttonVariants } from '@/src/components/shadcn/button'
import { useMultiStageStore } from '@/src/components/Shared/MultiStageProgress/MultiStageStoreProvider'
import { VariantProps } from 'class-variance-authority'
import { ButtonHTMLAttributes } from 'react'

export function MultiStageNextButton({
  ...props
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'type'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const { nextStage, stage, stages } = useMultiStageStore((store) => store)

  return <Button disabled={stage === stages.length} {...props} type='button' onClick={() => nextStage()} />
}

export function MultiStageBackButton({
  ...props
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'type'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const { previousStage, stage } = useMultiStageStore((store) => store)

  return <Button {...props} disabled={stage === 1} type='button' onClick={() => previousStage()} />
}
