'use client'

import * as React from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'
import { cn } from '@/lib/Shared/utils'

function Progress({ className, value, indicatorClasses, ...props }: React.ComponentProps<typeof ProgressPrimitive.Root> & { indicatorClasses?: string }) {
  return (
    <ProgressPrimitive.Root data-slot='progress' className={cn('relative h-2 w-full overflow-hidden rounded-full bg-primary/20', className)} {...props}>
      <ProgressPrimitive.Indicator
        data-slot='progress-indicator'
        className={cn('h-full w-full flex-1 bg-primary transition-all', indicatorClasses)}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
}

export { Progress }
