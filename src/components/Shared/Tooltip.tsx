import { TooltipProps as HerouiTooltipProps } from '@heroui/tooltip'
import { Tooltip as ShadcnTooltip, TooltipContent, TooltipTrigger } from '@/src/components/shadcn/tooltip'
import { cn } from '@/src/lib/Shared/utils'

type BaseTooltipProps = {
  showsWarning?: boolean
  showsError?: boolean
}

export type TooltipProps = BaseTooltipProps & HerouiTooltipProps

export default function Tooltip({ delay = 250, showsWarning, showsError, ...props }: TooltipProps) {
  return (
    <ShadcnTooltip delayDuration={delay}>
      <TooltipTrigger asChild>{props.children}</TooltipTrigger>
      <TooltipContent
        className={cn(
          showsWarning && 'text-[#BF8415] shadow-orange-500/20 dark:text-orange-400 dark:shadow-orange-400/40',
          showsError && 'text-destructive shadow-red-500/30 dark:text-destructive dark:shadow-red-400/40',
        )}>
        {props.content}
      </TooltipContent>
    </ShadcnTooltip>
  )
}
