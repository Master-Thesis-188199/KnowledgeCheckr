'use client'
import { ComponentType, createContext, useContext, useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { isEqual } from 'lodash'
import { LoaderCircleIcon } from 'lucide-react'
import SmoothPresenceTransition from '@/src/components/Shared/Animations/SmoothPresenceTransition'
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

  useEffect(() => {
    if (isEqual(items, initialItems)) return

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(initialItems)
  }, [initialItems])

  const addItems: InfiniteScrollContext<TElement>['addItems'] = (items) => setItems((prev) => prev.concat(items))
  const reset = () => setItems(initialItems)

  return <InfiniteScrollContext.Provider value={{ items, setItems, addItems, reset }}>{children}</InfiniteScrollContext.Provider>
}

export function useInfiniteScrollContext<TElement>() {
  const context = useContext(InfiniteScrollContext)

  if (!context) throw new Error('useInfiniteScrollContext must be used within a InfiniteScrollProvider')

  return context as InfiniteScrollContext<TElement>
}

export type InfinityScrollFetcherProps<TFunc extends (...args: Any[]) => Promise<Any>> = {
  fetchProps?: Partial<Parameters<TFunc>['0']> & { offset?: number }
  fetchItems: TFunc
  disabled?: boolean
  suspensionTimeout?: number
  loadingLabel?: string
}

const DEFAULT_SUSPENSION_TIMEOUT = 30 * 1000

export function InfinityScrollFetcher<TFunc extends (...args: Any[]) => Promise<Any>, TItem extends Awaited<ReturnType<TFunc>>[number]>({
  fetchItems,
  fetchProps,
  disabled,
  suspensionTimeout = DEFAULT_SUSPENSION_TIMEOUT,
  loadingLabel,
}: InfinityScrollFetcherProps<TFunc>) {
  const { addItems, items } = useInfiniteScrollContext<TItem>()
  const [status, setStatus] = useState<'hidden' | 'suspended' | 'pending' | 'error'>('hidden')
  const ref = useRef(null)
  const inView = useInView(ref)

  useEffect(() => {
    if (status !== 'suspended') return

    const timeout = setTimeout(() => {
      console.debug('Revoked infinity-scroll fetch-suspension')
      setStatus('hidden')
    }, suspensionTimeout)

    return () => clearTimeout(timeout)
  }, [status, suspensionTimeout])

  useEffect(() => {
    let aborted = false

    if (disabled) return
    if (!ref.current) return
    if (!inView) return
    if (status === 'suspended') {
      console.debug('[InfinityFetcher] Fetching currently suspended, aborting...')
      return
    }

    const funcArgs: NonNullable<typeof fetchProps> = { ...fetchProps, offset: fetchProps?.offset ?? items.length }
    console.debug('Infinite Scroll - fetching new items... with ', funcArgs)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStatus('pending')
    fetchItems(funcArgs)
      .then((newItems: TItem) => {
        if (aborted) return

        if (newItems.length === 0) {
          console.warn('InfinityFetcher now temporarily suspended, because no new items exist.')
          return setStatus('suspended')
        }

        console.debug(`Fetched ... ${newItems.length} new items..`)

        addItems(newItems)
        setStatus('hidden')
      })
      .catch((e: unknown) => {
        setStatus('error')
        console.error('[InfinityScroll]: Failed to fetch new items', e)
      })

    return () => {
      aborted = true
      // disable pending state when fetch is aborted
      setStatus((prev) => (prev === 'pending' ? 'hidden' : prev))
    }
  }, [inView, disabled, fetchItems, fetchProps, addItems])

  return (
    <>
      <div ref={ref} className='h-1' />

      <SmoothPresenceTransition
        id='infinity-fetcher-loading-indicator'
        active={status === 'pending'}
        presenceTiming={{ minVisibleMs: 550 }}
        initial={{ opacity: 0, height: 0 }}
        animate={{ opacity: 1, height: 'auto' }}
        exit={{ opacity: 0, height: 0, margin: 0 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className='mt-8 flex justify-center gap-2'>
        <LoaderCircleIcon className='animate-spin' />
        {loadingLabel ?? 'Loading...'}
      </SmoothPresenceTransition>
    </>
  )
}

export function InfinityScrollRenderer<TItem>({ component: Component }: { component: ComponentType<TItem> }) {
  const { items } = useInfiniteScrollContext<TItem>()

  return items.map((args, index) => <Component key={index} {...args} />)
}
