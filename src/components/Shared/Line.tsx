'use client'

import { useId } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/src/lib/Shared/utils'

type LineProps = {
  dashed?: boolean
  dashSize?: number
  dashSpacing?: number
  className?: string
  /** Color of the base (old) line; independent of parent text color */
  /** Change this value to retrigger the left→right wipe (e.g., step index or color name) */
  animateStrokeColor?: string
  animateFromDirection?: 'left' | 'right' | 'none'
}

export default function Line({ dashed = false, dashSize = 4, dashSpacing = 5.5, className, animateFromDirection = 'none', animateStrokeColor }: LineProps) {
  const maskId = useId()

  return (
    <motion.svg viewBox='0 0 100 2' preserveAspectRatio='none' className={cn('h-0.5 w-full', className)} aria-hidden>
      {/* Base (old) line */}
      <line x1='0' y1='1' x2='100' y2='1' stroke='currentColor' strokeWidth={2} strokeDasharray={`${dashSize} ${dashed ? dashSpacing : 0}`} strokeLinecap='round' vectorEffect='non-scaling-stroke' />

      {/* The new line with the updated color that appears on top of the old line */}
      <defs>
        <mask id={maskId} maskUnits='userSpaceOnUse'>
          {/* restarts the animation whenever the key changes */}
          <motion.rect
            key={String(animateFromDirection ?? 'once')}
            x='0'
            y='0'
            height='2'
            width='0'
            fill='white'
            initial={animateFromDirection === 'none' ? {} : animateFromDirection === 'left' ? { width: 0 } : { width: 100 }}
            animate={animateFromDirection === 'none' ? false : animateFromDirection === 'left' ? { width: 100 } : { width: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </mask>
      </defs>

      <line
        x1='0'
        y1='1'
        x2='100'
        y2='1'
        stroke={'currentColor'}
        className={animateStrokeColor}
        strokeWidth={2}
        strokeDasharray={`${dashSize} ${dashed ? dashSpacing : 0}`}
        strokeLinecap='round'
        vectorEffect='non-scaling-stroke'
        mask={`url(#${maskId})`}
      />
    </motion.svg>
  )
}
