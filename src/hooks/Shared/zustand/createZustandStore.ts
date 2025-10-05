'use client'

import useCacheStoreUpdate from '@/src/hooks/Shared/useCacheStoreUpdate'
import { StoreCachingOptions } from '@/types/Shared/ZustandStore'
import { createStore, StoreApi } from 'zustand/vanilla'
type SetFn<T> = StoreApi<T>['setState']
type GetFn<T> = StoreApi<T>['getState']

/**
 * Used to initialize the respective store
 * @param set Modifies the state of the store, while also caching the changes when `caching` is set to true
 * @param get Returns the current store
 * @returns
 */
type StoreInitializer<T> = (set: SetFn<T>, get: GetFn<T>) => T

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

    const { modify } = useCacheStoreUpdate<T>(set, props.options)

    return initializer(modify as unknown as (prev: T) => T | Partial<T>, get)
  })
}
