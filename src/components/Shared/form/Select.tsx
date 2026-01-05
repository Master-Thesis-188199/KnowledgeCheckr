import * as React from 'react'
import { Check, ChevronDown, Loader2Icon, Plus, SearchX } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/Shared/Popover'
import { cn } from '@/lib/Shared/utils'
import { Command, CommandGroup, CommandInput, CommandItem } from '@/src/components/shadcn/command'

/*
  Credits: This component originates from: https://github.com/merthanmerter/shadcn-creatable-select/tree/main
*/

interface Option {
  value: string
  label: string
}

interface CreatableSelectProps extends Classnames {
  options: Option[]
  defaultValue?: Option
  isLoading?: boolean
  name?: string
  id?: string
  onChange?: (value: string) => void
  createable?: boolean
  reset?: boolean
  disabled?: boolean
}

interface Classnames {
  selectTriggerClassname?: string
  popoverContentClassname?: string
}

interface State {
  open: boolean
  value: string
  query: string
  newOptions: Option[]
}

type Action =
  | { type: 'SET_OPEN'; payload: boolean }
  | { type: 'SET_VALUE'; payload: string }
  | { type: 'SET_QUERY'; payload: string }
  | { type: 'SET_NEW_OPTIONS'; payload: Option[] }
  | { type: 'ADD_OPTION'; payload: Option }

const matches = (str: string, query: string, exact: boolean = false) => (exact ? str.toLowerCase() === query.toLowerCase() : str.toLowerCase().includes(query.toLowerCase()))

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_OPEN':
      return { ...state, open: action.payload }
    case 'SET_VALUE':
      return { ...state, value: action.payload }
    case 'SET_QUERY':
      return { ...state, query: action.payload }
    case 'SET_NEW_OPTIONS':
      return { ...state, newOptions: action.payload }
    case 'ADD_OPTION':
      return {
        ...state,
        newOptions: [...state.newOptions, action.payload],
        value: action.payload.value,
      }
    default:
      return state
  }
}

export default function Select({ options, defaultValue, isLoading = false, name, id, onChange, createable, popoverContentClassname, selectTriggerClassname, disabled }: CreatableSelectProps) {
  const [keySelection, setKeySelection] = React.useState<number>(options.findIndex((o) => o.value === defaultValue?.value) || -1)

  const initialState: State = {
    open: false,
    value: defaultValue?.value || '',
    query: '',
    newOptions: options,
  }

  const [state, dispatch] = React.useReducer(reducer, initialState)
  // const reset = () => dispatch({ type: 'SET_VALUE', payload: defaultValue?.value || '' })

  React.useEffect(() => {
    const items = state.query ? state.newOptions.filter((option) => option.label.toLowerCase().includes(state.query.toLowerCase())) : state.newOptions
    if (items.length === 0) return

    dispatch({ type: 'SET_VALUE', payload: items.at(keySelection % items.length)!.value })
  }, [keySelection, state.query])

  React.useEffect(() => {
    if (onChange && !state.open) {
      onChange(state.value)
    }
  }, [state.value])

  React.useEffect(() => {
    // WHen re-rendered e.g. dialog in which it is used is re-rendered => reset to default value
    dispatch({ type: 'SET_VALUE', payload: defaultValue?.value || '' })
  }, [])

  const createOption = () => {
    if (!state.newOptions.find((o) => o.value === state.query)) {
      const newOption = { value: state.query, label: state.query }
      dispatch({ type: 'ADD_OPTION', payload: newOption })
      console.log(`Creating new option => ${newOption.value}`)
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
          disabled={isLoading || disabled}
          className={cn(
            'inline-flex h-9 items-center justify-between gap-2 rounded-md px-3 py-2 text-sm whitespace-nowrap capitalize ring-1 placeholder:text-[15px] hover:cursor-pointer',
            'ring-ring dark:ring-ring bg-input dark:bg-input/30 text-neutral-600 placeholder:text-neutral-400/90 dark:text-neutral-300/80 dark:placeholder:text-neutral-600',
            'hover:ring-ring-hover focus:ring-ring-focus dark:hover:ring-ring-hover dark:focus:ring-ring-focus',
            state.open && 'ring-ring-focus dark:ring-ring-focus',
            'focus-visible:ring-ring-focus dark:focus-visible:ring-ring-focus focus-visible:ring-[1.2px]',
            'disabled:ring-ring-subtle dark:disabled:ring-ring-subtle disabled:cursor-not-allowed disabled:opacity-50',
            selectTriggerClassname,
          )}>
          {isLoading ? <Loader2Icon className='h-4 w-4 animate-spin' /> : state.value || 'Select option...'}
          <ChevronDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
        </PopoverTrigger>
        <PopoverContent aria-label={`popover-content-${name}`} className={cn('w-[210px] overflow-auto border-neutral-400/60 p-0 dark:border-neutral-600', popoverContentClassname)}>
          <Command className='bg-neutral-100 dark:bg-neutral-800'>
            <CommandInput
              value={state.query}
              onValueChange={(query) => dispatch({ type: 'SET_QUERY', payload: query })}
              placeholder='Search option...'
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
                    if (!state.query || state.newOptions.filter((o) => o.value.includes(state.query)).length > 0) {
                      dispatch({ type: 'SET_OPEN', payload: false })
                      if (onChange) onChange(state.value)
                    } else {
                      createOption()
                    }

                    break
                }
              }}
            />
            <CommandGroup className='mb-1 *:space-y-1'>
              {state.newOptions
                .filter((o) => o.value.includes(state.query))
                .map((option, i) => (
                  <CommandItem
                    className={cn(
                      'hover:ring-ring dark:hover:ring-ring cursor-pointer text-sm text-neutral-500 hover:ring-1 data-[selected="true"]:hover:bg-neutral-200/50 dark:text-neutral-400/80 dark:data-[selected="true"]:hover:bg-neutral-700/50',
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
                    <Check className={cn('ml-auto h-4 w-4 hover:cursor-pointer', state.value === option.value ? 'opacity-100' : 'opacity-0')} />
                  </CommandItem>
                ))}
              {state.newOptions.filter((option) => matches(option.value, state.query)).length === 0 && (
                <div className='flex items-center gap-2 px-2 text-sm text-neutral-600/80 dark:text-neutral-400'>
                  <SearchX className='size-4' />
                  No Categories found
                </div>
              )}
              {createable && state.query && !state.newOptions.some((option) => matches(option.label, state.query, true)) && (
                <CommandItem
                  key={state.query}
                  value={state.query}
                  className={cn(
                    'mt-2 rounded-t-none border-t-[1.5px] border-dashed pt-2 hover:cursor-pointer hover:ring-1',
                    'border-neutral-400/80 text-neutral-800 dark:border-neutral-500 dark:text-neutral-300/90',
                    'dark:hover:ring-ring hover:ring-ring hover:bg-neutral-300 dark:hover:bg-neutral-600',
                  )}
                  onSelect={() => createOption()}>
                  Create category &quot;{state.query}&quot;
                  <Plus
                    className='ml-auto h-4 w-4 cursor-pointer'
                    onClick={(e) => {
                      e.stopPropagation()
                      dispatch({ type: 'SET_QUERY', payload: '' })
                    }}
                  />
                </CommandItem>
              )}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  )
}
