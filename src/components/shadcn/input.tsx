import * as React from 'react'
import { cn } from '@/lib/Shared/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot='input'
      className={cn(
        'h-9 min-w-0 rounded-md border border-input-ring bg-transparent px-3 py-1 text-sm shadow-xs transition-[color,box-shadow] outline-none selection:bg-primary selection:text-primary-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:disabled:opacity-75',
        'focus-visible:border-ring-hover focus-visible:ring-[3px] focus-visible:ring-ring-hover/50',

        'rounded-md px-3 py-1.5',
        'bg-input text-neutral-600 hover:cursor-text dark:text-neutral-300/80',
        'hover:border-ring-hover dark:hover:border-ring-hover',
        'aria-invalid:border-destructive aria-invalid:ring-destructive/20 aria-invalid:hover:border-destructive dark:aria-invalid:ring-destructive/40',
        type === 'checkbox' && 'size-4.5',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
