'use client'

import { ChangeEvent, useCallback, useMemo, useState } from 'react'
import isEqual from 'lodash/isEqual'
import { CaseSensitiveIcon, FilterIcon, PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { StringOps } from '@/database/utils/buildWhere'
import { useDiscoverFilterOptionsContext } from '@/src/components/checks/discover/DiscoverFilterOptionsProvider'
import { Button } from '@/src/components/shadcn/button'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/src/components/shadcn/dropdown-menu'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/src/components/shadcn/input-group'
import { Toggle } from '@/src/components/shadcn/toggle'
import Tooltip from '@/src/components/Shared/Tooltip'
import debounceFunction from '@/src/hooks/Shared/debounceFunction'

export function DiscoverFilterFields() {
  const { filter, setFuncProps } = useDiscoverFilterOptionsContext()

  const filterOperands = ['contains' as const, 'startsWith' as const, 'endsWith' as const, 'eq' as const]
  const [selectedFilterOperand, setFilterOperand] = useState<(typeof filterOperands)[number]>('startsWith')
  const [nameFilterValue, setNameFilterValue] = useState<string | undefined>(undefined)
  const [isCaseSensitive, setIsCaseSensitive] = useState(true)

  const updateFilter = useCallback(
    (op: typeof selectedFilterOperand, value?: Extract<StringOps, { op: 'contains' }>['value']) => {
      const filters: typeof filter = value?.trim() ? { name: { value, op, ignoreCasing: !isCaseSensitive } } : undefined

      if (filter === filters || isEqual(filter, filters)) return console.log('aborting props update, equal...')

      setFuncProps((prev) => {
        const update = {
          ...prev,
          filter: filters,
        }

        return update as typeof prev
      })
    },
    [filter, setFuncProps, isCaseSensitive],
  )

  const debounceOnFilterValueChange = useMemo(
    () =>
      debounceFunction(({ target: { value } }: ChangeEvent<HTMLInputElement>) => {
        setNameFilterValue(value.trim() ? value : undefined)
        updateFilter(selectedFilterOperand, value)
      }, 250),
    [selectedFilterOperand, setNameFilterValue, updateFilter],
  )

  return (
    <div className='mb-4 flex flex-col gap-4'>
      <div className='flex justify-between'>
        <InputGroup className='max-w-xl'>
          <InputGroupInput
            placeholder='Filter by name'
            defaultValue={filter?.name && filter.name.op !== 'isNotNull' && filter.name.op !== 'isNull' ? filter.name?.value : ''}
            onChange={debounceOnFilterValueChange}
          />
          <InputGroupAddon>
            <FilterIcon />
          </InputGroupAddon>
          <InputGroupAddon align='inline-end' className='gap-1'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <InputGroupButton variant='ghost' className='rounded-l-none border-l-2 border-l-neutral-500'>
                  {selectedFilterOperand}
                </InputGroupButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent className='w-36'>
                <DropdownMenuLabel className='text-center'>Filter Operands</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {filterOperands.map((operand) => (
                  <DropdownMenuCheckboxItem
                    key={operand}
                    checked={selectedFilterOperand === operand}
                    onCheckedChange={(selected) => {
                      if (!selected) return

                      setFilterOperand(operand)
                      updateFilter(operand, nameFilterValue)
                    }}>
                    {operand}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Tooltip offset={12} placement='right' size='sm' content={isCaseSensitive ? 'filter is case-sensitive' : 'ignoring casing when filtering'}>
              <Toggle
                aria-label='Toggle bookmark'
                size='xs'
                onPressedChange={(pressed) => {
                  setIsCaseSensitive(pressed)
                  updateFilter(selectedFilterOperand, nameFilterValue)
                }}
                defaultPressed={isCaseSensitive}
                variant='outline'
                className='group data-[state=on]:bg-background-z-1 relative mr-0.5 data-[state=off]:*:[div]:block data-[state=on]:*:[div]:hidden data-[state=off]:*:[svg]:stroke-neutral-500 data-[state=on]:*:[svg]:stroke-neutral-700 dark:data-[state=off]:*:[svg]:stroke-neutral-400 dark:data-[state=on]:*:[svg]:stroke-neutral-300'>
                <div className='absolute top-0 right-1 bottom-0 left-1 flex'>
                  <div className='mt-2.5 h-[1.5px] w-full rotate-325 rounded-xs bg-red-500/50 dark:bg-red-400/70' />
                </div>
                <CaseSensitiveIcon className='size-5' />
              </Toggle>
            </Tooltip>
          </InputGroupAddon>
        </InputGroup>

        <div className='flex gap-4'>
          <Link href='/checks/create'>
            <Button>
              <PlusIcon className='size-5' />
              Create your own Check
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
