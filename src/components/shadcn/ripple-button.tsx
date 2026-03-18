'use client'

import * as React from 'react'
import { LoaderCircleIcon } from 'lucide-react'
import { type HTMLMotionProps, motion, Transition } from 'motion/react'
import { buttonVariants, SimpleButtonProps } from '@/src/components/shadcn/button'
import { getUUID } from '@/src/lib/Shared/getUUID'
import { cn } from '@/src/lib/Shared/utils'
import { Any } from '@/types'

interface Ripple {
  id: number | string
  x: number
  y: number
}

interface RippleButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'>, SimpleButtonProps {
  scale?: number
  transition?: Transition
  rippleClassname?: string
}

function RippleButton({
  ref,
  isLoading,
  children,
  onClick,
  className,
  variant,
  asChild,
  size,
  scale = 10,
  transition = { duration: 0.6, ease: 'easeOut' },
  rippleClassname,
  ...props
}: RippleButtonProps) {
  const [ripples, setRipples] = React.useState<Ripple[]>([])
  const buttonRef = React.useRef<HTMLElement>(null)

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

  React.useImperativeHandle(ref, () => buttonRef.current as HTMLButtonElement)

  if (asChild && React.isValidElement(children)) {
    const child = children as React.ReactElement<HTMLButtonElement>

    const mergedClassName = cn(buttonVariants({ variant, size }), 'relative overflow-hidden', child.props.className, className)

    const handleChildClick = (event: React.MouseEvent<HTMLElement>) => {
      createRipple(event as Any)
      if (onClick) onClick(event as Any)
      if (typeof child.props.onclick === 'function') {
        child.props.onclick(event as Any)
      }
    }

    return React.cloneElement(
      child,
      // eslint-disable-next-line react-hooks/refs
      {
        ...props,
        //@ts-expect-error ref attribute is not part of `HTMLButtonElement` but does exist.
        'ref': (el: Any) => {
          buttonRef.current = el
          if (typeof ref === 'function') (ref as (instance: Any) => void)(el)
          else if (ref) (ref as React.MutableRefObject<Any>).current = el
        },
        'onClick': handleChildClick,
        'className': mergedClassName,
        'data-slot': 'ripple-button',
      },
      <>
        {isLoading && <LoaderCircleIcon className='size-4 animate-spin' />}
        {child.props.children}
        {ripples.map((ripple) => (
          <motion.span
            key={ripple.id}
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale, opacity: 0 }}
            transition={transition}
            className={cn('pointer-events-none absolute size-5 rounded-full bg-current/60', rippleClassname)}
            style={{ top: ripple.y - 10, left: ripple.x - 10 }}
          />
        ))}
      </>,
    )
  }

  return (
    <motion.button ref={buttonRef as Any} data-slot='ripple-button' onClick={handleClick} className={cn(buttonVariants({ variant, size }), 'relative overflow-hidden', className)} {...props}>
      {isLoading ? <LoaderCircleIcon className='size-4 animate-spin' /> : null}
      {children}
      {ripples.map((ripple) => (
        <motion.span
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale, opacity: 0 }}
          transition={transition}
          className={cn('pointer-events-none absolute size-5 rounded-full bg-current/60', rippleClassname)}
          style={{ top: ripple.y - 10, left: ripple.x - 10 }}
        />
      ))}
    </motion.button>
  )
}

export { RippleButton, type RippleButtonProps }
