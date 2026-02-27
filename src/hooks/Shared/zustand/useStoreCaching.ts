import cloneDeep from 'lodash/cloneDeep'
import { useSessionStorageContext } from '@/src/hooks/root/SessionStorage'
import { StoreInitializer } from '@/src/hooks/Shared/zustand/createZustandStore'
import { StoreCachingOptions } from '@/types/Shared/ZustandStore'

interface useStoreCachingProps<Store extends object> {
  set: Parameters<StoreInitializer<Store>>['0']
  options: StoreCachingOptions
}

/**
 * This hoook provides a wrapper function that allows users to modify a given store-state, while also caching said changes, if enabled.
 * This way cached changes can be recovered / re-applied to a given store.
 * @param set The original set-function that updates the store-state.
 * @param options.disableCache When set to true, the returned caching-function will no longer cache changes.
 * @param options.cacheKey The key under which the cached-data is stored.
 * @param options.debounceTime The time that has pass, without changes, until the store-changes are cached.
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
        if (!disableCache) storeSessionValue(cacheKey, cloneDeep(update))
      }, debounceTime)

      return update
    })
  }

  return cacheChanges
}
