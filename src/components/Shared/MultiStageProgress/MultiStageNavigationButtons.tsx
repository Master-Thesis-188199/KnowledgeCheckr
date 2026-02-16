'use client'

import { Button, SimpleButtonProps } from '@/src/components/shadcn/button'
import { useMultiStageStore } from '@/src/components/Shared/MultiStageProgress/MultiStageStoreProvider'
import Tooltip from '@/src/components/Shared/Tooltip'

export function MultiStageNextButton({ ...props }: Omit<SimpleButtonProps, 'onClick' | 'type'>) {
  const { nextStage, stage, stages, enabled, reason } = useMultiStageStore((store) => store)

  return (
    <Tooltip isDisabled={enabled} showsError content={reason}>
      <Button disabled={stage === stages.length || !enabled} {...props} type='button' onClick={() => nextStage()} />
    </Tooltip>
  )
}

export function MultiStageBackButton({ ...props }: Omit<SimpleButtonProps, 'onClick' | 'type'>) {
  const { previousStage, stage, enabled, reason } = useMultiStageStore((store) => store)

  return (
    <Tooltip isDisabled={enabled} showsError content={reason}>
      <Button {...props} disabled={stage === 1 || !enabled} type='button' onClick={() => previousStage()} />
    </Tooltip>
  )
}
