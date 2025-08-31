'use client'
import { Any } from '@/types'
import { useInView } from 'framer-motion'
import { ComponentType, createContext, useContext, useEffect, useRef, useState } from 'react'

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

export function InfinityScrollFetcher({ getItems }: { getItems: (offset: number) => Promise<unknown[]> }) {
  const { addItems, items } = useInfiniteScrollContext()
  const ref = useRef(null)
  const inView = useInView(ref)

  useEffect(() => {
    if (!ref.current) return
    if (!inView) return

    console.log('Infinite Scroll - fetching new items...')
    getItems(items.length)
      .then((checks) => {
        console.log(`Fetched ... ${checks.length} new items..`)
        return checks
      })
      .then(addItems)
  }, [ref.current, inView])

  return <div ref={ref}>Loading...</div>
}

export function InfinityScrollRenderer<TItem>({ component: Component }: { component: ComponentType<TItem> }) {
  const { items } = useInfiniteScrollContext<TItem>()

  return items.map((args, index) => <Component key={index} {...args} />)
}
