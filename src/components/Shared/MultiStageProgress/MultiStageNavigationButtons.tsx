'use client'

import { ButtonHTMLAttributes } from 'react'
import { VariantProps } from 'class-variance-authority'
import { Button, buttonVariants } from '@/src/components/shadcn/button'
import { useMultiStageStore } from '@/src/components/Shared/MultiStageProgress/MultiStageStoreProvider'

export function MultiStageNextButton({
  ...props
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'type'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const { nextStage, stage, stages, enabled } = useMultiStageStore((store) => store)

  return <Button disabled={stage === stages.length || !enabled} {...props} type='button' onClick={() => nextStage()} />
}

export function MultiStageBackButton({
  ...props
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'type'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const { previousStage, stage, enabled } = useMultiStageStore((store) => store)

  return <Button {...props} disabled={stage === 1 || !enabled} type='button' onClick={() => previousStage()} />
}
