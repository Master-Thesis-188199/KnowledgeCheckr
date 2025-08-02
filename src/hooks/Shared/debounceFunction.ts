/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Any } from '@/types'

export default function debounceFunction<T extends (...args: Any[]) => Any>(func: T, delay: number): T {
  let timer: NodeJS.Timeout
  return function (...args: Parameters<T>) {
    clearTimeout(timer)
    // @ts-expect-error
    timer = setTimeout(() => func.apply(this, args), delay)
  } as T
}
