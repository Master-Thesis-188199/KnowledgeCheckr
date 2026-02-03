'use client'

import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import { DataTableColumnHeader } from '@/src/app/[locale]/checks/[share_token]/results/data-table-column-header'
import { Button } from '@/src/components/shadcn/button'
import { Checkbox } from '@/src/components/shadcn/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/src/components/shadcn/dropdown-menu'

export type Payment = {
  id: string
  score: number
  status: 'pending' | 'processing' | 'success' | 'failed'
  email: string
}

export const columns: ColumnDef<Payment>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        className='ml-2'
        checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
      />
    ),
    size: 30,
    maxSize: 30,
    cell: ({ row }) => <Checkbox className='ml-2' checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label='Select row' />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'email',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Email' features={{ hiding: true, sorting: true }} className='justify-start' />,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Status' features={{ hiding: true, sorting: true }} />,
  },
  {
    accessorKey: 'score',
    maxSize: 90,
    header: ({ column }) => <DataTableColumnHeader column={column} title='Score' className='-mr-4 w-fit max-w-fit justify-self-end' />,
    cell: ({ row }) => {
      return <div className='text-right font-medium'>{row.getValue('score')}</div>
    },
  },
  {
    id: 'actions',
    size: 30,
    maxSize: 30,
    enableResizing: false,
    enableHiding: false,
    enableSorting: false,
    cell: ({ row, cell, column }) => {
      const payment = row.original

      return (
        <div className='text-center'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <span className='sr-only'>Open menu</span>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => navigator.clipboard.writeText(payment.id)}>Copy payment ID</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View customer</DropdownMenuItem>
              <DropdownMenuItem>View payment details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]
