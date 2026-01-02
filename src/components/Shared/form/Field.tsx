import { ChangeEvent, HTMLProps, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { UseFormReturn } from 'react-hook-form'
import { FormControl, FormDescription, FormField, FormLabel, FormMessage } from '@/src/components/shadcn/form'
import { Input as ShadcnInput } from '@/src/components/shadcn/input'
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

            <div className='relative grid'>
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
                  onMouseOver={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
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
