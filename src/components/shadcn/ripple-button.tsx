'use client'

import * as React from 'react'
import { LoaderCircleIcon } from 'lucide-react'
import { type HTMLMotionProps, motion, type Transition } from 'motion/react'
import { buttonVariants, SimpleButtonProps } from '@/src/components/shadcn/button'
import { getUUID } from '@/src/lib/Shared/getUUID'
import { cn } from '@/src/lib/Shared/utils'

interface Ripple {
  id: number | string
  x: number
  y: number
}

interface RippleButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'>, SimpleButtonProps {
  scale?: number
  transition?: Transition
}

function RippleButton({ ref, isLoading, children, onClick, className, variant, size, scale = 10, transition = { duration: 0.6, ease: 'easeOut' }, ...props }: RippleButtonProps) {
  const [ripples, setRipples] = React.useState<Ripple[]>([])
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  React.useImperativeHandle(ref, () => buttonRef.current as HTMLButtonElement)

  const createRipple = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    const button = buttonRef.current

    if (!button) return

    const rect = button.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    const newRipple: Ripple = {
      id: getUUID(),
      x,
      y,
    }

    setRipples((prev) => [...prev, newRipple])

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id))
    }, 600)
  }, [])

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      createRipple(event)

      if (onClick) {
        onClick(event)
      }
    },
    [createRipple, onClick],
  )

  return (
    <motion.button ref={buttonRef} data-slot='ripple-button' onClick={handleClick} className={cn(buttonVariants({ variant, size }), 'relative overflow-hidden', className)} {...props}>
      {isLoading ? <LoaderCircleIcon className='size-4 animate-spin' /> : null}
      {children}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale, opacity: 0 }}
          transition={transition}
          className='pointer-events-none absolute size-5 rounded-full bg-current/60'
          style={{
            top: ripple.y - 10,
            left: ripple.x - 10,
          }}
        />
      ))}
    </motion.button>
  )
}

export { RippleButton, type RippleButtonProps }
