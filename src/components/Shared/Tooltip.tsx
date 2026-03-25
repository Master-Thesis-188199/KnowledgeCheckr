import { useEffect, useState } from 'react'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import { Tooltip as ShadcnTooltip, TooltipContent, TooltipTrigger } from '@/src/components/shadcn/tooltip'
import { cn } from '@/src/lib/Shared/utils'
import { Any } from '@/types'

export type TooltipProps = Omit<React.ComponentProps<typeof TooltipPrimitive.Content>, 'content'> & {
  delay?: number
  config?: Omit<React.ComponentProps<typeof TooltipPrimitive.Root>, 'delayDuration'>
  variant?: 'normal' | 'destructive' | 'warning'
  content: React.ReactNode | React.ReactElement | Any
  disabled?: boolean
}

export default function Tooltip({ disabled, config = {}, delay = 250, variant = 'normal', content, children, ...props }: TooltipProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPinned, setPinned] = useState(config.open ?? false)

  useEffect(() => {
    if (config.open === undefined || config.open === isPinned) return

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPinned(config.open)
  }, [config.open])

  return (
    <ShadcnTooltip
      delayDuration={delay}
      {...config}
      open={disabled === true ? false : isHovered || isPinned}
      onOpenChange={(isOpen) => {
        if (!isPinned) setIsHovered(isOpen)

        config.onOpenChange?.(isOpen)
      }}>
      <TooltipTrigger asChild onClick={() => setPinned((prev) => !prev)} aria-label='toggle tooltip'>
        {children}
      </TooltipTrigger>
      <TooltipContent
        {...props}
        className={cn(
          'shadow-md shadow-accent dark:shadow-card',
          variant === 'warning' && 'text-[#BF8415] shadow-orange-700/15 dark:text-orange-400 dark:shadow-orange-400/15',
          variant === 'destructive' && 'text-destructive shadow-red-500/15 dark:text-destructive dark:shadow-red-400/15',
          props.className,
        )}>
        {content}
      </TooltipContent>
    </ShadcnTooltip>
  )
}
