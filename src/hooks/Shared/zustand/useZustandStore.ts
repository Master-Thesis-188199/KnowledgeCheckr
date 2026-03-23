'use client'

import { useContext, useRef } from 'react'
import { StoreApi } from 'zustand'
import { useSessionStorageContext } from '@/src/hooks/root/SessionStorage'
import { I18nClientContext, useI18n } from '@/src/i18n/client-localization'
import { Translator } from '@/src/i18n/locales/types'
import { StoreCachingOptions, StoreState_fromStore, WithCaching, ZustandStore } from '@/types/Shared/ZustandStore'

export type useStoreCachingOptions<Store extends object> = StoreCachingOptions & {
  expiresAfter?: number
  discardCache?: (cached: StoreState_fromStore<Store>) => boolean
  modifyCache?: (cached: StoreState_fromStore<Store>) => StoreState_fromStore<Store> | undefined
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
  const i18nContext = useContext(I18nClientContext)
  let translator: Translator

  if (!i18nContext) {
    translator = ((k: string) => k) as Translator
    console.warn(`[useZustandStore]: i18n context is not available, instantiating translator as '(key) => key'`)
  } else {
    //! Warning: Unwrapping conditional `useI18n` hook will cause Runtime errors, when `useZustandStore` is used by Providers outside the `/[locale]` directory and thus outside of `I18nProvider`.
    // At the time this would mean that Providers used in `RootProviders` that use the `useZustandStore` would cause useContext outside of Provider errors.

    // eslint-disable-next-line react-hooks/rules-of-hooks
    translator = useI18n()
  }

  const { getStoredValue } = useSessionStorageContext()

  //* Re-create store when caching is disabled
  if (!rest.caching) {
    if (!storeRef.current) storeRef.current = rest.createStoreFunc({ initialState: initialStoreProps, translator })

    return storeRef.current
  }

  //* Caching of store props when caching is enabled
  if (!storeRef.current) {
    const cached = getStoredValue<StoreState_fromStore<TStore>>(rest.options.cacheKey, { expiresAfter: rest.options.expiresAfter })

    const initStore = (props: TInitial | StoreState_fromStore<TStore> | undefined) => {
      // initialize store either with the cached-props or the initialStoreProps
      storeRef.current = rest.createStoreFunc({ initialState: props as TInitial, options: rest.options, translator })
      return storeRef.current
    }

    // nothing to re-use --> no cache
    if (!cached) return initStore(initialStoreProps)

    if (rest.options.disableCache) return initStore(initialStoreProps)
    if (rest.options.discardCache && rest.options.discardCache(cached)) return initStore(initialStoreProps)
    if (rest.options.modifyCache) return initStore(rest.options.modifyCache(cached))

    return initStore(cached)
  }

  return storeRef.current
}
