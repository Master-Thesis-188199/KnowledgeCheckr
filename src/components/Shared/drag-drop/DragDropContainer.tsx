'use client'

import { useEffect, useRef } from 'react'
import { Config, createSwapy, Swapy } from 'swapy'

export default function DragDropContainer({ children, className, ...config }: { children: React.ReactNode; className?: string } & Partial<Config>) {
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

      swapyRef.current.onSwapStart(() => {})

      swapyRef.current.onSwap((event) => {
        event.newSlotItemMap.asArray.forEach(({ slot, item }) => {
          const element = document.querySelector(`[data-swapy-item*="${item}"]`)
          const newIndex = event.newSlotItemMap.asArray.findIndex((i) => i.item === item)
          element?.setAttribute('position', newIndex.toString())

          element?.dispatchEvent(htmlEvent)

          const position_Counter = element?.getElementsByClassName('current-position')[0]?.textContent
          if (position_Counter) {
            element!.getElementsByClassName('current-position')[0].textContent = `${newIndex + 1}.`
          }
        })
      })
      swapyRef.current.onSwapEnd(() => {})
    }
    return () => {
      swapyRef.current?.destroy()
    }
  }, [])

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  )
}
