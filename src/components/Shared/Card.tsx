import { ComponentPropsWithRef, ElementType, ReactElement } from 'react'
import { twMerge } from 'tailwind-merge'

type BaseProps = {
  disableHoverStyles?: boolean
}

type GenericElementProps<C extends ElementType> = {
  as?: C
} & BaseProps &
  // assign generic-element type props and override element-props that are also in BaseProps
  Omit<ComponentPropsWithRef<C>, keyof BaseProps | 'as'>

export default function Card<C extends ElementType = 'div'>({ as, className, disableHoverStyles, ...props }: GenericElementProps<C>): ReactElement | null {
  const Component = (as || 'div') as ElementType

  return (
    <Component
      {...props}
      className={twMerge(
        'rounded-md bg-neutral-200/40 p-3 ring-1 ring-neutral-400/70 dark:bg-neutral-700/30 dark:ring-neutral-600',
        !disableHoverStyles && 'dark:hover:bg-neutral-700/70 dark:hover:ring-neutral-500/70',
        className,
      )}
    />
  )
}
