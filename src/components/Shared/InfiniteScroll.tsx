'use client'
import { ComponentType, createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
import { isEqual } from 'lodash'
import { LoaderCircleIcon } from 'lucide-react'
import { DatabaseOptions, RequireOptionsLast } from '@/database/knowledgeCheck/type'
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

  const addItems: InfiniteScrollContext<TElement>['addItems'] = useCallback((items) => setItems((prev) => prev.concat(items)), [])
  const reset = () => setItems(initialItems)

  return <InfiniteScrollContext.Provider value={{ items, setItems, addItems, reset }}>{children}</InfiniteScrollContext.Provider>
}

export function useInfiniteScrollContext<TElement>() {
  const context = useContext(InfiniteScrollContext)

  if (!context) throw new Error('useInfiniteScrollContext must be used within a InfiniteScrollProvider')

  return context as InfiniteScrollContext<TElement>
}
export type AsyncItemsFn = (...args: Any[]) => Promise<readonly Any[]>

// Enforce: last param exists, is assignable to DatabaseOptions, and is REQUIRED
export type EnforceLastDbOptions<TFunc extends AsyncItemsFn> =
  Parameters<TFunc> extends [...infer _Rest, infer Last] ? (Last extends DatabaseOptions ? (undefined extends Last ? never : TFunc) : never) : never

// Ergonomic fetchProps:
// - 1 arg (options only): object
// - 2+ args: tuple ending in options
export type FetchPropsFor<TFunc extends AsyncItemsFn> =
  Parameters<TFunc> extends [infer Opts extends DatabaseOptions] ? Partial<Opts> : Parameters<TFunc> extends [...infer Rest, infer Opts extends DatabaseOptions] ? [...Rest, Partial<Opts>] : never

// Extract array element type safely

export type InfinityScrollFetcherProps<F extends (...args: Any[]) => Promise<Any[]>> = {
  fetchProps?: Parameters<F>
  fetchItems: F & RequireOptionsLast<F>
  disabled?: boolean
  suspensionTimeout?: number
  loadingLabel?: string
}

const DEFAULT_SUSPENSION_TIMEOUT = 30 * 1000

export function InfinityScrollFetcher<TFunc extends (...args: Any[]) => Promise<Any[]>>({
  fetchItems: getItems,
  fetchProps,
  disabled,
  suspensionTimeout = DEFAULT_SUSPENSION_TIMEOUT,
  loadingLabel,
}: InfinityScrollFetcherProps<TFunc>) {
  const { addItems, items, setItems } = useInfiniteScrollContext<unknown>()
  const [status, setStatus] = useState<'hidden' | 'suspended' | 'pending' | 'error' | 'reset'>('hidden')
  const ref = useRef(null)
  const inView = useInView(ref)
  const refProps = useRef(fetchProps)

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

    if (isEqual(refProps.current, fetchProps)) return
    console.debug('----------')
    console.debug('Filter props have changed, resesting infinity items.')
    setStatus('reset')

    if (disabled) return
    if (!ref.current) return

    //* Modify / Append offset to optional function-arguments
    const funcArgs = fetchProps ?? ([{ offset: 0 }] as [DatabaseOptions])
    if (funcArgs !== undefined) {
      // override / append offset
      const dbOptions = { ...fetchProps!.at(-1), offset: 0 } as DatabaseOptions

      // Expect "Error: This value cannot be modified"
      // eslint-disable-next-line react-hooks/immutability
      funcArgs[funcArgs!.length - 1] = dbOptions
    }

    setStatus('pending')

    getItems
      .apply(null, funcArgs) // --> pass along the function-arguments with the modified / appended offset
      .then((newItems: unknown[]) => {
        if (aborted) return

        if (newItems.length === 0) {
          console.warn('InfinityFetcher now temporarily suspended, because no new items exist.', funcArgs)
          return setStatus('suspended')
        }

        console.debug(`Fetched ... ${newItems.length} new items..`)

        setItems(newItems)
        setStatus('hidden')
      })
      .catch((e: unknown) => {
        setStatus('error')
        console.error('[InfinityScroll]: Failed to fetch new items', e)
      })

    refProps.current = fetchProps

    return () => {
      // gets called twice per load --> first fetch is made  -> adds Item --> trigers re-render --> triggers abortion of secondary fetch-request caused by re-render
      aborted = true
      // disable pending state when fetch is aborted
      setStatus((prev) => (prev === 'pending' ? 'hidden' : prev))
    }
  }, [fetchProps])

  useEffect(() => {
    let aborted = false
    if (status === 'reset' || status === 'pending') return

    // if (items.length === 0) return
    if (disabled) return
    if (!ref.current) return
    if (!inView) return

    if (status === 'suspended') {
      console.debug('[InfinityFetcher] Fetching currently suspended, aborting...')
      return
    }

    //* Modify / Append offset to optional function-arguments
    const funcArgs = fetchProps ?? ([{ offset: items.length }] as [DatabaseOptions])
    if (funcArgs !== undefined) {
      // override / append offset
      const dbOptions = { ...fetchProps!.at(-1), offset: items.length } as DatabaseOptions

      // Expect "Error: This value cannot be modified"
      // eslint-disable-next-line react-hooks/immutability
      funcArgs[funcArgs!.length - 1] = dbOptions
    }

    setStatus('pending')

    getItems
      .apply(null, funcArgs) // --> pass along the function-arguments with the modified / appended offset
      .then((newItems: unknown[]) => {
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
      // gets called twice per load --> first fetch is made  -> adds Item --> trigers re-render --> triggers abortion of secondary fetch-request caused by re-render
      aborted = true
      // disable pending state when fetch is aborted
      setStatus((prev) => (prev === 'pending' ? 'hidden' : prev))
    }
  }, [inView, disabled, getItems, fetchProps, addItems, items.length])

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
