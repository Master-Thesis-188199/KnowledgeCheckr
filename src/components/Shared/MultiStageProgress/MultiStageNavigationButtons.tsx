'use client'

import { Button, buttonVariants } from '@/src/components/shadcn/button'
import { useMultiStageStore } from '@/src/components/Shared/MultiStageProgress/MultiStageStoreProvider'
import { VariantProps } from 'class-variance-authority'
import { ButtonHTMLAttributes } from 'react'

export function MultiStageNextButton({
  ...props
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const { nextStage } = useMultiStageStore((store) => store)

  return <Button {...props} onClick={() => nextStage()} />
}

export function MultiStageBackButton({
  ...props
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onClick'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const { previousStage } = useMultiStageStore((store) => store)

  return <Button {...props} onClick={() => previousStage()} />
}
