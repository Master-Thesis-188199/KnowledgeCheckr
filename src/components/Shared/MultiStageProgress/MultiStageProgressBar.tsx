'use client'

import Line from '@/src/components/Shared/Line'
import { Stage, useMultiStageContext } from '@/src/components/Shared/MultiStageProgress/MultiStageProvider'
import { cn } from '@/src/lib/Shared/utils'
import { Fragment } from 'react'

export function MultiStageProgressBar() {
  const { stages } = useMultiStageContext()

  return (
    <ol className='mx-[12.5%] -mt-6 mb-8 flex items-center justify-center gap-6 text-white/40 select-none'>
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
  const { isFocussed, setStage, isCompleted } = useMultiStageContext()

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
  const { stages, isCompleted } = useMultiStageContext()

  if (stage === stages.length) return

  return <Line className={cn(isCompleted(stage) && 'dark:text-blue-400/80')} />
}
