'use client'

import _ from 'lodash'
import { createContext, useContext } from 'react'

interface SessionStorageContext {
  getStoredValue: <T extends object>(key: string, options?: { validation?: (value: T | null) => T | never; expiresAfter?: number }) => T | null
  storeSessionValue: <T extends object>(key: string, value: T) => void
  cacheDuration: number
}

const Context = createContext<SessionStorageContext | undefined>(undefined)

export function SessionStorageProvider({ children, defaultCacheDuration = 4 * 3600 * 1000 }: { children: React.ReactNode; defaultCacheDuration?: number }) {
  const getStoredValue: SessionStorageContext['getStoredValue'] = (key, options) => {
    //! Check if window is defined to avoid SSR issues
    if (typeof window === 'undefined') return null

    const item = JSON.parse(sessionStorage.getItem(key) ?? 'null')
    if (!item) return null

    if (options?.expiresAfter === 0) {
      //* Do not discard item -> does not expire
    } else if (!item?.session_savedAt || item.session_savedAt + (options?.expiresAfter ?? defaultCacheDuration) < Date.now()) {
      //? - is data marked as cache by having a save-date
      //? - is data expired (based on <expiredAfter> property or <defaultCacheDuration>)

      console.warn(`[Cache]: ${key} has expired.`)
      sessionStorage.removeItem(key)
      return null
    }

    delete item.session_savedAt

    return options?.validation ? options?.validation(item) : item
  }

  const storeSessionValue: SessionStorageContext['storeSessionValue'] = (key, value) => {
    if (!window) return

    const existingValue = getStoredValue(key)
    if (_.isEqual(existingValue, value)) return

    sessionStorage.setItem(key, JSON.stringify({ ...value, session_savedAt: Date.now() }))
  }

  return <Context.Provider value={{ getStoredValue, storeSessionValue, cacheDuration: defaultCacheDuration }}>{children}</Context.Provider>
}

export function useSessionStorageContext() {
  const context = useContext(Context)
  if (!context) {
    throw new Error('useSessionStorageContext must be used within a SessionStorageProvider')
  }
  return context
}
