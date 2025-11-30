'use client'

import React from 'react'
import { Stage, useMultiStageStore } from '@/src/components/Shared/MultiStageProgress/MultiStageStoreProvider'
import { cn } from '@/src/lib/Shared/utils'

export function MutliStageRenderer({ children, stage, className }: { children: React.ReactNode; stage: Stage['stage']; className?: string }) {
  const { stage: currentStage } = useMultiStageStore((store) => store)

  if (currentStage !== stage) return null

  return <div className={cn(currentStage !== stage && 'hidden', className)}>{children}</div>
}
