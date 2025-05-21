import { twMerge } from 'tailwind-merge'

export default function Card({ className, children, disableHoverStyles }: { className?: string; children: React.ReactNode; disableHoverStyles?: boolean }) {
  return (
    <div
      className={twMerge(
        'rounded-md bg-neutral-200/40 p-3 ring-1 ring-neutral-400/70 dark:bg-neutral-700/30 dark:ring-neutral-600',
        !disableHoverStyles && 'dark:hover:bg-neutral-700/70 dark:hover:ring-neutral-500/70',
        className,
      )}>
      {children}
    </div>
  )
}
