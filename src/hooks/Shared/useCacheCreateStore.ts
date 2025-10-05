import { useSessionStorageContext } from '@/src/hooks/root/SessionStorage'
import { StoreCachingOptions, StoreState_fromStore, WithCaching, ZustandStore } from '@/types/Shared/ZustandStore'
import { useRef } from 'react'

export type useCacheCreateStoreOptions<T> = StoreCachingOptions & {
  expiresAfter?: number
  discardCache?: (cached: T | null) => boolean
}

/**
 * This hook implements the cache-restoration of a store's state
 * @param session_key The session-key under which the cached data is stored in the sessionStorage
 * @param createStoreFunc The function which initializes the store
 * @param initialStoreProps The initial properties that are being used when no data is cached
 */
export default function useCacheCreateStore<Store extends object>(
  session_key: string,
  createStoreFunc: WithCaching<ZustandStore<Store>>,
  initialStoreProps?: StoreState_fromStore<Store>,
  options?: useCacheCreateStoreOptions<StoreState_fromStore<Store>>,
): ReturnType<typeof createStoreFunc> {
  const { getStoredValue } = useSessionStorageContext()
  const storeRef = useRef<ReturnType<typeof createStoreFunc>>(null)

  if (!storeRef.current) {
    const cached = getStoredValue<StoreState_fromStore<Store>>(session_key, { expiresAfter: options?.expiresAfter })
    let props = cached ?? initialStoreProps

    if (options?.discardCache && options.discardCache(cached)) {
      console.debug(`Discarding cached store ('${session_key}') because discardCache() returned true`)
      props = initialStoreProps
    }

    if (options?.disableCache) {
      props = initialStoreProps
    }

    storeRef.current = createStoreFunc(props, options)
  }

  return storeRef.current
}
