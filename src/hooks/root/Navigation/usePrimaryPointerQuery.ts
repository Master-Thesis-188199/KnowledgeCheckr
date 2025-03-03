import useMatchMedia from '@/hooks/Shared/useMatchMedia'

export const enum Pointers {
  none = 'none',
  coarse = 'coarse',
  fine = 'fine',
}

/**
 * Determinate the current device's primary pointer.
 * When using a mouse as a primary cursor -> fine; if using a tablet its typically coarse if using a stylus -> fine.
 * @returns the current devices primary pointer using media queries
 */
export const usePrimaryPointerQuery = (): Pointers | undefined => {
  const isNone = useMatchMedia('(pointer: none)')
  const isCoarse = useMatchMedia('(pointer: coarse)')
  const isFine = useMatchMedia('(pointer: fine)')

  if (isNone) return Pointers.none
  else if (isCoarse) return Pointers.coarse
  else if (isFine) return Pointers.fine
}
