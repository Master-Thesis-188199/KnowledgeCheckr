import { FieldErrors, FieldValues, UseFormRegister } from 'react-hook-form'
import { twMerge } from 'tailwind-merge'

function getNestedError<T extends FieldValues>(errors: FieldErrors<T>, path: string): undefined | { message: string } {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //@ts-expect-error
  return path.split('.').reduce((prev, key) => prev && prev[key], errors)
}

export default function FormFieldError<FormData extends FieldValues>({
  field,
  errors,
  className,
}: {
  field: Parameters<UseFormRegister<FormData>>['0'] | 'root'
  errors: FieldErrors<FormData>
  className?: string
}) {
  const error = getNestedError(errors, String(field))
  if (!error || !error.message) return null

  return (
    <div aria-label={`field-error-${String(field)}`} className={twMerge('text-[15px] text-red-400 dark:text-red-400/80', className)}>
      {error.message}
    </div>
  )
}
