import * as React from 'react'
import { useIsFirstRender } from '@uidotdev/usehooks'
import { Check, ChevronDown, Loader2Icon, Plus, SearchX } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/Shared/Popover'
import { cn } from '@/lib/Shared/utils'
import { Command, CommandGroup, CommandInput, CommandItem } from '@/src/components/shadcn/command'
import { Any } from '@/types'

/*
  Credits: This component originates from: https://github.com/merthanmerter/shadcn-creatable-select/tree/main
*/

type Option<ValueType> = {
  value: ValueType
  label: string
}

type BaseSelectProps<Options extends readonly Option<Any>[]> = ConfigOptions & {
  mode: 'basic'
  id?: string
  name?: string
  options: Options
  defaultValue?: Options[number]
  isLoading?: boolean
  disabled?: boolean
  onSelect: (option: Options[number]) => void
}

type CreateSelectProps<Options extends readonly Option<Any>[]> = Omit<BaseSelectProps<Options>, 'mode'> & {
  mode: 'create'
  createOptionText?: (searchQuery: string) => string
  onCreate: (label: string) => Options[number]
}

type SelectProps<Options extends readonly Option<Any>[]> = BaseSelectProps<Options> | CreateSelectProps<Options>

interface CreatableSelectProps extends ConfigOptions {
  options: Option<Any>[]
  defaultValue?: Option<Any>
  isLoading?: boolean
  name?: string
  id?: string
  onChange?: (value: string) => void
  createable?: boolean
  reset?: boolean
  disabled?: boolean
}

interface ConfigOptions {
  selectTriggerClassname?: string
  popoverContentClassname?: string
  triggerPlaceholder?: string
  notFoundText?: string
}

interface State<Options extends readonly Option<Any>[]> {
  open: boolean
  label: string
  value: string
  query: string
  newOptions: Options
}

type Action<Options extends readonly Option<Any>[]> =
  | { type: 'SET_OPEN'; payload: boolean }
  | { type: 'SET_VALUE'; value: Options[number]['value']; label: Options[number]['label'] }
  | { type: 'SET_QUERY'; payload: Options[number]['label'] }
  | { type: 'SET_NEW_OPTIONS'; payload: Options }
  | { type: 'ADD_OPTION'; payload: Options[number] }

const matches = (str: string, query: string, exact: boolean = false) => (exact ? str.toLowerCase() === query.toLowerCase() : str.toLowerCase().includes(query.toLowerCase()))

function reducer<Options extends readonly Option<Any>[]>(state: State<Options>, action: Action<Options>): State<Options> {
  switch (action.type) {
    case 'SET_OPEN':
      return { ...state, open: action.payload }
    case 'SET_VALUE':
      return { ...state, value: action.value, label: action.label }
    case 'SET_QUERY':
      return { ...state, query: action.payload }
    case 'SET_NEW_OPTIONS':
      return { ...state, newOptions: action.payload }
    case 'ADD_OPTION':
      //@ts-expect-error Options[number] does not fully satisfy Options. This means that the newly added Option will not show up in the Options-type.
      const options = [...state.newOptions, action.payload] as Options

      return {
        ...state,
        newOptions: options,
        value: action.payload.value,
        label: action.payload.label,
      }
    default:
      return state
  }
}

export default function Select<Options extends readonly Option<Any>[]>({
  options,
  defaultValue,
  isLoading,
  name,
  id,
  onSelect,
  popoverContentClassname,
  selectTriggerClassname,
  disabled,
  mode,
}: BaseSelectProps<Options>): React.ReactNode
export default function Select<Options extends readonly Option<Any>[]>({
  options,
  defaultValue,
  isLoading,
  name,
  id,
  onSelect,
  popoverContentClassname,
  selectTriggerClassname,
  disabled,
  mode,
  onCreate,
}: CreateSelectProps<Options>): React.ReactNode
export default function Select<Options extends readonly Option<Any>[]>({
  options,
  defaultValue,
  isLoading = false,
  name,
  id,
  onSelect,
  popoverContentClassname,
  selectTriggerClassname,
  disabled,
  triggerPlaceholder = 'Search Option',
  notFoundText = 'No Categories found',
  ...rest
}: SelectProps<Options>) {
  const [keySelection, setKeySelection] = React.useState<number>(options.findIndex((o) => o.value === defaultValue?.value) || -1)
  const isFirstRender = useIsFirstRender()

  const initialState: State<Options> = {
    open: false,
    label: defaultValue?.label ?? '',
    value: defaultValue?.value ?? '',
    query: '',
    newOptions: options,
  }

  const [state, dispatch] = React.useReducer<State<Options>, Any>(reducer, initialState)
  // const reset = () => dispatch({ type: 'SET_VALUE', payload: defaultValue?.value || '' })

  React.useEffect(() => {
    const items = state.query ? state.newOptions.filter((option) => option.label.toLowerCase().includes(state.query.toLowerCase())) : state.newOptions
    if (items.length === 0) return

    const option = items.at(keySelection % items.length)!
    dispatch({ type: 'SET_VALUE', value: option?.value, label: option?.label })
  }, [keySelection, state.query])

  React.useEffect(() => {
    if (isFirstRender) return console.log(`[Select] blocking first-render 'onSelect' call with defaultValue.`)

    if (!state.open) {
      console.debug(`[Select] User has selected '${state.label}' with value ${state.value}`)
      onSelect({ label: state.label, value: state.value })
    }
  }, [state.value])

  React.useEffect(() => {
    // WHen re-rendered e.g. dialog in which it is used is re-rendered => reset to default value
    dispatch({ type: 'SET_VALUE', value: defaultValue?.value ?? '', label: defaultValue?.label ?? '' })
  }, [])

  const createOption = () => {
    if (rest.mode !== 'create') return

    if (!state.newOptions.find((o) => o.value === state.query)) {
      const newOption = rest.onCreate(state.query)
      dispatch({ type: 'ADD_OPTION', payload: newOption })
      console.debug(`[Select] new option has been created:`, newOption)
    }

    dispatch({ type: 'SET_OPEN', payload: false })

    setKeySelection(state.newOptions.findIndex((o) => o.value === state.query))
  }

  return (
    <>
      <input
        /* hidden input to store the value
        in case we are using a form */
        className='hidden'
        type='hidden'
        name={name}
        value={state.value}
      />
      <Popover open={state.open} onOpenChange={(open) => dispatch({ type: 'SET_OPEN', payload: open })}>
        <PopoverTrigger
          id={id}
          aria-label={`popover-trigger-${name}`}
          role='combobox'
          aria-expanded={state.open}
          data-selected-key={state.value}
          disabled={isLoading || disabled}
          className={cn(
            'inline-flex h-9 items-center justify-between gap-2 rounded-md px-3 py-2 text-sm whitespace-nowrap capitalize placeholder:text-[15px] hover:cursor-pointer',
            'border border-input-ring transition-[color,box-shadow] outline-none',
            'bg-input text-neutral-600 placeholder:text-neutral-400/90 dark:text-neutral-300/80 dark:placeholder:text-neutral-600',
            'hover:border-ring-hover focus:border-ring-focus dark:hover:border-ring-hover dark:focus:border-ring-focus',
            state.open && 'border-ring-focus ring-[3px] ring-ring-hover/50 dark:border-ring-focus dark:ring-ring-hover/50',

            // outline like styles for focus: and focus-visible

            'focus-visible:border-ring-hover focus-visible:ring-[3px] focus-visible:ring-ring-hover/50',

            'focus:border-ring-hover focus:ring-[3px] focus:ring-ring-hover/50',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:ring-ring-subtle dark:disabled:ring-ring-subtle',
            selectTriggerClassname,
          )}>
          {isLoading ? <Loader2Icon className='size-4 animate-spin' /> : state.label || triggerPlaceholder}
          <ChevronDown className='ml-2 size-4 shrink-0 opacity-50' />
        </PopoverTrigger>
        <PopoverContent aria-label={`popover-content-${name}`} className={cn('w-[210px] overflow-auto border-neutral-400/60 p-0 dark:border-neutral-600', popoverContentClassname)}>
          <Command
            className='bg-neutral-100 dark:bg-neutral-800'
            filter={(_, search) => {
              // by default the filter-mechanisms compares just the values and not the labels.
              // this way the filter yields options that match the query with their value **and/or** label
              if (state.newOptions.filter((o) => o.label.includes(search) || o.value.includes(search))) return 1
              return 0
            }}>
            <CommandInput
              value={state.query}
              onValueChange={(query) => dispatch({ type: 'SET_QUERY', payload: query })}
              placeholder={triggerPlaceholder}
              className='h-9 text-neutral-700 placeholder:text-neutral-500 dark:text-neutral-200 dark:placeholder:text-neutral-400'
              onKeyDown={(e) => {
                switch (e.key) {
                  case 'ArrowDown':
                    setKeySelection((prev) => prev + 1)
                    break

                  case 'ArrowUp':
                    setKeySelection((prev) => prev - 1)
                    break

                  case 'Enter':
                    if (!state.query || state.newOptions.filter((o) => o.label.toLowerCase().includes(state.query.toLowerCase()) || o.value.includes(state.query)).length > 0) {
                      dispatch({ type: 'SET_OPEN', payload: false })
                      onSelect({ label: state.label, value: state.value })
                    } else {
                      createOption()
                    }

                    break
                }
              }}
            />
            <CommandGroup className='*:space-y-1'>
              {state.newOptions
                .filter((o) => o.label.includes(state.query) || o.value.includes(state.query))
                .map((option, i) => (
                  <CommandItem
                    className={cn(
                      'cursor-pointer text-sm text-neutral-500 hover:ring-1 hover:ring-ring data-[selected="true"]:hover:bg-neutral-200/50 dark:text-neutral-400/80 dark:hover:ring-ring dark:data-[selected="true"]:hover:bg-neutral-700/50',
                      // disable / set selected-styles to mimic default styles ^^^   (because the selection is still displayed when element is no longer hovered and is not displayed when select-modal is opened)
                      'data-[selected=true]:bg-transparent data-[selected=true]:text-neutral-500 dark:data-[selected=true]:bg-transparent dark:data-[selected=true]:text-neutral-400/80',

                      'data-[selected="true"]:hover:text-neutral-600 dark:data-[selected="true"]:hover:text-neutral-300/80',
                      state.value === option.value && 'bg-neutral-200/80 text-neutral-700 ring-1 ring-neutral-400/60 dark:bg-neutral-700/60 dark:text-neutral-300 dark:ring-neutral-500/60',
                      state.value === option.value &&
                        'ring-1 ring-neutral-400/60 data-[selected=true]:bg-neutral-200/80 data-[selected=true]:text-neutral-700 dark:ring-neutral-500/60 data-[selected=true]:dark:bg-neutral-700/60 data-[selected=true]:dark:text-neutral-300',
                    )}
                    key={option.value + i}
                    value={option.value}
                    onSelect={() => {
                      // dispatch({ type: 'SET_VALUE', payload: option.value })
                      setKeySelection(i)
                      dispatch({ type: 'SET_OPEN', payload: false })
                    }}>
                    {option.label}
                    <Check className={cn('ml-auto size-4 hover:cursor-pointer', state.value === option.value ? 'opacity-100' : 'opacity-0')} />
                  </CommandItem>
                ))}
              {state.newOptions.filter((o) => o.label.includes(state.query) || o.value.includes(state.query)).length === 0 && (
                <div className='flex items-center gap-2 px-2 text-sm text-neutral-600/80 dark:text-neutral-400'>
                  <SearchX className='size-4' />
                  {notFoundText}
                </div>
              )}
              {rest.mode === 'create' && state.query && !state.newOptions.some((option) => matches(option.label, state.query, true) || matches(option.value, state.query, true)) && (
                <CommandItem
                  key={state.query}
                  value={state.query}
                  className={cn(
                    'mt-2 rounded-t-none border-t-[1.5px] border-dashed pt-2 ring-ring-hover hover:cursor-pointer hover:ring-1',
                    'data-[selected=true]:bg-transparent dark:data-[selected=true]:bg-transparent',
                    'group hover:bg-accent/50!',
                  )}
                  onSelect={() => createOption()}>
                  <Plus
                    className='h-4 w-4 cursor-pointer text-accent-foreground'
                    onClick={(e) => {
                      e.stopPropagation()
                      dispatch({ type: 'SET_QUERY', payload: '' })
                    }}
                  />
                  <span className='underline-offset-4 group-hover:underline'>{rest.createOptionText?.(state.query) ?? `Create new Category "${state.query}"`}</span>
                </CommandItem>
              )}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  )
}
