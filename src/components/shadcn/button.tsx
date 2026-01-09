import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { LoaderCircleIcon } from 'lucide-react'
import { cn } from '@/lib/Shared/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive enabled:hover:cursor-pointer disabled:hover:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary: cn(
          'shadow-xs enabled:hover:ring-[1.5px] ',
          'bg-neutral-500 ring-neutral-600 shadow-neutral-400 text-white enabled:hover:bg-neutral-500/80 ',
          'enabled:active:!bg-neutral-600/95 enabled:active:scale-[101%]',
          'dark:shadow-neutral-800 dark:bg-black dark:ring-neutral-600 dark:text-neutral-200 dark:enabled:hover:bg-neutral-900 dark:enabled:active:!bg-neutral-700 dark:!enabled:active:bg-primary/70',
        ),
        destructive:
          'bg-destructive text-white shadow-xs enabled:hover:bg-destructive/80 enabled:active:!bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60',
        outline:
          'bg-transparent ring-1 ring-foreground/50 dark:ring-foreground/25 dark:enabled:hover:bg-neutral-700 text-secondary-foreground shadow-xs enabled:hover:bg-secondary/80 dark:text-neutral-200',
        secondary: 'bg-secondary text-secondary-foreground shadow-xs enabled:hover:bg-secondary/80',
        ghost: 'enabled:hover:bg-accent enabled:active:ring-2 enabled:active:ring-accent enabled:hover:text-accent-foreground dark:enabled:hover:bg-accent/50 dark:enabled:active:bg-accent/90',
        link: 'text-primary underline-offset-4 enabled:hover:underline',
        base: cn(
          'bg-neutral-100/80 dark:bg-neutral-700/40 ring-ring-subtle ring-1',
          'hover:ring-ring hover:bg-neutral-50/80 active:bg-neutral-200/90 active:ring-ring-focus dark:hover:bg-neutral-700/70 dark:active:bg-neutral-700/90 ',
        ),
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5',
        lg: 'h-10 rounded-md px-6 has-[>svg]:px-4',
        icon: 'size-9',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  isLoading,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    isLoading?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  const LoadingIndicator = <LoaderCircleIcon className='size-4 animate-spin' />

  return (
    <Comp
      data-slot='button'
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
      children={
        <>
          {isLoading ? LoadingIndicator : null}
          {props.children}
        </>
      }
    />
  )
}

export { Button, buttonVariants }
