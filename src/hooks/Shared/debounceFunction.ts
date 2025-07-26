/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Any } from '@/types'

export default function debounceFunction(func: Any, delay: number) {
  let timer: NodeJS.Timeout
  return function (...args: Any) {
    clearTimeout(timer)
    //@ts-expect-error
    timer = setTimeout(() => func.apply(this, args), delay)
  }
}
