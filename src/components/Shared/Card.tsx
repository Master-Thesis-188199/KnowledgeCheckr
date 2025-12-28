import type { ComponentPropsWithRef, ElementType, ReactElement } from 'react'
import { cn } from '@/src/lib/Shared/utils'

type CardOwnProps = {
  className?: string
  disableInteractions?: boolean
}

export type CardProps<C extends ElementType = 'div'> = {
  /**
   * Which underlying element/component to render.
   * Examples: 'div', 'form', 'input', motion.a, Link, etc.
   */
  as?: C
} & CardOwnProps &
  // Take all props from the chosen element/component,
  // but drop anything we override ('as', 'className', 'disableHoverStyles')
  Omit<ComponentPropsWithRef<C>, keyof CardOwnProps | 'as'>

export default function Card<C extends ElementType = 'div'>({ as, disableInteractions, className, ...rest }: CardProps<C>): ReactElement | null {
  const Component = (as ?? 'div') as ElementType

  return (
    <Component
      {...rest}
      className={cn(
        'rounded-md py-4 ring-1',
        'bg-neutral-200/40 shadow-md shadow-neutral-200 ring-neutral-400/40 dark:bg-neutral-700/30 dark:shadow-neutral-900/60 dark:ring-neutral-600/70',
        !disableInteractions &&
          cn(
            'hover:ring-2 focus:ring-2',
            'enabled:hover:bg-neutral-200/80 enabled:focus:bg-neutral-200/60 enabled:focus:ring-neutral-400 dark:enabled:hover:bg-neutral-700/60 enabled:focus:dark:bg-neutral-700/60 enabled:focus:dark:ring-neutral-500',
          ),
        className,
      )}
    />
  )
}
