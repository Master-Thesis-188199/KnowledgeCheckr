'use client'

import { useCallback, useState } from 'react'
import isEqual from 'lodash/isEqual'
import { FilterIcon, PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { StringOps } from '@/database/utils/buildWhere'
import { useDiscoverFilterOptionsContext } from '@/src/components/checks/discover/DiscoverFilterOptionsProvider'
import { Button } from '@/src/components/shadcn/button'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/src/components/shadcn/dropdown-menu'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/src/components/shadcn/input-group'

export function DiscoverFilterFields() {
  const { filter, setFuncProps } = useDiscoverFilterOptionsContext()

  const filterOperands = ['contains' as const, 'startsWith' as const, 'endsWith' as const, 'eq' as const]
  const [selectedFilterOperand, setFilterOperand] = useState<(typeof filterOperands)[number]>('startsWith')
  const [nameFilterValue, setNameFilterValue] = useState<string | undefined>(undefined)

  const updateFilter = useCallback(
    (op: typeof selectedFilterOperand, value?: Extract<StringOps, { op: 'contains' }>['value']) => {
      const filters: typeof filter = value?.trim() ? { name: { value, op } } : undefined

      if (filter === filters || isEqual(filter, filters)) return console.log('aborting props update, equal...')

      setFuncProps((prev) => {
        const update = {
          ...prev,
          filter: filters,
        }

        return update as typeof prev
      })
    },
    [filter, setFuncProps],
  )

  return (
    <div className='mb-4 flex flex-col gap-4'>
      <div className='flex justify-between'>
        <InputGroup className='max-w-xl'>
          <InputGroupInput
            placeholder='Filter by name'
            defaultValue={filter?.name && filter.name.op !== 'isNotNull' && filter.name.op !== 'isNull' ? filter.name?.value : ''}
            onChange={({ target: { value } }) => {
              setNameFilterValue(value.trim() ? value : undefined)
              updateFilter(selectedFilterOperand, value)
            }}
          />
          <InputGroupAddon>
            <FilterIcon />
          </InputGroupAddon>
          <InputGroupAddon align='inline-end'>
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
          </InputGroupAddon>
        </InputGroup>

        <div className='flex gap-4'>
          <Button variant='base' disabled>
            <FilterIcon className='size-4' />
            Filter
          </Button>
          <Link href='/checks/create'>
            <Button>
              <PlusIcon className='size-5' />
              Create Check
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
