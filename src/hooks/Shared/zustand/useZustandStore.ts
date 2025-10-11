'use client'

import { useSessionStorageContext } from '@/src/hooks/root/SessionStorage'
import { StoreCachingOptions, StoreState_fromStore, WithCaching, ZustandStore } from '@/types/Shared/ZustandStore'
import { useRef } from 'react'
import { StoreApi } from 'zustand'

export type useStoreCachingOptions<Store extends object> = StoreCachingOptions & {
  expiresAfter?: number
  discardCache?: (cached: StoreState_fromStore<Store> | null) => boolean
}

interface useStoreProps_WithCache<Store extends object, TInitial = StoreState_fromStore<Store>> {
  caching: true
  createStoreFunc: WithCaching<ZustandStore<Store, TInitial>>
  initialStoreProps?: TInitial
  options: useStoreCachingOptions<Store>
}

interface useStoreProps_WithoutCache<Store extends object, TInitial = StoreState_fromStore<Store>> {
  caching: false
  initialStoreProps?: TInitial
  createStoreFunc: ZustandStore<Store, TInitial>
}

type useStoreProps<Store extends object, TInitial = StoreState_fromStore<Store>> = useStoreProps_WithoutCache<Store, TInitial> | useStoreProps_WithCache<Store, TInitial>

/**
 * This hook is used to instantiate a given store. Depending on whether or not the respective store should be cached the arguments this hook accepts will differ.
 * When the store should not be cached by setting [cached: false] it will essentially just call the createStoreFunc with the provided initialProps.
 * Otherwise, when caching is enabled it will either instantiate the store with the cached properties if they exist or use the initialProps.
 * @param caching Will determinate whether the store is instantiated with potentially cached data or the initialProps.
 * @param createStoreFunc The function / handler used to create the respective store.
 * @param initialStoreProps The initial-properties that are to be used when no data is cached or caching is disabled.
 * @param options Are only accepted when `caching` is set to true. Allows users to configure the caching behavior.
 * @returns It returns the (store / context)-props that are then passed to the respective provider.
 */
export function useZustandStore<TStore extends object, TInitial extends object = StoreState_fromStore<TStore>>({ initialStoreProps, ...rest }: useStoreProps<TStore, TInitial>): StoreApi<TStore> {
  const storeRef = useRef<ReturnType<typeof rest.createStoreFunc>>(null)
  const { getStoredValue } = useSessionStorageContext()

  //* Re-create store when caching is disabled
  if (!rest.caching) {
    if (!storeRef.current) storeRef.current = rest.createStoreFunc({ initialState: initialStoreProps })

    return storeRef.current
  }

  //* Caching of store props when caching is enabled
  if (!storeRef.current) {
    const cached = getStoredValue<StoreState_fromStore<TStore>>(rest.options.cacheKey, { expiresAfter: rest.options.expiresAfter })

    const props = (cached ?? initialStoreProps) as TInitial

    //* initialization of store without caching
    if (rest.options.disableCache || (rest.options.discardCache && rest.options.discardCache(cached))) {
      storeRef.current = rest.createStoreFunc({ initialState: initialStoreProps, options: rest.options })
      return storeRef.current
    }

    storeRef.current = rest.createStoreFunc({ initialState: props, options: rest.options })
  }

  return storeRef.current
}
