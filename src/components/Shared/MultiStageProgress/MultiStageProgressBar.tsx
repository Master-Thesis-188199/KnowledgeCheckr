'use client'

import Line from '@/src/components/Shared/Line'
import { Stage, useMultiStageStore } from '@/src/components/Shared/MultiStageProgress/MultiStageStoreProvider'
import { cn } from '@/src/lib/Shared/utils'
import { Fragment, useEffect, useRef, useState } from 'react'

export function MultiStageProgressBar({ className }: { className?: string }) {
  const { stages } = useMultiStageStore((state) => state)

  return (
    <ol className={cn('mx-[12.5%] flex items-center justify-center gap-6 text-white/40 select-none', className)}>
      {stages.map((stage, i) => (
        <Fragment key={`Stage-${i}`}>
          <ProgressRing {...stage} />
          <RingConnector {...stage} />
        </Fragment>
      ))}
    </ol>
  )
}

function ProgressRing({ stage, title }: Stage) {
  const { isFocussed, setStage, isCompleted } = useMultiStageStore((state) => state)

  return (
    <li
      onClick={() => setStage(stage)}
      className={cn(
        'flex size-5 min-w-5 items-center justify-center rounded-full text-sm text-neutral-200 ring-[1.5px] dark:ring-neutral-300',
        'hover:cursor-pointer',
        'relative',
        !isCompleted(stage) && !isFocussed(stage) && 'opacity-65',
        isCompleted(stage) && 'dark:ring-blue-80 dark:text-blue-400/80',
        isFocussed(stage) && 'dark:text-blue-400 dark:ring-blue-400',
      )}
      aria-label={`Stage ${stage}`}>
      {stage}
      <span className={cn('absolute -right-20 -bottom-7 -left-20 text-center opacity-65', isCompleted(stage) && 'opacity-80', isFocussed(stage) && 'opacity-95')}>{title}</span>
    </li>
  )
}

function RingConnector({ stage }: Stage) {
  const [animateFromDirection, setAnimation] = useState<'none' | 'left' | 'right'>('none')
  const prevShownStage = useRef<number | null>(null)

  const { stages, isCompleted, isFocussed, stage: stageState } = useMultiStageStore((state) => state)

  useEffect(() => {
    if (prevShownStage.current !== null && prevShownStage?.current < stageState) {
      //? we moved to the next stage
      setAnimation(isCompleted(stage) && stage === prevShownStage.current ? 'left' : 'none')
    } else if (prevShownStage.current !== null && prevShownStage.current > stageState) {
      //? we moved to the prev stage
      setAnimation(isFocussed(stage) ? 'right' : 'none')
    }

    prevShownStage.current = stageState
  }, [stageState])

  if (stage === stages.length) return

  return <Line animateFromDirection={animateFromDirection} className={cn(isCompleted(stage) && 'dark:text-blue-400/80')} />
}
