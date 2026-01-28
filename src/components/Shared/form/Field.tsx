import { ChangeEvent, HTMLProps, useEffect, useRef, useState } from 'react'
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
  containerClassname,
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
  containerClassname?: string
  onChange?: (values: ChangeEvent<HTMLInputElement>['target']) => unknown
  modifyValue?: (value: Any) => Any
} & Omit<HTMLProps<HTMLInputElement>, 'onChange' | 'name' | 'form'>) {
  const [isFocused, setIsFocused] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const previousFocusState = useRef(false)

  // smooth animations when focussed, quicker animations when hovering ---> affects only description animation that is shown onHover
  const animationDuration = isHovered && !isFocused ? 0.3 : 0.6

  useEffect(() => {
    previousFocusState.current = isFocused
  }, [isFocused])

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field, fieldState }) => {
        const hasError = !!fieldState.error
        const showDescription = (isFocused && !hasError) || isHovered
        const description = descriptions ? getDescriptionForRhfName(descriptions, field.name) : undefined

        // when true --> prevents layout shifts when switching between error / description by setting min-h to animation-container. Note this "feature" is only enabled when there is something to switch between (thus, when there is a description (&& !!description))
        const keepAnimationContainerSize = previousFocusState.current && (showDescription || hasError) && !!description

        const fieldOnChange = (e: ChangeEvent<HTMLInputElement>) => {
          // use 'custom' onChange to override value
          if (onChange) {
            return field.onChange({
              ...e,
              target: { value: onChange(e.target) },
            })
          }

          // auto-support number inputs to use `valueAsNumber`
          if (props.type === 'number') {
            return field.onChange({ ...e, target: { ...e.target, value: e.target.valueAsNumber } })
          }

          return field.onChange(e)
        }

        return (
          <>
            <FormLabel className={cn('self-baseline pl-1', label === undefined && 'capitalize', labelClassname, !showLabel && 'hidden')}>{label ?? field.name}</FormLabel>

            <div
              className={cn(
                'relative grid',
                // moves input indicators like 'number' | 'date' to the left to make room for the info / error icon
                (description || hasError) && '**:[&::-webkit-calendar-picker-indicator]:-translate-x-6 **:[&::-webkit-inner-spin-button]:-translate-x-6',
                containerClassname,
              )}>
              <FormControl>
                <ShadcnInput
                  autoComplete={field.name.includes('password') ? 'current-password' : field.name}
                  className='peer hover:cursor-text'
                  {...field}
                  value={modifyValue ? modifyValue(field.value) : field.value}
                  {...props}
                  disabled={field.disabled || props.disabled}
                  onFocus={(e) => {
                    // this prevents the description from being shown when the checkbox is clicked --> thus has focus
                    if (props.type !== 'checkbox') setIsFocused(true)
                    props.onFocus?.(e)
                  }}
                  onBlur={(e) => {
                    setIsFocused(false)
                    props.onBlur?.(e)
                    field.onBlur()
                  }}
                  onChange={fieldOnChange}
                />
              </FormControl>

              <AnimatePresence mode='wait'>
                {!hasError && (
                  <motion.div
                    data-disabled={field.disabled || props.disabled}
                    exit={{ opacity: 0 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    key='info-icon'
                    onMouseOver={() => setIsHovered(true)}
                    onMouseLeave={() => setIsHovered(false)}
                    className={cn(
                      'text-muted-foreground absolute inset-y-0 top-2.5 right-3 z-10 flex items-baseline hover:cursor-pointer hover:text-current dark:hover:text-current',
                      // disabled state styles
                      'data-[disabled=true]:text-muted-foreground/60 data-[disabled=true]:hover:text-muted-foreground/70 dark:data-[disabled=true]:hover:text-muted-foreground',
                      // positions the icon next to the checkbox
                      props.type === 'checkbox' && 'top-0.5 right-auto bottom-0 left-7 items-baseline',
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
                    className={cn(
                      'text-destructive absolute inset-y-0 top-2.5 right-3 z-10 flex items-baseline',
                      // positions the icon next to the checkbox
                      props.type === 'checkbox' && 'top-0.5 right-auto bottom-0 left-7 items-baseline',
                    )}>
                    <TriangleAlertIcon className={cn('size-4')} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* //* set min-h when state changes but is still in focus, prevent layout shifts when switching between error/description. (!!description ensures that this feature is only enabled when there is a description to display)*/}
              <div className={cn('relative', keepAnimationContainerSize && 'min-h-6')}>
                <AnimatePresence mode='wait' initial={false}>
                  {hasError ? <RenderInlineError animationDuration={animationDuration} /> : null}
                  {!hasError && showDescription && description ? <RenderInlineDescription description={description} animationDuration={animationDuration} /> : null}
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

function RenderInlineError({ animationDuration }: { animationDuration: number }) {
  return (
    <motion.div
      key='error'
      initial={{ opacity: 0, height: 0, y: -4 }}
      animate={{ opacity: 1, height: 'auto', y: 0 }}
      exit={{ opacity: 0, height: 0, y: -4 }}
      transition={{ duration: animationDuration, ease: 'easeOut' }}
      className='overflow-hidden'
      aria-live='polite'>
      <div className='min-h-6 pt-1'>
        <FormMessage />
      </div>
    </motion.div>
  )
}

function RenderInlineDescription({ description, animationDuration }: { description: string; animationDuration: number }) {
  return (
    <motion.div
      key='desc'
      initial={{ opacity: 0, height: 0, y: -4 }}
      animate={{ opacity: 1, height: 'auto', y: 0 }}
      exit={{ opacity: 0, height: 0, y: -4 }}
      transition={{ duration: animationDuration, ease: 'easeOut' }}
      className='overflow-hidden'>
      <div className='min-h-6 pt-1'>
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
