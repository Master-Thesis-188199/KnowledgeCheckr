'use client'

import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import Image from 'next/image'
import { DataTableColumnHeader } from '@/src/app/[locale]/checks/[share_token]/results/data-table-column-header'
import { ExaminationAttemptTableStructure } from '@/src/app/[locale]/checks/[share_token]/results/page'
import { Button } from '@/src/components/shadcn/button'
import { Checkbox } from '@/src/components/shadcn/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/src/components/shadcn/dropdown-menu'

export const columns: ColumnDef<ExaminationAttemptTableStructure>[] = [
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
    size: 40,
    maxSize: 40,
    cell: ({ row }) => <Checkbox className='ml-2' checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label='Select row' />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'userName',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Username' features={{ sorting: true }} className='justify-start' />,
    cell: ({ row, column, table }) => {
      console.log(row)
      return (
        <div className='flex items-center gap-3 font-medium'>
          {row.original.userAvatar && <Image alt='user avatar' width={24} height={24} src={row.original.userAvatar} className='rounded-full' />}
          <span>{row.getValue('userName')}</span>
        </div>
      )
    },
  },
  {
    accessorKey: 'startedAt',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Started At' features={{ sorting: true }} className='justify-start' />,
    cell: ({ row }) => {
      console.log(row)
      return <div className='font-medium'>{row.getValue('startedAt')}</div>
    },
  },
  {
    accessorKey: 'duration',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Duration' features={{ sorting: true }} className='justify-start' />,
    cell: ({ row }) => {
      console.log(row)
      return <div className='font-medium'>{row.getValue('duration')} minutes</div>
    },
  },
  {
    accessorKey: 'answerCount',
    header: ({ column }) => <DataTableColumnHeader column={column} title='Question Answered' />,
    cell: ({ row }) => {
      return <div className='pl-1 font-medium'>{row.getValue('answerCount')} question</div>
    },
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
              <DropdownMenuItem>View customer</DropdownMenuItem>
              <DropdownMenuItem>View payment details</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      )
    },
  },
]
