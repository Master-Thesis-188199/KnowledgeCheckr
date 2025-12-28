import { Tooltip as HerouiTooltip, TooltipProps as HerouiTooltipProps } from '@heroui/tooltip'
import { cn } from '@/src/lib/Shared/utils'

type BaseTooltipProsp = {
  showsWarning?: boolean
  showsError?: boolean
}

export default function Tooltip({ showsWarning, showsError, ...props }: { disabled?: boolean } & BaseTooltipProsp & HerouiTooltipProps) {
  return (
    <HerouiTooltip
      delay={250}
      offset={8}
      closeDelay={0}
      shouldFlip
      {...props}
      className={cn(
        'rounded-md border-t border-r border-l border-neutral-300 bg-neutral-100 p-2 text-sm text-neutral-600 shadow-sm shadow-neutral-400 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-300/90 dark:shadow-neutral-700',
        showsWarning && 'text-[#BF8415] shadow-orange-500/20 dark:text-orange-400 dark:shadow-orange-400/40',
        showsError && 'text-[#D44D35] shadow-red-500/30 dark:text-red-400/90 dark:shadow-red-400/40',
      )}></HerouiTooltip>
  )
}
