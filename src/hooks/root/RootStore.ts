import { createStore } from 'zustand/vanilla'

export type RootState = {
  theme_cookie: 'dark' | 'light' | undefined
}

export type RootStore = RootState

export const createRootStore = (initialState?: RootState) => {
  return createStore<RootStore>()(() => initialState || ({} as RootState))
}
