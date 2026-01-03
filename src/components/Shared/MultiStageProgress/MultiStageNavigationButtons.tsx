'use client'

import { ButtonHTMLAttributes } from 'react'
import { VariantProps } from 'class-variance-authority'
import { Button, buttonVariants } from '@/src/components/shadcn/button'
import { useMultiStageStore } from '@/src/components/Shared/MultiStageProgress/MultiStageStoreProvider'
import Tooltip from '@/src/components/Shared/Tooltip'

export function MultiStageNextButton({
  ...props
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'type'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const { nextStage, stage, stages, enabled, reason } = useMultiStageStore((store) => store)

  return (
    <Tooltip isDisabled={enabled} showsError content={reason}>
      <Button disabled={stage === stages.length || !enabled} {...props} type='button' onClick={() => nextStage()} />
    </Tooltip>
  )
}

export function MultiStageBackButton({
  ...props
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick' | 'type'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const { previousStage, stage, enabled, reason } = useMultiStageStore((store) => store)

  return (
    <Tooltip isDisabled={enabled} showsError content={reason}>
      <Button {...props} disabled={stage === 1 || !enabled} type='button' onClick={() => previousStage()} />
    </Tooltip>
  )
}
