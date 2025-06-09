'use client'

import { Any } from '@/types'
import { createContext, useContext, useState } from 'react'

export interface Tab extends Record<string, Any> {
  name: string
}

interface TabsContextProps {
  tabs: Array<Tab>
  currentTab: Tab['name']
  setCurrentTab: (tabId: Tab['name']) => void
}

const Context = createContext({} as TabsContextProps)

export function useTabsContext() {
  const context = useContext(Context)

  if (!context) {
    throw new Error('useTabsContext must be used within a TabsProvider')
  }

  return context
}

export default function TabsProvider({ children, tabs, currentTab: externalTabState }: { children: React.ReactNode; tabs: Array<Tab>; currentTab?: Tab }) {
  const [currentTab, setCurrentTab] = useState<Tab['name']>(tabs.at(0)?.name || '')

  const value: TabsContextProps = {
    currentTab: externalTabState?.name || currentTab,
    setCurrentTab,
    tabs,
  }

  return <Context.Provider value={value}>{children}</Context.Provider>
}
