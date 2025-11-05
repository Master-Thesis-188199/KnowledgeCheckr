import { HTMLProps } from 'react'
import { UseFormRegister } from 'react-hook-form'
import { cn } from '@/src/lib/Shared/utils'
import { PracticeData } from '@/src/schemas/practice/PracticeSchema'

export function OpenQuestion({ register, ...props }: { register: UseFormRegister<PracticeData> } & Pick<HTMLProps<HTMLTextAreaElement>, 'disabled'>) {
  return (
    <textarea
      {...props}
      {...register('input')}
      className={cn(
        'rounded-md bg-neutral-100/90 px-3 py-1.5 text-neutral-600 ring-1 ring-neutral-400 outline-none placeholder:text-neutral-400/90 hover:cursor-text hover:ring-neutral-500 focus:ring-[1.2px] focus:ring-neutral-700 dark:bg-neutral-800 dark:text-neutral-300/80 dark:ring-neutral-500 dark:placeholder:text-neutral-400/50 dark:hover:ring-neutral-300/60 dark:focus:ring-neutral-300/80',
        'resize-none',
        'my-auto h-full',
      )}
    />
  )
}
