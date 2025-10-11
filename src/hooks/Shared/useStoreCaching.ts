import { useSessionStorageContext } from '@/src/hooks/root/SessionStorage'
import { StoreInitializer } from '@/src/hooks/Shared/zustand/createZustandStore'
import { StoreCachingOptions } from '@/types/Shared/ZustandStore'

interface useStoreCachingProps<Store extends object> {
  set: Parameters<StoreInitializer<Store>>['0']
  options: StoreCachingOptions
}

/**
 * This hook takes in the 'set' function that updates the state of a given store and exposes a 'modify' function that will update the store-state just like the set function, but will also cache the updated-state using the sessionStorage after a debounceTime [default: 150ms]
 * @param set The function used to update a given store's state
 * @param debounceTime The time after which a state-update will be cached - to eliminate rapid changes e.g. after each key-stroke
 */
export default function useStoreCaching<StoreProps extends object>({ set, options: { disableCache, cacheKey, debounceTime } }: useStoreCachingProps<StoreProps>) {
  const { storeSessionValue } = useSessionStorageContext()
  let storeTimer: ReturnType<typeof setTimeout> | null = null

  const cacheChanges: Parameters<StoreInitializer<StoreProps>>['0'] = (modifications) => {
    set((prev) => {
      if (storeTimer) {
        clearTimeout(storeTimer)
      }

      let update: typeof prev

      if (typeof modifications === 'function') update = { ...prev, ...modifications(prev) }
      else update = { ...prev, ...modifications }

      storeTimer = setTimeout(() => {
        if (!disableCache) storeSessionValue(cacheKey, { ...update })
      }, debounceTime)

      return update
    })
  }

  return cacheChanges
}
