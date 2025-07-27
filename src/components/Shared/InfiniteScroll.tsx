'use client'
import { Any } from '@/types'
import { createContext, useContext, useState } from 'react'

interface InfiniteScrollContext<T = Any> {
  items: T[]
  setItems: (items: T[]) => void
  addItems: (items: T[]) => void
  reset: () => void
}

const InfiniteScrollContext = createContext<InfiniteScrollContext | undefined>(undefined)

export function InfiniteScrollProvider<TElement>({ initialItems, children }: { children: React.ReactNode; initialItems: TElement[] }) {
  const [items, setItems] = useState<TElement[]>(initialItems)

  const addItems: InfiniteScrollContext<TElement>['addItems'] = (items) => setItems((prev) => prev.concat(items))
  const reset = () => setItems(initialItems)

  return <InfiniteScrollContext.Provider value={{ items, setItems, addItems, reset }}>{children}</InfiniteScrollContext.Provider>
}

export function useInfiniteScrollContext<TElement>() {
  const context = useContext(InfiniteScrollContext)

  if (!context) throw new Error('useInfiniteScrollContext must be used within a InfiniteScrollProvider')

  return context as InfiniteScrollContext<TElement>
}
