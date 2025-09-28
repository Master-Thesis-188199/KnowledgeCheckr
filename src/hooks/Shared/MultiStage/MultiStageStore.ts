import { Stage } from '@/src/components/Shared/MultiStageProgress/MultiStageStoreProvider'
import { createStore } from 'zustand/vanilla'

export type MultiStageState = {
  stages: Stage[]
  stage: Stage['stage']
}

export type MultiStageActions = {
  nextStage: () => void
  previousStage: () => void
  isFocussed: (stage: Stage['stage']) => boolean
  isCompleted: (stage: Stage['stage']) => boolean
  setStage: (stage: Stage['stage']) => void
}

export type MultiStageStore = MultiStageState & MultiStageActions

const defaultState: MultiStageState = {
  stage: 1,
  stages: [],
}

export const createMultiStageStore = ({ ...initState }: MultiStageState | undefined) => {
  return createStore<MultiStageStore>()((set, get) => {
    return {
      ...defaultState,
      ...initState,
      nextStage: () => set((prev) => ({ stage: prev.stage < prev.stages.length ? prev.stage + 1 : prev.stage })),
      previousStage: () => set((prev) => ({ stage: prev.stage > 1 ? prev.stage - 1 : prev.stage })),
      isCompleted: (stage: Stage['stage']) => get().stage > stage && stage >= 1,
      isFocussed: (stage: Stage['stage']) => get().stage === stage,
      setStage: (stage: Stage['stage']) => set(() => ({ stage })),
    }
  })
}
