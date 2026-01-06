import { HTMLProps, useEffect, useRef } from 'react'
import { cn } from '@heroui/theme'
import { MoveIcon } from 'lucide-react'
import { ItemSwapEvent } from '@/src/components/Shared/drag-drop/DragDropContainer'
import { DragDropItemPositionCounter } from '@/src/components/Shared/drag-drop/DragDropPositionCounter'
import { getUUID } from '@/src/lib/Shared/getUUID'

interface DragDropItemProps {
  children: React.ReactNode
  className?: string
  onSwap?: (e: ItemSwapEvent) => void
  name?: string | number
  initialIndex?: number
  showPositionCounter?: boolean
}
export function DragDropItem({ children, className, name, onSwap, initialIndex, showPositionCounter = true, ...props }: DragDropItemProps & Pick<HTMLProps<HTMLDivElement>, 'data' | 'title'>) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!onSwap || typeof onSwap !== 'function') return
    if (!ref.current) return

    ref.current.addEventListener('item-swap-event', onSwap as EventListener)

    return () => {
      ref.current?.removeEventListener('item-swap-event', onSwap as EventListener)
    }
    // eslint-disable-next-line react-hooks/refs
  }, [ref.current])

  return (
    <div data-swapy-slot={getUUID()}>
      <div
        ref={ref}
        {...props}
        data-swapy-item={name || getUUID()}
        className={cn(
          'group relative flex cursor-move items-center gap-4 rounded-md bg-neutral-300/40 p-3 px-4 pr-12 ring-1 ring-neutral-400/50 select-none hover:bg-neutral-300/60 active:bg-neutral-400/40 dark:bg-neutral-800 dark:ring-neutral-600/80 dark:hover:bg-neutral-700/60 dark:active:bg-neutral-700/60',
          className,
        )}>
        {showPositionCounter && initialIndex !== undefined && <DragDropItemPositionCounter initialIndex={initialIndex} />}
        {children}
        <MoveIcon className='absolute top-0 right-5 bottom-0 my-auto size-4.5 text-neutral-500 group-hover:text-neutral-700 group-active:text-neutral-800 dark:text-neutral-400 dark:group-hover:text-neutral-200/90 dark:group-active:text-neutral-100' />
      </div>
    </div>
  )
}
