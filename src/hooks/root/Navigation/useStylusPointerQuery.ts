import { Pointers } from '@/hooks/root/Navigation/usePrimaryPointerQuery'
import useMatchMedia from '@/hooks/Shared/useMatchMedia'

const enum Hovers {
  none = 'none',
  hover = 'hover',
}

const useStylesPointerQuery = () => {
  return useMatchMedia(`(any-pointer: ${Pointers.fine}) and (any-hover: ${Hovers.none})`)
}

export default useStylesPointerQuery
