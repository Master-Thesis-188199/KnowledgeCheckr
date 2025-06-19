import useMatchMedia from '@/src/hooks/Shared/useMatchMedia'
import { Any } from '@/types'

const breakPoints = {
  '2Xl': 1536,
  'Xl': 1280,
  'Lg': 1024,
  'Md': 768,
  'Sm': 640,
}

export function useBreakpoints(): {
  isMobile?: boolean
  isDesktop?: boolean
  isSm?: boolean
  isMd?: boolean
  isLg?: boolean
  isXl?: boolean
  is2Xl?: boolean
  isCustom: (breakpoint: number) => boolean
} {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const isCustom = (breakPoint: number) => useMatchMedia(`(min-width: ${breakPoint})`)

  let states: Any = { isCustom }

  for (const [key, value] of Object.entries(breakPoints).sort((a, b) => b[1] - a[1])) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const match = useMatchMedia(`(min-width: ${value}px)`)
    if (!match) continue

    // if >> breakpoint is true -> smaller ones are automatically true -> discard those
    if (Object.keys(states).length >= 2) continue

    states = { ...states, [`is${key}`]: match }
  }

  return states
}
