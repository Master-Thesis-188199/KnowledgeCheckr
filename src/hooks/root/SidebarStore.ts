import { createStore } from 'zustand/vanilla'
import { SideBarProps } from '@/components/root/Navigation/SideBar'
import { sideBarConfiguration } from '@/components/root/Navigation/SideBarConfiguration'
import { useSessionStorageContext } from '@/src/hooks/root/SessionStorage'

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

export const createSidebarStore = ({ ...initState }: SidebarState = defaultInitState) => {
  return createStore<SidebarStore>()((set) => {
    const { storeSessionValue } = useSessionStorageContext()
    const sessionStorageDebounceTime = 150
    let storeTimer: ReturnType<typeof setTimeout> | null = null

    const clousureDebounceTime = 500
    let closeTimer: ReturnType<typeof setTimeout> | null = null

    function modifyState(func: (prev: SidebarState) => SidebarStore | Partial<SidebarState>) {
      set((prev) => {
        if (storeTimer) {
          clearTimeout(storeTimer)
        }

        const update = { ...prev, ...func(prev) }

        storeTimer = setTimeout(() => {
          storeSessionValue('sidebar-store', { ...update, config: {} })
        }, sessionStorageDebounceTime)

        return update
      })
    }

    return {
      ...initState,
      toggleSidebar: () => modifyState((state) => (!state.isAnimationEnabled ? state : { isOpen: !state.isOpen })),
      toggleAnimation: () => modifyState((state) => ({ isAnimationEnabled: state.canDeviceHover ? !state.isAnimationEnabled : state.isAnimationEnabled })),
      setOpen: (open_state) => modifyState(() => ({ isOpen: open_state })),
      setAnimation: (animation_state) => modifyState(() => ({ isAnimationEnabled: animation_state })),
      debounceClosure: (new_open_state) => {
        if (new_open_state) {
          // When opening, cancel any pending close timer and update state immediately.
          if (closeTimer) {
            clearTimeout(closeTimer)
            closeTimer = null
          }
          modifyState(() => ({ isOpen: true }))
        } else {
          // When closing, debounce the state change by 500ms.
          if (closeTimer) {
            clearTimeout(closeTimer)
          }
          closeTimer = setTimeout(() => {
            modifyState((state) => ({ isOpen: state.isAnimationEnabled ? false : state.isOpen }))
          }, clousureDebounceTime)
        }
      },
      setDeviceHoverable: (hoverable) => modifyState(() => ({ isAnimationEnabled: hoverable, canDeviceHover: hoverable })),
    }
  })
}
