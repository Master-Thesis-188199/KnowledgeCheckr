import { Any } from '@/types'
import type { StoreApi } from 'zustand/vanilla'

export type StoreCachingOptions = { disableCache?: boolean; cacheKey?: string }

/**
 * Defines the structure of how a `create[ X ]Store` function should look like in terms of its properties and return-type.
 */
export type ZustandStore<Store extends object> = (initialState?: Omit<Store, FunctionKeys<Store>>) => StoreApi<Store>

/**
 * Is used to add caching to the respective `ZustandeStore<T>` type, which basically adds the `CachingOptions` as the second property to the createStore function.
 */
export type WithCaching<TStore extends (initial?: Any) => Any, O = StoreCachingOptions> = TStore extends (initial?: infer S) => infer R ? (initial?: S, options?: O) => R : never

type FunctionKeys<T> = {
  [K in keyof T]-?: T[K] extends (...args: Any) => Any ? K : never
}[keyof T]

/**
 * Extracts the state variable type from the given Store type definitions.
 * This way users must only provide the <Store> type to the utility function instead of both State and Actions to form the Store type.
 */
export type StoreState_fromStore<Store> = Omit<Store, FunctionKeys<Store>>
