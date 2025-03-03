import useMatchMedia from '@/hooks/Shared/useMatchMedia'
import { Pointers } from '@/hooks/root/Navigation/usePrimaryPointerQuery'

const enum Hovers {
  none = 'none',
  hover = 'hover',
}

const useStylesPointerQuery = () => {
  return useMatchMedia(`(any-pointer: ${Pointers.fine}) and (any-hover: ${Hovers.none})`)
}

export default useStylesPointerQuery
