import { useSessionStorageContext } from '@/src/hooks/root/SessionStorage'
import { CreateStoreType } from '@/types/Shared/CreateStoreType'
import { useRef } from 'react'

/**
 * This hook implements the cache-restoration of a store's state
 * @param session_key The session-key under which the cached data is stored in the sessionStorage
 * @param createStoreFunc The function which initializes the store
 * @param initialStoreProps The initial properties that are being used when no data is cached
 */
export default function useCacheCreateStore<StoreState extends object>(
  session_key: string,
  createStoreFunc: CreateStoreType<StoreState>,
  initialStoreProps?: StoreState,
  options?: { expiresAfter?: number; discardCache?: (cached: StoreState | null) => boolean },
): ReturnType<typeof createStoreFunc> {
  const { getStoredValue } = useSessionStorageContext()
  const storeRef = useRef<ReturnType<typeof createStoreFunc>>(null)

  if (!storeRef.current) {
    const cached = getStoredValue<StoreState>(session_key, { expiresAfter: options?.expiresAfter })
    let props = cached ?? initialStoreProps

    if (options?.discardCache && options.discardCache(cached)) {
      console.debug(`Discarding cached store ('${session_key}') because discardCache() returned true`)
      props = initialStoreProps
    }
    storeRef.current = createStoreFunc(props)
  }

  return storeRef.current
}
