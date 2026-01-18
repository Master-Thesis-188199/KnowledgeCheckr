'use client'

import { useEffect, useRef } from 'react'
import { Config, createSwapy, SwapEndEventHandler, SwapStartEventHandler, Swapy } from 'swapy'
import { cn } from '@/src/lib/Shared/utils'

export type ItemSwapEvent = CustomEvent<{
  name: string
  new_pos: number
  prev_pos: number
}>

interface DragDropContainerProps {
  children: React.ReactNode
  className?: string
  onSwapStart?: SwapStartEventHandler
  onSwapEnd?: SwapEndEventHandler
}

export default function DragDropContainer({ children, className, onSwapEnd, onSwapStart, ...config }: DragDropContainerProps & Partial<Config>) {
  const swapyRef = useRef<Swapy | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      swapyRef.current = createSwapy(containerRef.current, {
        animation: 'dynamic',
        autoScrollOnDrag: true,
        ...config,
      })

      swapyRef.current.onBeforeSwap(() => {
        // Return true to allow swapping, and return false to prevent swapping.
        return true
      })

      swapyRef.current.onSwapStart(onSwapStart ? onSwapStart : () => {})

      swapyRef.current.onSwap((event) => {
        event.newSlotItemMap.asArray
          //? discard items that have not changed position
          .filter((el) => el.item === event.draggingItem || el.item === event.swappedWithItem)
          .forEach(({ item }) => {
            const element = document.querySelector(`[data-swapy-item*="${item}"]`)
            const newIndex = event.newSlotItemMap.asArray.findIndex((i) => i.item === item)
            element?.setAttribute('position', newIndex.toString())

            const position_Counter = element?.getElementsByClassName('current-position')[0]?.textContent
            if (position_Counter) {
              element!.getElementsByClassName('current-position')[0].textContent = `${newIndex + 1}.`
            }

            const htmlEvent: ItemSwapEvent = new CustomEvent('item-swap-event', {
              detail: {
                name: item,
                new_pos: newIndex,
                prev_pos: event.oldSlotItemMap.asArray.findIndex((i) => i.item === item),
              },
            })
            element?.dispatchEvent(htmlEvent)
          })
      })
      swapyRef.current.onSwapEnd(onSwapEnd ? onSwapEnd : () => {})
    }
    return () => {
      swapyRef.current?.destroy()
    }
  }, [])

  return (
    <div ref={containerRef} className={cn('group/drag-drop-container', className)} data-enabled={config.enabled}>
      {children}
    </div>
  )
}
