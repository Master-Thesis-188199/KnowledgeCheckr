'use client'

import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react'

export interface Stage {
  stage: number
  title?: string
  description?: string
}

interface MultiStageProviderProps {
  stages: Stage[]
  stage: Stage['stage']
  setStage: Dispatch<SetStateAction<Stage['stage']>>

  nextStage: () => void
  previousStage: () => void
  isFocussed: (stage: Stage['stage']) => boolean
  isCompleted: (stage: Stage['stage']) => boolean
}

const Context = createContext<MultiStageProviderProps | null>(null)

export function MultiStageProvider({ children, stages }: { children: React.ReactNode; stages: Stage[] }) {
  const [stage, setStage] = useState<number>(1)

  const nextStage = () => setStage((prev) => (prev < stages.length ? prev + 1 : prev))
  const previousStage = () => setStage((prev) => (prev > 1 ? prev - 1 : prev))
  const isFocussed = (currentStage: number) => stage === currentStage
  const isCompleted = (currentState: number) => stage > currentState

  return <Context.Provider value={{ stages, stage, setStage, nextStage, previousStage, isFocussed, isCompleted }}>{children}</Context.Provider>
}

export function useMultiStageContext() {
  const context = useContext(Context)
  if (!context) throw new ReferenceError('useMultiStageContext must be used within a MultiStageProvider!')

  return context
}
