import React, { HTMLProps, useEffect, useRef } from 'react'
import { cn } from '@heroui/theme'
import { MoveIcon } from 'lucide-react'
import { ItemSwapEvent } from '@/src/components/Shared/drag-drop/DragDropContainer'
import { DragDropItemPositionCounter } from '@/src/components/Shared/drag-drop/DragDropPositionCounter'
import { getUUID } from '@/src/lib/Shared/getUUID'

interface DragDropItemProps extends Pick<React.ComponentProps<'div'>, 'onClick'> {
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
          'p-3 px-4',
          // add padding when move icon is shown
          'group-data-[hide-move-indicators=false]/drag-drop-container:pr-12',
          'group relative flex items-center gap-4 rounded-md bg-neutral-300/40 ring-1 ring-neutral-400/50 select-none group-data-[enabled=true]/drag-drop-container:cursor-move group-data-[enabled=true]/drag-drop-container:hover:bg-neutral-300/60 group-data-[enabled=true]/drag-drop-container:active:bg-neutral-400/40 dark:bg-neutral-800 dark:ring-neutral-600/80 dark:group-data-[enabled=true]/drag-drop-container:hover:bg-neutral-700/60 dark:group-data-[enabled=true]/drag-drop-container:active:bg-neutral-700/60',
          className,
        )}>
        {showPositionCounter && initialIndex !== undefined && <DragDropItemPositionCounter initialIndex={initialIndex} />}
        {children}
        <MoveIcon
          className={cn(
            'absolute inset-y-0 right-5 my-auto size-4.5 text-neutral-500 dark:text-neutral-400',
            // disabled icon styles
            'group-data-[enabled=false]/drag-drop-container:text-muted-foreground/40 dark:group-data-[enabled=false]/drag-drop-container:text-muted-foreground/40',
            // hover, active styles
            'group-data-[enabled=true]/drag-drop-container:group-hover:text-neutral-700 group-data-[enabled=true]/drag-drop-container:group-active:text-neutral-800 dark:group-data-[enabled=true]/drag-drop-container:group-hover:text-neutral-200/90 dark:group-data-[enabled=true]/drag-drop-container:group-active:text-neutral-100',
            // hide move-icon when `hide-move-indicators` data attribute is set
            'group-data-[hide-move-indicators=true]/drag-drop-container:hidden',
          )}
        />
      </div>
    </div>
  )
}
