import * as React from 'react'
import { cn } from '@/lib/Shared/utils'

function Textarea({ className, ...props }: React.ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot='textarea'
      className={cn(
        'rounded-md bg-neutral-100/90 px-3 py-1.5 text-neutral-600 ring-1 ring-neutral-400 outline-none placeholder:text-neutral-400/90 hover:cursor-text hover:ring-ring-hover focus:ring-[1.2px] focus:ring-ring-focus dark:bg-neutral-800 dark:text-neutral-300/80 dark:ring-neutral-500 dark:placeholder:text-neutral-400/50 dark:hover:ring-ring-hover dark:focus:ring-ring-focus',
        className,
      )}
      {...props}
    />
  )
}

export { Textarea }
