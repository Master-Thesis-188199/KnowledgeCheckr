'use client'

import React from 'react'
import { Stage, useMultiStageStore } from '@/src/components/Shared/MultiStageProgress/MultiStageStoreProvider'

export function MutliStageRenderer({ children, stage }: { children: React.ReactNode; stage: Stage['stage'] }) {
  const { stage: currentStage } = useMultiStageStore((store) => store)

  if (currentStage !== stage) return null

  return <>{children}</>
}
