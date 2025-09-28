'use client'

import Line from '@/src/components/Shared/Line'
import { Stage, useMultiStageStore } from '@/src/components/Shared/MultiStageProgress/MultiStageStoreProvider'
import { cn } from '@/src/lib/Shared/utils'
import { Fragment, useEffect, useRef, useState } from 'react'

export function MultiStageProgressBar({ className }: { className?: string }) {
  const { stages } = useMultiStageStore((state) => state)

  return (
    <ol className={cn('@container mx-[12.5%] flex items-center justify-center gap-6 text-white/40 select-none', className)}>
      {stages.map((stage, i) => (
        <Fragment key={`Stage-${i}`}>
          <ProgressRing {...stage} />
          <RingConnector {...stage} />
        </Fragment>
      ))}
    </ol>
  )
}

/**
 * This hooks is used to filter out stages that should not be displayed on smaller screens.
 * The way it works, it always shows the first and last stage, and either the middle stage
 * or the currently selected stage a stage in-between is selected.
 * @returns Returns an object `{show: boolean, filtered: boolean}` that indicates whether a given stage should be shown or not.
 */
function useFilterStages_SmallScreens(stage: Stage['stage']) {
  const { isFocussed, stages, stage: currentStage } = useMultiStageStore((state) => state)

  const showConditions: boolean[] = [
    stage === 1,
    stage === stages.length,
    isFocussed(stage),
    //* Either display middle stage or the stage in-between that is currently displayed
    stage === Math.round(stages.length / 2) && (currentStage === 1 || currentStage === stages.length),
  ]

  if (stages.length <= 3) return { show: true, filtered: false }

  return { show: showConditions.some((cond) => cond === true), filtered: true }
}

function ProgressRing({ stage, title }: Stage) {
  const { isFocussed, setStage, isCompleted } = useMultiStageStore((state) => state)
  const { show: showOnSmallScreens } = useFilterStages_SmallScreens(stage)

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
        !showOnSmallScreens && 'hidden @sm:flex',
      )}
      aria-label={`Stage ${stage}`}>
      {stage}
      <span className={cn('absolute -right-20 -bottom-7 -left-20 text-center opacity-65', isCompleted(stage) && 'opacity-80', isFocussed(stage) && 'opacity-95')}>{title}</span>
    </li>
  )
}

function RingConnector({ stage }: Stage) {
  const { show: showOnSmallScreens } = useFilterStages_SmallScreens(stage)
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

  return (
    <Line
      // todo:  enable dashed for the remaining lines when not all lines are displayed, thus a small screen is used.
      animateFromDirection={animateFromDirection}
      animateStrokeColor={cn(animateFromDirection === 'left' && 'dark:text-blue-400/80', animateFromDirection === 'right' && 'dark:text-neutral-400')}
      className={cn(
        isCompleted(stage) && 'dark:text-blue-400/80',
        'duration-initial',
        animateFromDirection !== 'left' && 'transition-colors duration-[1250ms]',
        !showOnSmallScreens && 'hidden @sm:flex',
      )}
    />
  )
}
