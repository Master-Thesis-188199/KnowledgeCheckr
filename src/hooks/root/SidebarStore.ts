import { createZustandStore } from '@/src/hooks/Shared/zustand/createZustandStore'
import { WithCaching, ZustandStore } from '@/types/Shared/ZustandStore'

export type SidebarState = {
  isOpen: boolean
  canDeviceHover: boolean
  isPinned: boolean
  // config: SideBarProps
}

export type SidebarActions = {
  toggleSidebar: () => void
  togglePinned: () => void
  setOpen: (state: boolean) => void
  debounceClosure: (new_open_state: boolean) => void
  setDeviceHoverable: (hoverable: boolean) => void
}

export type SidebarStore = SidebarState & SidebarActions

export const defaultInitState: SidebarState = {
  isOpen: false,
  isPinned: false,
  canDeviceHover: true,
}

export const createSidebarStore: WithCaching<ZustandStore<SidebarStore>> = ({ initialState = defaultInitState, options }) =>
  createZustandStore({
    caching: true,
    options,
    initializer: (set) => {
      const clousureDebounceTime = 500
      let closeTimer: ReturnType<typeof setTimeout> | null = null

      return {
        ...initialState,
        toggleSidebar: () => set((state) => (!state.isPinned ? { isOpen: !state.isOpen } : {})),
        togglePinned: () => set((state) => ({ isPinned: !state.isPinned })),
        setOpen: (open_state) => set(() => ({ isOpen: open_state })),
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
              // close the sidebar after the debounce time unless it is pinned
              set((state) => ({ isOpen: state.isPinned ? state.isOpen : false }))
            }, clousureDebounceTime)
          }
        },
        setDeviceHoverable: (hoverable) => set(() => ({ canDeviceHover: hoverable })),
      }
    },
  })
