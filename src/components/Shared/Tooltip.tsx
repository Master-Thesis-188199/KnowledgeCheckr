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

export default function Tooltip({ disabled, config = {}, delay = 250, variant = 'normal', ...props }: TooltipProps) {
  return (
    <ShadcnTooltip delayDuration={delay} {...config} open={disabled !== undefined && disabled === true ? false : config.open}>
      <TooltipTrigger asChild>{props.children}</TooltipTrigger>
      <TooltipContent
        {...props}
        className={cn(
          variant === 'warning' && 'text-[#BF8415] shadow-orange-500/20 dark:text-orange-400 dark:shadow-orange-400/40',
          variant === 'destructive' && 'text-destructive shadow-red-500/30 dark:text-destructive dark:shadow-red-400/40',
          props.className,
        )}>
        {props.content}
      </TooltipContent>
    </ShadcnTooltip>
  )
}
