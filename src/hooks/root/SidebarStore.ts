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
}

export type SidebarStore = SidebarState & SidebarActions

export const defaultInitState: SidebarState = {
  isOpen: false,
  isAnimationEnabled: true,
}

export const createSidebarStore = (initState: SidebarState = defaultInitState) => {
  return createStore<SidebarStore>()((set) => ({
    ...initState,
    toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
    toggleAnimation: () => set((state) => ({ isAnimationEnabled: !state.isAnimationEnabled })),
    setOpen: (open_state) => set(() => ({ isOpen: open_state })),
    setAnimation: (animation_state) => set(() => ({ isAnimationEnabled: animation_state })),
  }))
}
