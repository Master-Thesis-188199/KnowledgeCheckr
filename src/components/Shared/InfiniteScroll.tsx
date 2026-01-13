/* eslint-disable enforce-logger-usage/no-console-in-server-or-async */
'use client'
import { ComponentType, createContext, Dispatch, SetStateAction, useCallback, useContext, useEffect, useRef, useState } from 'react'
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

export type InfinityScrollFetcherProps<F extends (...args: Any[]) => Promise<Any[]>> = {
  fetchProps?: Parameters<F>
  fetchItems: F & RequireOptionsLast<F>
  disabled?: boolean
  suspensionTimeout?: number
  loadingLabel?: string
}

const DEFAULT_SUSPENSION_TIMEOUT = 30 * 1000

type FetchStatus = 'hidden' | 'suspended' | 'pending' | 'error' | 'reset'

export function InfinityScrollFetcher<TFunc extends (...args: Any[]) => Promise<Any[]>>({
  fetchItems,
  fetchProps,
  disabled,
  suspensionTimeout = DEFAULT_SUSPENSION_TIMEOUT,
  loadingLabel,
}: InfinityScrollFetcherProps<TFunc>) {
  const { items } = useInfiniteScrollContext<unknown>()
  const [status, setStatus] = useState<FetchStatus>('hidden')
  const ref = useRef(null)
  const inView = useInView(ref)
  const refProps = useRef(fetchProps)

  const getItems = useFetchAction({ fetchItems, fetchProps, disabled, setStatus, status })

  useEffect(() => {
    if (status !== 'suspended') return

    const timeout = setTimeout(() => {
      console.debug('Revoked infinity-scroll fetch-suspension')
      setStatus('hidden')
    }, suspensionTimeout)

    return () => clearTimeout(timeout)
  }, [status, suspensionTimeout])

  useEffect(() => {
    if (isEqual(refProps.current, fetchProps)) return
    console.debug('----------')
    console.debug('Filter props have changed, resesting infinity items.')

    getItems(0, 'replace')

    refProps.current = fetchProps
  }, [fetchProps])

  useEffect(() => {
    if (status === 'reset' || status === 'pending') return

    // if (items.length === 0) return
    if (disabled) return
    if (!ref.current) return
    if (!inView) return

    if (status === 'suspended') {
      console.debug('[InfinityFetcher] Fetching currently suspended, aborting...')
      return
    }

    getItems(items.length, 'append')
  }, [inView, disabled, fetchItems, fetchProps, items.length])

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

function useFetchAction<TFunc extends (...args: Any[]) => Promise<Any[]>>({
  fetchItems,
  fetchProps,
  disabled,
  status,
  setStatus,
}: Pick<InfinityScrollFetcherProps<TFunc>, 'disabled' | 'fetchItems' | 'fetchProps'> & {
  setStatus: Dispatch<SetStateAction<FetchStatus>>
  status: FetchStatus
}) {
  const { addItems, setItems } = useInfiniteScrollContext<unknown>()

  const gatherItems = useCallback(
    async (offset: number, operation: 'append' | 'replace' = 'append') => {
      if (disabled) return
      if (status === 'pending') return

      //* Modify / Append offset to optional function-arguments
      const funcArgs = fetchProps ?? ([{ offset }] as [DatabaseOptions])
      if (funcArgs !== undefined) {
        // override / append offset
        const dbOptions = { ...fetchProps!.at(-1), offset } as DatabaseOptions

        // Expect "Error: This value cannot be modified"
        // eslint-disable-next-line react-hooks/immutability
        funcArgs[funcArgs!.length - 1] = dbOptions
      }

      setStatus('pending')

      return fetchItems
        .apply(null, funcArgs) // --> pass along the function-arguments with the modified / appended offset
        .then((newItems: unknown[]) => {
          if (newItems.length === 0 && operation === 'append') {
            console.warn('InfinityFetcher now temporarily suspended, because no new items exist.')
            return setStatus('suspended')
          } else if (newItems.length === 0 && operation === 'replace') {
            console.warn('Filters did not yield any results')
            setItems([])
            return setStatus('suspended')
          }

          console.debug(`Fetched ... ${newItems.length} new items..`, ...funcArgs)

          if (operation === 'append') addItems(newItems)
          else setItems(newItems)
          setStatus('hidden')
        })
        .catch((e: unknown) => {
          setStatus('error')
          console.error('[InfinityScroll]: Failed to fetch new items', e)
        })
    },
    [fetchItems, fetchProps, disabled],
  )

  return gatherItems
}
