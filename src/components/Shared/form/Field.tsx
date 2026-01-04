import { ChangeEvent, HTMLProps, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { InfoIcon, TriangleAlertIcon } from 'lucide-react'
import { FieldValues, UseFormReturn } from 'react-hook-form'
import { FormControl, FormDescription, FormField, FormLabel, FormMessage } from '@/src/components/shadcn/form'
import { Input as ShadcnInput } from '@/src/components/shadcn/input'
import { cn } from '@/src/lib/Shared/utils'
import { DescriptionMap, getDescriptionForRhfName } from '@/src/schemas/utils/extractDescriptions'
import { Any } from '@/types'

export default function Field<Values extends FieldValues>({
  form,
  name,
  onChange,
  label,
  descriptions,
  showLabel = true,
  labelClassname,
  className,
  children,
  modifyValue,
  ...props
}: {
  form: UseFormReturn<Values>
  name: Parameters<typeof FormField<Values>>['0']['name']
  label?: string
  descriptions?: DescriptionMap
  showLabel?: boolean
  labelClassname?: string
  children?: React.ReactNode
  onChange?: (values: ChangeEvent<HTMLInputElement>['target']) => unknown
  modifyValue?: (value: Any) => Any
} & Omit<HTMLProps<HTMLInputElement>, 'onChange' | 'name' | 'form'>) {
  const [isFocused, setIsFocused] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <FormField
      control={form.control}
      name={name ?? 'name'}
      render={({ field, fieldState }) => {
        const hasError = !!fieldState.error
        const showDescription = (isFocused && !hasError) || isHovered
        const description = descriptions ? getDescriptionForRhfName(descriptions, field.name) : undefined

        return (
          <>
            <FormLabel className={cn('self-baseline pl-1 capitalize', labelClassname, !showLabel && 'hidden')}>{label ?? field.name}</FormLabel>

            <div
              className={cn(
                'relative grid',
                // moves input indicators like 'number' | 'date' to the left to make room for the info / error icon
                (description || hasError) && '**:[&::-webkit-calendar-picker-indicator]:-translate-x-6 **:[&::-webkit-inner-spin-button]:-translate-x-6',
                className,
              )}>
              <FormControl>
                <ShadcnInput
                  className='peer hover:cursor-text'
                  {...props}
                  {...field}
                  value={modifyValue ? modifyValue(field.value) : field.value}
                  onFocus={(e) => {
                    setIsFocused(true)
                    props.onFocus?.(e)
                  }}
                  onBlur={(e) => {
                    setIsFocused(false)
                    props.onBlur?.(e)
                    field.onBlur()
                  }}
                  onChange={
                    onChange
                      ? (e) =>
                          field.onChange({
                            ...e,
                            target: { value: onChange(e.target) },
                          })
                      : field.onChange
                  }
                />
              </FormControl>

              <AnimatePresence mode='wait'>
                {!hasError && (
                  <motion.div
                    exit={{ opacity: 0 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    key='info-icon'
                    onMouseOver={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className={cn(
                      'text-muted-foreground absolute inset-y-0 top-2.5 right-3 z-10 flex items-baseline hover:cursor-pointer hover:text-current dark:hover:text-current',
                      !description && 'hidden',
                    )}>
                    <InfoIcon className={cn('size-4')} />
                  </motion.div>
                )}
                {hasError && (
                  <motion.div
                    exit={{ opacity: 0 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    key='error-icon'
                    className={cn('text-destructive absolute inset-y-0 top-2.5 right-3 z-10 flex items-baseline')}>
                    <TriangleAlertIcon className={cn('size-4')} />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className='relative'>
                <AnimatePresence mode='wait' initial={false}>
                  {hasError ? <RenderInlineError /> : null}
                  {!hasError && showDescription && description ? <RenderInlineDescription description={description} /> : null}
                </AnimatePresence>
              </div>
              {children}
            </div>
          </>
        )
      }}
    />
  )
}

function RenderInlineError() {
  return (
    <motion.div
      key='error'
      initial={{ opacity: 0, height: 0, y: -4 }}
      animate={{ opacity: 1, height: 'auto', y: 0 }}
      exit={{ opacity: 0, height: 0, y: -4 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className='overflow-hidden'
      aria-live='polite'>
      <div className='pt-1'>
        <FormMessage />
      </div>
    </motion.div>
  )
}

function RenderInlineDescription({ description }: { description: string }) {
  return (
    <motion.div
      key='desc'
      initial={{ opacity: 0, height: 0, y: -4 }}
      animate={{ opacity: 1, height: 'auto', y: 0 }}
      exit={{ opacity: 0, height: 0, y: -4 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className='overflow-hidden'>
      <div className='pt-1'>
        <FormDescription>{description}</FormDescription>
      </div>
    </motion.div>
  )
}

function RenderAbsoluteError() {
  return (
    <motion.div
      key='error'
      className='absolute inset-0 top-1 left-1'
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 2 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      aria-live='polite'>
      <FormMessage />
    </motion.div>
  )
}

function RenderAbsoluteDescription({ description }: { description: string }) {
  return (
    <motion.div
      key='desc'
      className='absolute inset-0 top-1 left-2 z-10'
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 2 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}>
      <FormDescription className='-ml-2 bg-[#EEEEEF] px-2 pt-0 dark:bg-neutral-800'>{description}</FormDescription>
    </motion.div>
  )
}
