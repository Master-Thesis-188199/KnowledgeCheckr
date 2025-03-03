'use client'

import { useEffect, useState } from 'react'

export default function useDebounce<T>(delay: number = 300, setState: (prev: T) => void, skipDebounceWhen?: (state: T) => boolean) {
  const [debounced, setDebounced] = useState<T | undefined>(undefined)

  useEffect(() => {
    if (debounced === undefined) return
    if (!!skipDebounceWhen && skipDebounceWhen(debounced)) return setState(debounced)

    const timeout = setTimeout(() => setState(debounced), delay)

    return () => clearTimeout(timeout)
  }, [debounced])

  return { debounce: setDebounced }
}
