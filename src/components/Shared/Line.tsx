import { cn } from '@/src/lib/Shared/utils'

/**
 * Renders a simple line as a svg. By default it will render a solid line.
 * By setting dashed to true a dashed line will be rendered instead.
 * By setting the dashSize and dashSpacing both the size of the individual dashes and the spacing between them can be modified.
 */
export default function Line({ dashed = false, dashSize = 4, dashSpacing = 5.5, className }: { dashed?: boolean; dashSize?: number; dashSpacing?: number; className?: string }) {
  return (
    <svg viewBox='0 0 100 2' preserveAspectRatio='none' className={cn('h-0.5 w-full', className)}>
      <line x1='0' y1='1' x2='100' y2='1' stroke='currentColor' strokeWidth='2' strokeDasharray={`${dashSize} ${dashed ? dashSpacing : 0}`} strokeLinecap='round' />
    </svg>
  )
}
