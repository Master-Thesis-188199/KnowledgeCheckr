'use client'

import { useCallback, useEffect, useState } from 'react'
import { CommandLoading } from 'cmdk'
import { Check, ChevronsUpDown, LoaderCircle } from 'lucide-react'
import { Button } from '@/components/shadcn/button'
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/shadcn/command'
import { useCollaboratorContext } from '@/src/components/checks/create/(sections)/CollaboratorProvider'
import { Popover, PopoverContent, PopoverTrigger } from '@/src/components/Shared/Popover'
import { cn } from '@/src/lib/Shared/utils'

type CollaboratorItem = {
  id: string
  name: string
}

export default function CollaboratorSelection() {
  const MAX_SELECTION_DISPLAY = 1

  const { users } = useCollaboratorContext()
  const [selectionStatus, setSelectionStatus] = useState<'require-min-input' | 'no-matches-found' | 'ok' | 'loading'>('require-min-input')

  const [open, setOpen] = useState(false)
  const [selectedCollaborators, setSelectedCollaborators] = useState<CollaboratorItem[]>([])
  const [shownUsers, setShownUsers] = useState<CollaboratorItem[]>([])

  const updateSelection = useCallback(
    (selection: CollaboratorItem) => setSelectedCollaborators((prev) => (prev.includes(selection) ? prev.filter((ps) => ps !== selection) : prev.concat([selection]))),
    [setSelectedCollaborators],
  )
  const isSelected = (selected: CollaboratorItem) => selectedCollaborators.find((s) => s.id === selected.id)

  useEffect(() => {
    if (open) return

    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShownUsers(selectedCollaborators) // clear un-selected user-information from command-list
  }, [open])

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant='input' role='combobox' aria-expanded={open} className='w-[200px] justify-between'>
          <span className='truncate'>
            {selectedCollaborators.length === 0 ? (
              'Add contributors'
            ) : (
              <>
                {selectedCollaborators
                  .slice(0, MAX_SELECTION_DISPLAY)
                  .map((s) => s.name)
                  .join(',')}
              </>
            )}
          </span>
          <span>{selectedCollaborators.length > MAX_SELECTION_DISPLAY && `and ${selectedCollaborators.length - MAX_SELECTION_DISPLAY} more`}</span>
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
                setShownUsers(selectedCollaborators)
                return
              }
              setSelectionStatus('loading')

              const matches = users.filter((user) => !selectedCollaborators.find((s) => s.id === user.id) && user.name.toLowerCase().includes(search.toLowerCase()))
              if (matches.length === 0) return setSelectionStatus('no-matches-found')

              // console.log(`Found ${matches.length} matching users...`, matches)

              setShownUsers(selectedCollaborators.concat(matches.map((u) => ({ name: u.name, id: u.id }))))

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

            {shownUsers.map((item) => {
              return (
                <CommandItem
                  key={`user-${item.id}`}
                  value={item.name}
                  onSelect={() => {
                    updateSelection(item)
                  }}>
                  {item.name}
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
