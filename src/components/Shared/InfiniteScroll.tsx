'use client'
import { ComponentType, createContext, useContext, useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { cn } from '@/src/lib/Shared/utils'
import { Any } from '@/types'

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

export function InfinityScrollFetcher({ children, getItems }: { getItems: (offset: number) => Promise<unknown[]>; children: React.ReactNode }) {
  const { addItems, items } = useInfiniteScrollContext()
  const [status, setStatus] = useState<'done' | 'pending' | 'error'>('pending')
  const ref = useRef(null)
  const inView = useInView(ref)

  useEffect(() => {
    if (!ref.current) return
    if (!inView) return

    console.debug('Infinite Scroll - fetching new items...', getItems(10))
    setStatus('pending')
    getItems(items.length)
      .then((checks) => {
        console.debug(`Fetched ... ${checks.length} new items..`)
        return checks
      })
      .then(addItems)
      .then(() => setStatus('done'))
      .catch((e) => {
        setStatus('error')
        console.error('[InfinityScroll]: Failed to fetch new items', e)
      })
  }, [ref.current, inView])

  return (
    <div ref={ref} className={cn(status === 'pending' ? '' : 'opacity-0')}>
      {children}
    </div>
  )
}

export function InfinityScrollRenderer<TItem>({ component: Component }: { component: ComponentType<TItem> }) {
  const { items } = useInfiniteScrollContext<TItem>()

  return items.map((args, index) => <Component key={index} {...args} />)
}
