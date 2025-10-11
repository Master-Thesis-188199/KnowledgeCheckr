import { useSessionStorageContext } from '@/src/hooks/root/SessionStorage'
import { StoreCachingOptions } from '@/types/Shared/ZustandStore'

interface useCacheStoreUpdateProps<Store extends object> {
  set: (updater: (prev: Store) => Store | Partial<Store>) => void
  options: StoreCachingOptions
}

/**
 * This hook takes in the 'set' function that updates the state of a given store and exposes a 'modify' function that will update the store-state just like the set function, but will also cache the updated-state using the sessionStorage after a debounceTime [default: 150ms]
 * @param set The function used to update a given store's state
 * @param debounceTime The time after which a state-update will be cached - to eliminate rapid changes e.g. after each key-stroke
 */
export default function useCacheStoreUpdate<StoreProps extends object>({ set, options: { disableCache, cacheKey, debounceTime } }: useCacheStoreUpdateProps<StoreProps>) {
  const { storeSessionValue } = useSessionStorageContext()
  let storeTimer: ReturnType<typeof setTimeout> | null = null

  const modify = (func: (prev: StoreProps) => StoreProps | Partial<StoreProps>) => {
    set((prev: StoreProps) => {
      if (storeTimer) {
        clearTimeout(storeTimer)
      }

      const update = { ...prev, ...func(prev) }

      storeTimer = setTimeout(() => {
        if (!disableCache) storeSessionValue(cacheKey, { ...update })
      }, debounceTime)

      return update
    })
  }

  return { modify }
}
