'use client'

import * as React from 'react'
import { HTMLProps, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, MotionProps } from 'motion/react'

type TimeoutHandle = ReturnType<typeof window.setTimeout>

function clearTimer(ref: React.MutableRefObject<TimeoutHandle | null>) {
  if (ref.current !== null) {
    window.clearTimeout(ref.current)
    ref.current = null
  }
}

export type PresenceTimingOptions = {
  /** Delay mounting to avoid flicker on fast toggles. */
  showDelayMs?: number

  /** Once mounted, keep visible for at least this duration. */
  minVisibleMs?: number

  onEnter?: () => void
  onExit?: () => void
}

/**
 * Converts a fast-changing boolean into a stable presence flag.
 * Thus, animates a given set of elements with a `minVisible` duration.
 * Prevents animations from being interrupted by the presence-state changing to quickly.
 */
export function usePresenceTiming(active: boolean, { showDelayMs = 0, minVisibleMs = 0, onEnter, onExit }: PresenceTimingOptions = {}) {
  const [present, setPresent] = useState(false)

  const showTimerRef = useRef<TimeoutHandle | null>(null)
  const hideTimerRef = useRef<TimeoutHandle | null>(null)
  const enteredAtRef = useRef<number | null>(null)

  useEffect(() => {
    clearTimer(showTimerRef)
    clearTimer(hideTimerRef)

    if (active) {
      if (present) return

      showTimerRef.current = setTimeout(
        () => {
          enteredAtRef.current = Date.now()
          setPresent(true)
          onEnter?.()
        },
        Math.max(0, showDelayMs),
      )

      return () => clearTimer(showTimerRef)
    }

    if (!present) return

    const enteredAt = enteredAtRef.current
    const elapsed = enteredAt ? Date.now() - enteredAt : 0
    const remaining = Math.max(0, minVisibleMs - elapsed)

    hideTimerRef.current = setTimeout(() => {
      enteredAtRef.current = null
      setPresent(false)
      onExit?.()
    }, remaining)

    return () => clearTimer(hideTimerRef)
  }, [active, present, showDelayMs, minVisibleMs, onEnter, onExit])

  useEffect(() => {
    return () => {
      clearTimer(showTimerRef)
      clearTimer(hideTimerRef)
    }
  }, [])

  return present
}

export type PresenceTransitionProps = HTMLProps<HTMLDivElement> &
  MotionProps & {
    active: boolean
    presenceTiming?: PresenceTimingOptions

    className?: string
    children: React.ReactNode
  }

/**
 * Generic mount/unmount animation with optional gating (min-animation time and/or show-delay)
 */
export default function SmoothPresenceTransition({
  active,
  presenceTiming,
  className,
  children,
  transition = { duration: 0.3, ease: 'easeInOut' },
  initial = { opacity: 0 },
  animate = { opacity: 1 },
  exit = { opacity: 0 },

  ...props
}: PresenceTransitionProps) {
  const showPresence = usePresenceTiming(active, presenceTiming)

  return (
    <AnimatePresence initial={false}>
      {showPresence && (
        <motion.div key='presence' className={className} transition={transition} initial={initial} animate={animate} exit={exit} {...props}>
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
