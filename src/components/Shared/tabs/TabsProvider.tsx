'use client'

import { createContext, useContext, useState } from 'react'
import { Any } from '@/types'

export interface Tab extends Record<string, Any> {
  name: string
}

interface TabsContextProps {
  tabs: Array<Tab>
  currentTab: Tab['name']
  setCurrentTab: (tabId: Tab['name']) => void
}

const Context = createContext<TabsContextProps | undefined>(undefined)

export function useTabsContext() {
  const context = useContext(Context)

  if (!context) {
    throw new Error('useTabsContext must be used within a TabsProvider')
  }

  return context
}

export default function TabsProvider({ children, tabs, initialValue }: { children: React.ReactNode; tabs: Array<Tab>; initialValue?: Tab }) {
  const defaultValue = tabs.at(0)?.name ?? ''
  const [currentTab, setCurrentTab] = useState<Tab['name']>(initialValue?.name ?? defaultValue)

  return <Context.Provider value={{ currentTab, setCurrentTab, tabs }}>{children}</Context.Provider>
}
