import { Popover, PopoverContent, PopoverTrigger } from '@/components/Shared/Popover'
import { cn } from '@/lib/Shared/utils'
import { Button } from '@/src/components/shadcn/button'
import { Command, CommandGroup, CommandInput, CommandItem } from '@/src/components/shadcn/command'
import { Check, ChevronDown, Loader2Icon, X } from 'lucide-react'
import * as React from 'react'

/*
  Credits: This component originates from: https://github.com/merthanmerter/shadcn-creatable-select/tree/main
*/

interface Option {
  value: string
  label: string
}

interface CreatableSelectProps {
  options: Option[]
  defaultValue?: Option
  isLoading?: boolean
  name?: string
  id?: string
  onChange?: (value: string) => void
  createable?: boolean
  reset?: boolean
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

export default function Select({ options, defaultValue, isLoading = false, name, id, onChange, createable }: CreatableSelectProps) {
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
          asChild
          className={cn(
            'w-full border-0 ring-1 outline-0 placeholder:text-[15px] hover:cursor-pointer dark:bg-transparent dark:text-neutral-300 dark:ring-neutral-500 dark:placeholder:text-neutral-600 dark:hover:bg-transparent dark:hover:ring-neutral-300/60 dark:focus:ring-neutral-300/80',
            state.open && 'dark:ring-neutral-300/80',
            'focus-visible:ring-1 focus-visible:ring-neutral-300/80',
          )}>
          <Button id={id} variant='outline' role='combobox' aria-expanded={state.open} className='w-full justify-between font-normal capitalize hover:text-inherit' disabled={isLoading}>
            {isLoading ? <Loader2Icon className='h-4 w-4 animate-spin' /> : state.value || 'Select option...'}
            <ChevronDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-[210px] overflow-auto p-0 dark:border-neutral-600 dark:bg-transparent'>
          <Command className='dark:bg-neutral-800'>
            <CommandInput
              value={state.query}
              onValueChange={(query) => dispatch({ type: 'SET_QUERY', payload: query })}
              placeholder='Search option...'
              className='h-9 dark:text-neutral-200 dark:placeholder:text-neutral-400'
              onKeyDown={(e) => {
                switch (e.key) {
                  case 'ArrowDown':
                    setKeySelection((prev) => prev + 1)
                    break

                  case 'ArrowUp':
                    setKeySelection((prev) => prev - 1)
                    break

                  case 'Enter':
                    dispatch({ type: 'SET_OPEN', payload: false })
                    if (onChange) onChange(state.value)
                    break
                }
              }}
            />
            <CommandGroup className='*:space-y-1'>
              {createable && state.query && !state.newOptions.some((option) => matches(option.label, state.query, true)) && (
                <CommandItem
                  key={state.query}
                  value={state.query}
                  className='hover:cursor-pointer dark:hover:bg-neutral-600 dark:focus:bg-neutral-600'
                  onSelect={() => {
                    const newOption = { value: state.query, label: state.query }
                    dispatch({ type: 'ADD_OPTION', payload: newOption })
                    dispatch({ type: 'SET_OPEN', payload: false })
                  }}>
                  Create &quot;{state.query}&quot;
                  <X
                    className='ml-auto h-4 w-4 cursor-pointer'
                    onClick={(e) => {
                      e.stopPropagation()
                      dispatch({ type: 'SET_QUERY', payload: '' })
                    }}
                  />
                </CommandItem>
              )}
              {state.newOptions.map((option, i) => (
                <CommandItem
                  className={cn(
                    'cursor-pointer text-sm hover:ring-1 dark:text-neutral-400 dark:hover:ring-neutral-300/40',
                    state.value === option.value ? 'ring-1 dark:bg-neutral-700/60 dark:text-neutral-300 dark:ring-neutral-500/60' : 'hover:text-inherit',
                  )}
                  key={option.value}
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
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  )
}
