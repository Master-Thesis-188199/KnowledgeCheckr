'use client'
import { getKnowledgeChecksByOwner } from '@/database/knowledgeCheck/select'
import { KnowledgeCheckCard } from '@/src/components/check/KnowledgeCheckCard'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'
import { Any } from '@/types'
import { useInView } from 'framer-motion'
import { createContext, useContext, useEffect, useRef, useState } from 'react'
import { JSX } from 'react/jsx-runtime'

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

export function InfinityScrollFetcher({ user_id }: { user_id: string }) {
  const { addItems, items } = useInfiniteScrollContext()
  const ref = useRef(null)
  const inView = useInView(ref)

  useEffect(() => {
    if (!ref.current) return
    if (!inView) return

    console.log('Infinite Scroll - fetching new items...')
    getKnowledgeChecksByOwner(user_id, { offset: items.length })
      .then((checks) => {
        console.log(`Fetched ... ${checks.length} new checks..`)
        return checks
      })
      .then(addItems)
  }, [ref.current, inView])

  return <div ref={ref}>Loading...</div>
}

export function InfinityScrollRenderer<TItem extends KnowledgeCheck>({ render }: { render: (item: TItem, index: number, array: TItem[]) => Promise<JSX.Element> }) {
  const { items } = useInfiniteScrollContext<TItem>()

  return items.map((check, i) => <KnowledgeCheckCard key={i} {...check} />)
}
