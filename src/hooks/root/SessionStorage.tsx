'use client'

import { Any } from '@/types'
import _ from 'lodash'
import { createContext, useContext } from 'react'

interface SessionStorageContext {
  getStoredValue: <T extends object>(key: string, validation?: (value: T | null) => T | never) => T | null
  storeSessionValue: <T extends object>(key: string, value: T) => void
  cacheDuration: number
}

const Context = createContext<SessionStorageContext | undefined>(undefined)

export function SessionStorageProvider({ children, cacheDuration = 4 * 3600 * 1000 }: { children: React.ReactNode; cacheDuration?: number }) {
  function getStoredValue<T extends object = Any>(key: string, validation?: (value: T | null) => T | never): T | null {
    const item = JSON.parse(sessionStorage.getItem(key) || 'null')
    if (!item) return null

    if (!item?.session_savedAt || item.session_savedAt + cacheDuration < Date.now()) {
      console.warn('SessionStorageProvider: Item expired, removing from session storage', key)
      sessionStorage.removeItem(key)
      return null
    }

    delete item.session_savedAt

    return validation ? validation(item) : item
  }

  function storeSessionValue<T extends object>(key: string, value: T) {
    if (!window) return

    const existingValue = getStoredValue<T>(key)
    if (_.isEqual(existingValue, value)) return

    sessionStorage.setItem(key, JSON.stringify({ ...value, session_savedAt: Date.now() }))
  }

  return <Context.Provider value={{ getStoredValue, storeSessionValue, cacheDuration }}>{children}</Context.Provider>
}

export function useSessionStorageContext() {
  const context = useContext(Context)
  if (!context) {
    throw new Error('useSessionStorageContext must be used within a SessionStorageProvider')
  }
  return context
}
