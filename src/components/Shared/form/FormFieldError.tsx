import React from 'react'
import { TriangleAlertIcon } from 'lucide-react'
import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'
import { cn } from '@/src/lib/Shared/utils'

function getNestedError<T extends FieldValues>(errors: FieldErrors<T>, path: string): undefined | { message: string } {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
  return path.split('.').reduce((prev, key) => prev && prev[key], errors)
}

export default function FormFieldError<FormData extends FieldValues>({
  field,
  errors,
  className,
  showIcon,
}: {
  field: Parameters<UseFormRegister<FormData>>['0'] | 'root'
  errors: FieldErrors<FormData>
  className?: string
  showIcon?: boolean
}) {
  const error = getNestedError(errors, String(field))
  if (!error || !error.message) return null

  return (
    <div data-slot='icon-form-field-error-wrapper' className={cn('flex items-center gap-2 text-red-400 dark:text-red-400/80', className)}>
      {showIcon && <TriangleAlertIcon className='size-4.5' />}
      <p data-field-error={field} aria-label={`field-error-${String(field)}`} className={twMerge('text-[15px] text-red-400 dark:text-red-400/80')}>
        {error.message}
      </p>
    </div>
  )
}
