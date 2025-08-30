 
import { Any } from '@/types'

export default function debounceFunction<T extends (...args: Any[]) => Any>(func: T, delay: number): T & { abort: () => void } {
  let timer: ReturnType<typeof setTimeout> | null = null
  let controller: AbortController | null = null

  function debounced(this: Any, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer)
    if (controller) controller.abort()

    controller = new AbortController()

    timer = setTimeout(() => {
      timer = null

      //? signal is passed on to function to interrupt calls that are already in progress
      func.apply(this, [...args, controller!.signal])
    }, delay)
  }

  debounced.abort = () => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    if (controller) {
      controller.abort()
      controller = null
    }
  }

  return debounced as T & { abort: () => void }
}
