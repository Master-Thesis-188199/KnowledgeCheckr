'use client'

import { FilterIcon, PlusIcon } from 'lucide-react'
import Link from 'next/link'
import { useDiscoverFilterOptionsContext } from '@/src/components/checks/discover/DiscoverFilterOptionsProvider'
import { Button } from '@/src/components/shadcn/button'
import { Input } from '@/src/components/shadcn/input'

export function DiscoverFilterFields() {
  const { filter, setFuncProps } = useDiscoverFilterOptionsContext()

  return (
    <div className='mb-4 flex justify-between'>
      <Input
        placeholder='Search for a specific KnowledgeCheck by name'
        className='max-w-xl flex-1'
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

      <div className='flex gap-4'>
        <Button variant='base'>
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
  )
}
