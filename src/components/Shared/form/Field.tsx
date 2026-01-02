import { ChangeEvent, HTMLProps, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { InfoIcon, TriangleAlertIcon } from 'lucide-react'
import { UseFormReturn } from 'react-hook-form'
import { FormControl, FormDescription, FormField, FormLabel, FormMessage } from '@/src/components/shadcn/form'
import { Input as ShadcnInput } from '@/src/components/shadcn/input'
import { cn } from '@/src/lib/Shared/utils'
import { KnowledgeCheck, KnowledgeCheckSchema } from '@/src/schemas/KnowledgeCheck'

export default function Field({
  form,
  name,
  onChange,
  label,
  ...props
}: {
  form: UseFormReturn<KnowledgeCheck>
  name: Parameters<typeof FormField<KnowledgeCheck>>['0']['name']
  label?: string
  onChange?: (values: Pick<ChangeEvent<HTMLInputElement>['target'], 'value' | 'valueAsDate' | 'valueAsNumber'>) => unknown
} & Pick<HTMLProps<HTMLInputElement>, 'value' | 'defaultValue' | 'defaultChecked' | 'type' | 'placeholder'>) {
  const [isFocused, setIsFocused] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  return (
    <FormField
      control={form.control}
      name={name ?? 'name'}
      render={({ field, fieldState }) => {
        const hasError = !!fieldState.error
        const showDescription = (isFocused && !hasError) || isHovered
        const description = KnowledgeCheckSchema._def.schema.shape[field.name as keyof KnowledgeCheck]?.description ?? ''

        return (
          <>
            <FormLabel className='self-baseline capitalize'>{label ?? field.name}</FormLabel>

            {/* moves input indicators like 'number' | 'date' to the left to make room for the info / error icon */}
            <div className='relative grid **:[&::-webkit-calendar-picker-indicator]:-translate-x-6 **:[&::-webkit-inner-spin-button]:-translate-x-6'>
              <FormControl>
                {/* @ts-expect-error The field-value is currently equal to the property of the `KnowledgeCheck` object that matches the name. Thus, not just 'string' | 'number' but also objects. */}
                <ShadcnInput
                  className='peer hover:cursor-text'
                  {...props}
                  {...field}
                  onFocus={(e) => {
                    setIsFocused(true)
                    field.onBlur?.()
                  }}
                  onBlur={() => {
                    setIsFocused(false)
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
                    className={cn('text-muted-foreground absolute inset-y-0 right-3 z-10 flex items-center hover:cursor-pointer hover:text-current dark:hover:text-current')}>
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
                    className={cn('text-destructive absolute inset-y-0 right-3 z-10 flex items-center')}>
                    <TriangleAlertIcon className={cn('size-4')} onMouseOver={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} />
                  </motion.div>
                )}
              </AnimatePresence>

              <div className='relative'>
                <AnimatePresence mode='wait' initial={false}>
                  {hasError ? (
                    <motion.div
                      key='error'
                      className='absolute inset-0 top-1 left-2'
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 2 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      aria-live='polite'>
                      <FormMessage />
                    </motion.div>
                  ) : showDescription && description ? (
                    <motion.div
                      key='desc'
                      className='absolute inset-0 top-1 left-2 z-10'
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 2 }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}>
                      <FormDescription className='-ml-2 bg-[#EEEEEF] p-2 pt-0 dark:bg-neutral-800'>{description}</FormDescription>
                    </motion.div>
                  ) : (
                    <></>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </>
        )
      }}
    />
  )
}
