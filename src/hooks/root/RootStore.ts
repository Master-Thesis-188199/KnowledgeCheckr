import { createZustandStore } from '@/src/hooks/Shared/zustand/createZustandStore'
import { ZustandStore } from '@/types/Shared/ZustandStore'

export type RootState = {
  theme_cookie: 'dark' | 'light' | undefined
}

export type RootStore = RootState
export const createRootStore: ZustandStore<RootStore> = ({ initialState = { theme_cookie: undefined } }) =>
  createZustandStore({
    caching: false,
    initializer: () => {
      return initialState
    },
  })
