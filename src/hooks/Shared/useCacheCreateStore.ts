import { useSessionStorageContext } from '@/src/hooks/root/SessionStorage'
import { Any } from '@/types'
import { useRef } from 'react'

/**
 * This hook implements the cache-restoration of a store's state
 * @param session_key The session-key under which the cached data is stored in the sessionStorage
 * @param createStoreFunc The function which initializes the store
 * @param initialStoreProps The initial properties that are being used when no data is cached
 */
export default function useCacheCreateStore<StoreState extends object>(session_key: string, createStoreFunc: Any, initialStoreProps?: StoreState) {
  const { getStoredValue } = useSessionStorageContext()
  const storeRef = useRef<ReturnType<typeof createStoreFunc>>(null)

  if (!storeRef.current) {
    const cached = getStoredValue<StoreState>(session_key)
    storeRef.current = createStoreFunc(cached ?? initialStoreProps)
  }

  return storeRef.current
}
