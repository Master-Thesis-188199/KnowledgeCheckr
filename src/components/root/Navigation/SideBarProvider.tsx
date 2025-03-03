'use client'

import { createContext, useContext, useState } from 'react'
import { SideBarProps } from '@/components/root/Navigation/SideBar'

interface SideBarContextProps {
  isAnimationEnabled: boolean
  isOpen: boolean
  setOpen: (isOpen: boolean) => void
  config: SideBarProps
}

const Context = createContext<SideBarContextProps>({} as never)

export function useSideBarContext() {
  const context = useContext(Context)
  if (!context) {
    throw new Error('useSidebarContext must be used within a SideBarProvider')
  }
  return context
}

export default function SideBarProvider({ children, isAnimationEnabled, config }: { children: React.ReactNode; config: SideBarProps } & Partial<Pick<SideBarContextProps, 'isAnimationEnabled'>>) {
  const [isOpen, setOpen] = useState(false)

  return <Context.Provider value={{ isOpen, setOpen, isAnimationEnabled: isAnimationEnabled || true, config }}>{children}</Context.Provider>
}
