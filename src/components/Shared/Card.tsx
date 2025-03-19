import { twMerge } from 'tailwind-merge'

export default function Card({ className, children, disableHoverStyles }: { className?: string; children: React.ReactNode; disableHoverStyles?: boolean }) {
  return (
    <div className={twMerge('rounded-md p-3 ring-1 dark:bg-neutral-700/40 dark:ring-neutral-600', !disableHoverStyles && 'dark:hover:bg-neutral-700 dark:hover:ring-neutral-500', className)}>
      {children}
    </div>
  )
}
