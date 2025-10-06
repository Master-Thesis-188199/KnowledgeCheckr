import { SideBarProps } from '@/components/root/Navigation/SideBar'
import { sideBarConfiguration } from '@/components/root/Navigation/SideBarConfiguration'
import { createZustandStore } from '@/src/hooks/Shared/zustand/createZustandStore'
import { WithCaching, ZustandStore } from '@/types/Shared/ZustandStore'

export type SidebarState = {
  isOpen: boolean
  canDeviceHover: boolean
  isAnimationEnabled: boolean
  config: SideBarProps
}

export type SidebarActions = {
  toggleSidebar: () => void
  toggleAnimation: () => void
  setOpen: (state: boolean) => void
  setAnimation: (state: boolean) => void
  debounceClosure: (new_open_state: boolean) => void
  setDeviceHoverable: (hoverable: boolean) => void
}

export type SidebarStore = SidebarState & SidebarActions

export const defaultInitState: SidebarState = {
  isOpen: false,
  isAnimationEnabled: true,
  config: sideBarConfiguration,
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
        config: {} as SidebarStore['config'], //* cannot store jsx elements in session-store (converting their circular structure to json fails)
        toggleSidebar: () => set((state) => (!state.isAnimationEnabled ? state : { isOpen: !state.isOpen })),
        toggleAnimation: () => set((state) => ({ isAnimationEnabled: state.canDeviceHover ? !state.isAnimationEnabled : state.isAnimationEnabled })),
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
              set((state) => ({ isOpen: state.isAnimationEnabled ? false : state.isOpen }))
            }, clousureDebounceTime)
          }
        },
        setDeviceHoverable: (hoverable) => set(() => ({ isAnimationEnabled: hoverable, canDeviceHover: hoverable })),
      }
    },
  })
