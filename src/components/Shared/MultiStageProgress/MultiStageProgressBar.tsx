'use client'

import { Fragment, useEffect, useRef, useState } from 'react'
import Line from '@/src/components/Shared/Line'
import { Stage, useMultiStageStore } from '@/src/components/Shared/MultiStageProgress/MultiStageStoreProvider'
import { cn } from '@/src/lib/Shared/utils'

export function MultiStageProgressBar({ className }: { className?: string }) {
  const { stages, stage } = useMultiStageStore((state) => state)
  const condensedStages = [1, stage > 1 && stage < stages.length ? stage : Math.round(stages.length / 2), stages.length]

  const sharedStageListClasses = '@container items-center justify-center gap-6 text-white/40 select-none'

  return (
    <div className='@container/stages mx-[12.5%]' id='multi-stage-list-parent'>
      {/* //* classes needed at build-time to dynamically construct them at runtime
      @[6rem]/stages:flex  (1 stage)
      @[12rem]/stages:flex (2 stages)
      @[18rem]/stages:flex (3 stages)
      @[24rem]/stages:flex (4 stages)
      @[30rem]/stages:flex (5 stages)
      @[36rem]/stages:flex (6 stages)
      @[42rem]/stages:flex (7 stages)
      @[48rem]/stages:flex (8 stages)
      @[52rem]/stages:flex (9 stages)
      */}
      <ol className={cn(sharedStageListClasses, `hidden @[${stages.length * 6}rem]/stages:flex`, className)}>
        {stages.map((stage, i) => (
          <Fragment key={`Stage-${i}`}>
            <ProgressRing {...stage} />
            <RingConnector {...stage} />
          </Fragment>
        ))}
      </ol>

      {/* //* classes needed at build-time to dynamically construct them at runtime
      @[6rem]/stages:hidden  (1 stage)
      @[12rem]/stages:hidden (2 stages)
      @[18rem]/stages:hidden (3 stages)
      @[24rem]/stages:hidden (4 stages)
      @[30rem]/stages:hidden (5 stages)
      @[36rem]/stages:hidden (6 stages)
      @[42rem]/stages:hidden (7 stages)
      @[48rem]/stages:hidden (8 stages)
      @[52rem]/stages:hidden (9 stages)
      */}
      <ol id='condensed-stage-list' className={cn(sharedStageListClasses, `flex @[${stages.length * 6}rem]/stages:hidden `, className)}>
        {stages
          .filter((s) => condensedStages.includes(s.stage))
          .map((stage, i) => (
            <Fragment key={`Stage-${i}`}>
              <ProgressRing {...stage} />
              <RingConnector {...stage} dashed />
            </Fragment>
          ))}
      </ol>
    </div>
  )
}

/**
 * This hooks is used to filter out stages that should not be displayed on smaller screens.
 * The way it works, it always shows the first and last stage, and either the middle stage
 * or the currently selected stage a stage in-between is selected.
 * @returns Returns an object `{show: boolean, filtered: boolean}` that indicates whether a given stage should be shown or not.
 */
function useFilterStages_SmallScreens(stage: Stage['stage']) {
  const { stages, stage: currentStage } = useMultiStageStore((state) => state)

  if (stages.length <= 3) return { show: true, filtered: false }

  const condensedStages = [1, currentStage > 1 && currentStage < stages.length ? currentStage : Math.round(stages.length / 2), stages.length]

  return { show: condensedStages.some((s) => s === stage), filtered: true }
}

function ProgressRing({ stage, title }: Stage) {
  const { isFocussed, setStage, isCompleted } = useMultiStageStore((state) => state)
  const { show: showOnSmallScreens } = useFilterStages_SmallScreens(stage)

  return (
    <li
      onClick={() => setStage(stage)}
      data-active={isFocussed(stage)}
      data-stage-name={title?.toLowerCase()}
      className={cn(
        'flex size-5 min-w-5 items-center justify-center rounded-full text-sm text-neutral-700 ring-[1.5px] ring-neutral-600 dark:text-neutral-200 dark:ring-neutral-300',
        'hover:cursor-pointer',
        'relative',
        !isCompleted(stage) && !isFocussed(stage) && 'opacity-75 dark:opacity-65',
        isCompleted(stage) && 'text-blue-500/80 ring-blue-400/80 dark:text-blue-400 dark:ring-blue-400/80',
        isFocussed(stage) && 'text-blue-500 ring-blue-500 dark:text-blue-400 dark:ring-blue-400',
        !showOnSmallScreens && 'hidden @sm:flex',
      )}
      aria-label={`Stage ${stage}`}>
      {stage}
      <span
        className={cn(
          'absolute -right-12 -bottom-7 -left-12 text-center text-xs opacity-75 @xs:text-sm dark:opacity-65',
          isCompleted(stage) && 'opacity-80 dark:opacity-80',
          isFocussed(stage) && 'opacity-95 dark:opacity-95',
        )}>
        {title}
      </span>
    </li>
  )
}

function RingConnector({ stage, dashed }: Stage & { dashed?: boolean }) {
  const { show: showOnSmallScreens } = useFilterStages_SmallScreens(stage)
  const [animateFromDirection, setAnimation] = useState<'none' | 'left' | 'right'>('none')
  const prevShownStage = useRef<number | null>(null)

  const { stages, isCompleted, isFocussed, stage: stageState } = useMultiStageStore((state) => state)

  useEffect(() => {
    if (prevShownStage.current !== null && prevShownStage?.current < stageState) {
      //? we moved to the next stage
      // eslint-disable-next-line react-hooks/set-state-in-effect
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
      dashed={dashed}
      animateFromDirection={animateFromDirection}
      animateStrokeColor={cn(animateFromDirection === 'left' && 'dark:text-blue-400/80 text-blue-500/80', animateFromDirection === 'right' && 'dark:text-neutral-400 text-neutral-700')}
      className={cn(
        'text-neutral-400 dark:text-inherit',
        isCompleted(stage) && 'text-blue-500/80 dark:text-blue-400/80',
        'duration-initial',
        animateFromDirection !== 'left' && 'transition-colors duration-[1250ms]',
        !showOnSmallScreens && 'hidden @sm:flex',
      )}
    />
  )
}
