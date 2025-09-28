'use client'

import { Stage, useMultiStageStore } from '@/src/components/Shared/MultiStageProgress/MultiStageStoreProvider'
import { cn } from '@/src/lib/Shared/utils'
import React from 'react'

export function MutliStageRenderer({ children, stage, className }: { children: React.ReactNode; stage: Stage['stage']; className?: string }) {
  const { stage: currentStage } = useMultiStageStore((store) => store)

  return <div className={cn(currentStage !== stage && 'hidden', className)}>{children}</div>
}
