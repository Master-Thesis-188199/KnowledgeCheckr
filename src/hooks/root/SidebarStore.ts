import { createStore } from 'zustand/vanilla'

export type SidebarState = {
  isOpen: boolean
  isAnimationEnabled: boolean
}

export type SidebarActions = {
  toggleSidebar: () => void
  toggleAnimation: () => void
  setOpen: (state: boolean) => void
  setAnimation: (state: boolean) => void
  debounceClosure: (new_open_state: boolean) => void
}

export type SidebarStore = SidebarState & SidebarActions

export const defaultInitState: SidebarState = {
  isOpen: false,
  isAnimationEnabled: true,
}

export const createSidebarStore = ({ ...initState }: SidebarState = defaultInitState) => {
  return createStore<SidebarStore>()((set) => {
    const clousureDebounceTime = 500
    let closeTimer: ReturnType<typeof setTimeout> | null = null

    return {
      ...initState,
      toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
      toggleAnimation: () => set((state) => ({ isAnimationEnabled: !state.isAnimationEnabled })),
      setOpen: (open_state) => set(() => ({ isOpen: open_state })),
      setAnimation: (animation_state) => set(() => ({ isAnimationEnabled: animation_state })),
      debounceClosure: (new_open_state) => {
        if (new_open_state) {
          // When opening, cancel any pending close timer and update state immediately.
          if (closeTimer) {
            clearTimeout(closeTimer)
            closeTimer = null
          }
          set(() => ({ isOpen: true }))
        } else {
          // When closing, debounce the state change by 500ms.
          if (closeTimer) {
            clearTimeout(closeTimer)
          }
          closeTimer = setTimeout(() => {
            set(() => ({ isOpen: false }))
          }, clousureDebounceTime)
        }
      },
    }
  })
}
