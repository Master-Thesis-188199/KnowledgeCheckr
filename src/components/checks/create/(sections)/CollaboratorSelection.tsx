'use client'

import { useCallback, useEffect, useState } from 'react'
import { CommandLoading } from 'cmdk'
import { Check, ChevronsUpDown, LoaderCircle } from 'lucide-react'
import { Button } from '@/components/shadcn/button'
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from '@/components/shadcn/command'
import { useCollaboratorContext } from '@/src/components/checks/create/(sections)/CollaboratorProvider'
import { useCheckStore } from '@/src/components/checks/create/CreateCheckProvider'
import { Popover, PopoverContent, PopoverTrigger } from '@/src/components/Shared/Popover'
import { useScopedI18n } from '@/src/i18n/client-localization'
import { cn } from '@/src/lib/Shared/utils'

type CollaboratorItem = {
  id: string
  name: string
}

export default function CollaboratorSelection() {
  const { users } = useCollaboratorContext()
  const [open, setOpen] = useState(false)
  const t = useScopedI18n('Checks.Create.GeneralSection.CollaboratorSelection')

  const { collaborators: collaboratorIds, updateCollaborators } = useCheckStore((store) => store)
  const [selectedCollaborators, setSelectedCollaborators] = useState<CollaboratorItem[]>(users.filter((u) => collaboratorIds.includes(u.id)).map((u) => ({ id: u.id, name: u.name })))

  const [selectionStatus, setSelectionStatus] = useState<'require-min-input' | 'no-matches-found' | 'ok' | 'loading'>('require-min-input')
  const [shownUsers, setShownUsers] = useState<CollaboratorItem[]>([])

  useEffect(() => {
    // no changes...
    if (selectedCollaborators.map((c) => c.id).every((id) => collaboratorIds.includes(id))) return

    console.log('updating store with collaborators...')
    updateCollaborators(selectedCollaborators.map((c) => c.id))
  }, [selectedCollaborators, updateCollaborators])

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
        <Button variant='input' role='combobox' aria-expanded={open} className='text-muted-foreground w-auto justify-between'>
          <span className='flex-1 truncate text-left'>{selectedCollaborators.length === 0 ? t('collaborators_placeholder') : selectedCollaborators.map((s) => s.name).join(', ')}</span>
          {selectedCollaborators.length > 0 && <span className='text-neutral-500 dark:text-neutral-400'>({selectedCollaborators.length})</span>}
          <ChevronsUpDown className='opacity-50' />
        </Button>
      </PopoverTrigger>
      <PopoverContent className='auto-popover-content-width p-0'>
        <Command loop>
          <CommandInput
            placeholder={t('command_input_placeholder')}
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
            {selectionStatus === 'require-min-input' && <CommandEmpty className='py-4 text-center text-sm text-neutral-600/80 dark:text-neutral-300/80'>{t('command_empty_min_input')}</CommandEmpty>}
            {selectionStatus === 'no-matches-found' && <CommandEmpty className='py-4 text-center text-sm text-neutral-600/80 dark:text-neutral-300/80'>{t('command_empty_no_users')}</CommandEmpty>}

            {selectionStatus === 'loading' && (
              <CommandLoading className='flex min-h-10 items-center justify-center py-4 text-sm text-neutral-600 *:flex *:items-center *:gap-2 dark:text-neutral-300'>
                <LoaderCircle className='size-5 animate-spin' />
                {t('command_loading_message')}
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
