import type { StoreApi } from 'zustand/vanilla'

/**
 * Defines how a `createStore` function should look like.
 * It takes an optional initial state and options, and returns a Zustand store API.
 */
export type CreateStoreType<Store extends object> = (initialState?: Store, options?: CreateStoreOptions) => StoreApi<Store>

/**
 * Defines what options should be available when creating a store.
 */
export type CreateStoreOptions = { disableCache?: boolean }
