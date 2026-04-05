import { ChangeEvent, ComponentProps, JSX, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { InfoIcon, TriangleAlertIcon } from 'lucide-react'
import { FieldValues, UseFormReturn } from 'react-hook-form'
import { FormControl, FormField, FormLabel, FormMessage } from '@/src/components/shadcn/form'
import { Input as ShadcnInput } from '@/src/components/shadcn/input'
import { Textarea } from '@/src/components/shadcn/textarea'
import Tooltip from '@/src/components/Shared/Tooltip'
import { cn } from '@/src/lib/Shared/utils'
import { DescriptionMap, getDescriptionForRhfName } from '@/src/schemas/utils/extractDescriptions'
import { Any } from '@/types'
type BaseFieldProps<Values extends FieldValues> = {
  form: UseFormReturn<Values>
  name: Parameters<typeof FormField<Values>>['0']['name']
  label?: string
  descriptions?: DescriptionMap
  showLabel?: boolean
  labelClassname?: string
  children?: React.ReactNode
  containerClassname?: string
  modifyValue?: (value: Any) => Any
}

type InputFieldProps = {
  variant?: 'input'
  onChange?: (values: ChangeEvent<HTMLInputElement>['target']) => unknown
} & Omit<ComponentProps<'input'>, 'onChange' | 'name' | 'form'>

type TextareaFieldProps = {
  variant: 'textarea'
  onChange?: (values: ChangeEvent<HTMLTextAreaElement>['target']) => unknown
} & Omit<ComponentProps<typeof Textarea>, 'onChange' | 'name' | 'form' | 'children' | 'type'>

type FieldProps<Values extends FieldValues> = BaseFieldProps<Values> & (InputFieldProps | TextareaFieldProps)

export default function Field<Values extends FieldValues>(props: BaseFieldProps<Values> & InputFieldProps): JSX.Element
export default function Field<Values extends FieldValues>(props: BaseFieldProps<Values> & TextareaFieldProps): JSX.Element
export default function Field<Values extends FieldValues>({
  form,
  name,
  onChange,
  variant = 'input',
  label,
  descriptions,
  showLabel = true,
  labelClassname,
  containerClassname,
  children,
  modifyValue,
  ...props
}: FieldProps<Values>) {
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

        const ControlledComponent = variant === 'textarea' ? Textarea : ShadcnInput

        // when true --> prevents layout shifts when switching between error / description by setting min-h to animation-container. Note this "feature" is only enabled when there is something to switch between (thus, when there is a description (&& !!description))
        const keepAnimationContainerSize = previousFocusState.current && (showDescription || hasError) && !!description

        const fieldOnChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
          // use 'custom' onChange to override value
          if (onChange) {
            return field.onChange({
              ...e,
              target: { value: onChange(e.target as Any) },
            })
          }

          // auto-support number inputs to use `valueAsNumber`
          if (variant === 'input' && (props as InputFieldProps).type === 'number') {
            return field.onChange({ ...e, target: { ...e.target, value: (e as ChangeEvent<HTMLInputElement>).target.valueAsNumber } })
          }

          return field.onChange(e)
        }

        return (
          <>
            <FormLabel className={cn('self-baseline pl-1', label === undefined && 'capitalize', labelClassname, !showLabel && 'hidden')}>{label ?? field.name}</FormLabel>

            <div className={cn('relative grid', containerClassname)}>
              <FormControl>
                <ControlledComponent
                  {...field}
                  {...(props as Any)}
                  value={modifyValue ? modifyValue(field.value) : field.value}
                  disabled={field.disabled || props.disabled}
                  className={cn('peer hover:cursor-text', (description || hasError) && 'pr-8', props.className)}
                  onFocus={(e) => {
                    setIsFocused(true)
                    props.onFocus?.(e as Any)
                  }}
                  onBlur={(e) => {
                    setIsFocused(false)
                    props.onBlur?.(e as Any)
                    field.onBlur()
                  }}
                  onChange={fieldOnChange}
                />
              </FormControl>

              <AnimatePresence mode='wait'>
                {!hasError && (
                  <Tooltip disabled={hasError || !description} content={description} pinnable>
                    <motion.div
                      data-disabled={field.disabled || props.disabled}
                      exit={{ opacity: 0 }}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2, ease: 'easeOut' }}
                      key='info-icon'
                      onMouseOver={() => setIsHovered(true)}
                      onMouseLeave={() => setIsHovered(false)}
                      aria-label='Show field description'
                      role='button'
                      className={cn(
                        'absolute inset-y-0 top-2.75 right-3 z-10 flex items-baseline text-muted-foreground hover:cursor-pointer hover:text-current dark:hover:text-current',
                        // disabled state styles
                        'data-[disabled=true]:text-muted-foreground/60 data-[disabled=true]:hover:text-muted-foreground/70 dark:data-[disabled=true]:hover:text-muted-foreground',
                        // positions the icon next to the checkbox
                        variant === 'input' && (props as InputFieldProps).type === 'checkbox' && 'inset-y-0 right-auto left-7 items-center',
                        !description && 'hidden',
                      )}>
                      <InfoIcon className={cn('size-4')} />
                    </motion.div>
                  </Tooltip>
                )}
                {hasError && (
                  <motion.div
                    exit={{ opacity: 0 }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    key='error-icon'
                    className={cn(
                      'absolute inset-y-0 top-2.5 right-3 z-10 flex items-baseline text-destructive',
                      // positions the icon next to the checkbox
                      variant === 'input' && (props as InputFieldProps).type === 'checkbox' && 'top-0.5 right-auto bottom-0 left-7 items-baseline',
                    )}>
                    <TriangleAlertIcon className={cn('size-4')} />
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode='wait' initial={false}>
                {hasError ? <RenderInlineError animationDuration={animationDuration} /> : null}
              </AnimatePresence>
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
