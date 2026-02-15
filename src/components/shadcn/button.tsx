import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { LoaderCircleIcon } from 'lucide-react'
import { cn } from '@/lib/Shared/utils'
import { RippleButton } from '@/src/components/shadcn/ripple-button'

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-md text-sm font-medium whitespace-nowrap outline-none select-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 enabled:hover:cursor-pointer disabled:opacity-50 disabled:hover:cursor-not-allowed aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary: cn(
          'shadow-xs enabled:hover:ring-[1.5px]',
          'bg-neutral-500 text-white shadow-neutral-400 ring-neutral-600 enabled:hover:bg-neutral-500/80',
          'enabled:active:scale-[101%] enabled:active:bg-neutral-600/95!',
          'dark:bg-black dark:text-neutral-200 dark:shadow-neutral-800 dark:ring-neutral-600 dark:enabled:hover:bg-neutral-900 dark:enabled:active:bg-neutral-700!',
        ),
        destructive:
          'bg-destructive text-white shadow-xs focus-visible:ring-destructive/20 enabled:hover:bg-destructive/80 enabled:active:bg-destructive/90! dark:bg-destructive/60 dark:focus-visible:ring-destructive/40',
        outline:
          'bg-transparent text-secondary-foreground shadow-xs ring-1 ring-input-ring enabled:hover:bg-secondary/80 disabled:ring-neutral-300 dark:text-neutral-200 dark:ring-input-ring dark:enabled:hover:bg-neutral-700 dark:disabled:ring-neutral-500',
        secondary: 'bg-secondary text-secondary-foreground shadow-xs enabled:hover:bg-secondary/80',
        ghost:
          'enabled:hover:bg-neutral-400/30 enabled:hover:text-accent-foreground/60 enabled:active:ring-2 enabled:active:ring-accent dark:enabled:hover:bg-accent/60 dark:enabled:hover:text-accent-foreground/55 dark:enabled:active:bg-accent/90',
        link: 'text-primary underline-offset-4 enabled:hover:underline',
        base: cn(
          'bg-neutral-100/80 ring-1 ring-ring-subtle dark:bg-neutral-700/40',
          'enabled:hover:bg-neutral-50/80 enabled:hover:ring-ring enabled:active:bg-neutral-200/90 enabled:active:ring-ring-focus dark:enabled:hover:bg-neutral-700/70 dark:enabled:active:bg-neutral-700/90',
        ),
        input: cn(
          'border border-input-ring bg-input',
          'enabled:focus-visible:border-ring-hover enabled:focus-visible:ring-[3px] enabled:focus-visible:ring-ring-hover/50',
          'enabled:hover:border-ring-hover dark:enabled:hover:border-ring-hover',
          'aria-invalid:border-destructive aria-invalid:ring-destructive/20 enabled:aria-invalid:hover:border-destructive dark:aria-invalid:ring-destructive/40',
        ),
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 gap-1.5 rounded-md px-3 has-[>svg]:px-2.5',
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

export type SimpleButtonProps = Omit<React.ComponentProps<'button'>, 'onAnimationStart' | 'onDrag' | 'onDragEnd' | 'onDragStart' | 'style'> &
  VariantProps<typeof buttonVariants> & {
    isLoading?: boolean
  }

function Button({ className, variant, size, isLoading, children, ...props }: SimpleButtonProps) {
  const LoadingIndicator = <LoaderCircleIcon className='size-4 animate-spin' />

  return (
    <button data-slot='button' className={cn(buttonVariants({ variant, size, className }))} {...props}>
      {isLoading ? LoadingIndicator : null}
      {children}
    </button>
  )
}

export { Button as SimpleButton, RippleButton as Button, buttonVariants }
