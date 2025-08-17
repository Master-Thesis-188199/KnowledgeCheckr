import { ItemSwapEvent } from '@/src/components/Shared/drag-drop/DragDropContainer'
import { getUUID } from '@/src/lib/Shared/getUUID'
import { cn } from '@heroui/theme'
import { useEffect, useRef } from 'react'

interface DragDropItemProps {
  children: React.ReactNode
  className?: string
  onSwap?: (e: ItemSwapEvent) => void
  name?: string | number
}
export function DragDropItem({ children, className, name, onSwap }: DragDropItemProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!onSwap || typeof onSwap !== 'function') return
    if (!ref.current) return

    ref.current.addEventListener('item-swap-event', onSwap as EventListener)

    return () => {
      ref.current?.removeEventListener('item-swap-event', onSwap as EventListener)
    }
  }, [ref.current])

  return (
    <div data-swapy-slot={getUUID()}>
      <div
        ref={ref}
        data-swapy-item={name || getUUID()}
        className={cn(
          'flex cursor-move items-center gap-4 rounded-md bg-neutral-300/40 p-3 px-4 ring-1 ring-neutral-400/50 select-none hover:bg-neutral-300/60 active:bg-neutral-400/40 dark:bg-neutral-800 dark:ring-neutral-600/80 dark:hover:bg-neutral-700/60 dark:active:bg-neutral-700/60',
          className,
        )}>
        {children}
      </div>
    </div>
  )
}
