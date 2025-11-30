'use client'

import { createStore, StoreApi } from 'zustand/vanilla'
import useStoreCaching from '@/src/hooks/Shared/zustand/useStoreCaching'
import { StoreCachingOptions } from '@/types/Shared/ZustandStore'
type SetFn<T> = StoreApi<T>['setState']
type GetFn<T> = StoreApi<T>['getState']

/**
 * Used to initialize the respective store
 * @param set Modifies the state of the store, while also caching the changes when `caching` is set to true
 * @param get Returns the current store
 * @returns
 */
export type StoreInitializer<T> = (set: SetFn<T>, get: GetFn<T>) => T

type CreateStoreProps_WithCache<T> = {
  caching: true
  options: StoreCachingOptions
  /**
   * Used to initialize the respective store
   * @param set Modifies the state of the store, while also caching the changes when `caching` is set to true
   * @param get Returns the current store
   * @returns
   */
  initializer: StoreInitializer<T>
}

type CreateStoreProps_WithoutCache<T> = {
  caching: false
  /**
   * Used to initialize the respective store
   * @param set Modifies the state of the store, while also caching the changes when `caching` is set to true
   * @param get Returns the current store
   * @returns
   */
  initializer: StoreInitializer<T>
}

type CreateStoreProps<T> = CreateStoreProps_WithCache<T> | CreateStoreProps_WithoutCache<T>

export function createZustandStore<T extends object>({ initializer, ...props }: CreateStoreProps<T>) {
  const store = createStore<T>()

  return store((set, get) => {
    if (!props.caching) return initializer(set, get)

    const cacheChanges = useStoreCaching<T>({ set, options: props.options })

    return initializer(cacheChanges, get)
  })
}
