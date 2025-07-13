import useMatchMedia from '@/src/hooks/Shared/useMatchMedia'
import { Any } from '@/types'

const breakPoints = {
  '2Xl': 1536,
  'Xl': 1280,
  'Lg': 1024,
  'Md': 768,
  'Sm': 640,
}

interface useBreakpointsReturn {
  is2Xl?: boolean
  isXl?: boolean
  isLg?: boolean
  isMd?: boolean
  isSm?: boolean
}

export function useBreakpoints(): useBreakpointsReturn {
  const isSm = useMatchMedia(`(min-width: ${breakPoints['Sm']}px)`)
  const isMd = useMatchMedia(`(min-width: ${breakPoints['Md']}px)`)
  const isLg = useMatchMedia(`(min-width: ${breakPoints['Lg']}px)`)
  const isXl = useMatchMedia(`(min-width: ${breakPoints['Xl']}px)`)
  const is2Xl = useMatchMedia(`(min-width: ${breakPoints['2Xl']}px)`)

  const obj = {
    is2Xl,
    isXl,
    isLg,
    isMd,
    isSm,
  }

  const currentBreakpoint: Any = Object.entries(obj)
    .filter(([, value]) => !!value)
    .map(([key, value]) => ({ [key]: value }))
    .find((point) => !!point)

  const output: useBreakpointsReturn = { ...Object.entries(obj).map(([key]) => ({ [key]: false })), ...currentBreakpoint }
  return output
}
