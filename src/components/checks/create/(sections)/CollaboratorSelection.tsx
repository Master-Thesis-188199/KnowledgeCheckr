'use client'

import { useCallback, useEffect, useState } from 'react'
import { CommandLoading } from 'cmdk'
import { Check, ChevronsUpDown, LoaderCircle } from 'lucide-react'
import { Button } from '@/components/shadcn/button'
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/shadcn/command'
import { useCollaboratorContext } from '@/src/components/checks/create/(sections)/CollaboratorProvider'
import { Popover, PopoverContent, PopoverTrigger } from '@/src/components/Shared/Popover'
import { cn } from '@/src/lib/Shared/utils'

export default function CollaboratorSelection() {
  const MAX_SELECTION_DISPLAY = 1

  const { users } = useCollaboratorContext()
  const [selectionStatus, setSelectionStatus] = useState<'require-min-input' | 'no-matches-found' | 'ok' | 'loading'>('require-min-input')

  const [open, setOpen] = useState(false)
  const [selection, setSelection] = useState<string[]>([])
  const [items, setItems] = useState<string[]>([])

  const updateSelection = useCallback((selection: string) => setSelection((prev) => (prev.includes(selection) ? prev.filter((ps) => ps !== selection) : prev.concat([selection]))), [setSelection])
  const isSelected = (selected: string) => selection.includes(selected)

  useEffect(() => {
    if (open) return

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setItems(selection) // clear un-selected user-information from command-list
  }, [open])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='input' role='combobox' aria-expanded={open} className='w-[200px] justify-between'>
          <span className='truncate'>{selection.length === 0 ? 'Add contributors' : <>{selection.slice(0, MAX_SELECTION_DISPLAY).join(',')}</>}</span>
          <span>{selection.length > MAX_SELECTION_DISPLAY && `and ${selection.length - MAX_SELECTION_DISPLAY} more`}</span>
          <ChevronsUpDown className='opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-[200px] p-0'>
        <Command loop>
          <CommandInput
            placeholder='Search users...'
            className='h-9'
            onValueChange={async (search) => {
              if (search.length < 3) {
                setSelectionStatus('require-min-input')
                setItems(selection)
                return
              }
              setSelectionStatus('loading')

              const matches = users.filter((user) => !selection.includes(user.name) && user.name.toLowerCase().includes(search.toLowerCase()))
              // console.log(`Found ${matches.length} matching users...`, matches)

              setItems(selection.concat(matches.map((user) => user.name)))

              if (matches.length === 0) return setSelectionStatus('no-matches-found')

              setSelectionStatus('ok')
            }}
          />
          <CommandList>
            {selectionStatus === 'require-min-input' && <CommandEmpty className='py-4 text-center text-sm dark:text-neutral-300/80'>You provide at least 3 characters to find matches</CommandEmpty>}
            {selectionStatus === 'no-matches-found' && <CommandEmpty className='py-4 text-center text-sm dark:text-neutral-300/80'>No matching users found. </CommandEmpty>}

            {selectionStatus === 'loading' && (
              <CommandLoading className='flex min-h-10 items-center justify-center py-4 text-sm text-neutral-600 *:flex *:items-center *:gap-2 dark:text-neutral-300'>
                <LoaderCircle className='size-5 animate-spin' />
                Loading more users
              </CommandLoading>
            )}
            {items.map((item) => {
              return (
                <CommandItem
                  key={`word-${item}`}
                  value={item}
                  onSelect={(currentValue) => {
                    updateSelection(currentValue)
                  }}>
                  {item}
                  <Check className={cn('ml-auto', isSelected(item) ? 'opacity-100' : 'opacity-0')} />
                </CommandItem>
              )
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
