'use client'

import { FilterIcon, PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { useDiscoverFilterOptionsContext } from '@/src/components/checks/discover/DiscoverFilterOptionsProvider'
import { Button } from '@/src/components/shadcn/button'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput } from '@/src/components/shadcn/input-group'

export function DiscoverFilterFields() {
  const { filter, setFuncProps } = useDiscoverFilterOptionsContext()

  return (
    <div className='mb-4 flex flex-col gap-4'>
      <div className='flex justify-between'>
        <InputGroup className='max-w-xl'>
          <InputGroupInput
            placeholder='Filter by name'
            defaultValue={filter?.name && filter.name.op !== 'isNotNull' && filter.name.op !== 'isNull' ? filter.name?.value : ''}
            onChange={(e) => {
              setFuncProps((prev) => {
                const filters: typeof filter = { name: { value: e.target.value, op: 'startsWith' } }

                const update = {
                  ...prev,
                  filter: e.target.value.trim() ? filters : undefined,
                }

                return update as typeof prev
              })
            }}
          />
          <InputGroupAddon>
            <FilterIcon />
          </InputGroupAddon>
          <InputGroupAddon align='inline-end'>
            <InputGroupButton>Search</InputGroupButton>
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
