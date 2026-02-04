'use client'

import React from 'react'
import type { ChipProps, Selection, SortDescriptor } from '@heroui/react'
import { Button, Chip, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger, Input, Pagination, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow, User } from '@heroui/react'
import { SharedSelection } from '@heroui/system'
import type { Dispatch, SetStateAction, SVGProps } from 'react'
import { Button as ShadcnButton } from '@/components/shadcn/button'

export type IconSvgProps = SVGProps<SVGSVGElement> & {
  size?: number
}

function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : ''
}

const PlusIcon = ({ size = 24, width, height, ...props }: IconSvgProps) => {
  return (
    <svg aria-hidden='true' fill='none' focusable='false' height={size || height} role='presentation' viewBox='0 0 24 24' width={size || width} {...props}>
      <g fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5}>
        <path d='M6 12h12' />
        <path d='M12 18V6' />
      </g>
    </svg>
  )
}

const VerticalDotsIcon = ({ size = 24, width, height, ...props }: IconSvgProps) => {
  return (
    <svg aria-hidden='true' fill='none' focusable='false' height={size || height} role='presentation' viewBox='0 0 24 24' width={size || width} {...props}>
      <path d='M12 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0-6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 12c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z' fill='currentColor' />
    </svg>
  )
}

const SearchIcon = (props: IconSvgProps) => {
  return (
    <svg aria-hidden='true' fill='none' focusable='false' height='1em' role='presentation' viewBox='0 0 24 24' width='1em' {...props}>
      <path
        d='M11.5 21C16.7467 21 21 16.7467 21 11.5C21 6.25329 16.7467 2 11.5 2C6.25329 2 2 6.25329 2 11.5C2 16.7467 6.25329 21 11.5 21Z'
        stroke='currentColor'
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth='2'
      />
      <path d='M22 22L20 20' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' />
    </svg>
  )
}

const ChevronDownIcon = ({ strokeWidth = 1.5, ...otherProps }: IconSvgProps) => {
  return (
    <svg aria-hidden='true' fill='none' focusable='false' height='1em' role='presentation' viewBox='0 0 24 24' width='1em' {...otherProps}>
      <path d='m19.92 8.95-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeMiterlimit={10} strokeWidth={strokeWidth} />
    </svg>
  )
}

const statusColorMap: Record<string, ChipProps['color']> = {
  active: 'success',
  paused: 'danger',
  vacation: 'warning',
}

const INITIAL_VISIBLE_COLUMNS = ['name', 'role', 'status', 'actions']

type User = (typeof users)[0]
const columns = [
  { name: 'ID', uid: 'id', sortable: true },
  { name: 'NAME', uid: 'name', sortable: true },
  { name: 'AGE', uid: 'age', sortable: true },
  { name: 'ROLE', uid: 'role', sortable: true },
  { name: 'TEAM', uid: 'team' },
  { name: 'EMAIL', uid: 'email' },
  { name: 'STATUS', uid: 'status', sortable: true },
  { name: 'ACTIONS', uid: 'actions' },
]

const statusOptions = [
  { name: 'Active', uid: 'active' },
  { name: 'Paused', uid: 'paused' },
  { name: 'Vacation', uid: 'vacation' },
]

const users = [
  {
    id: 1,
    name: 'Tony Reichert',
    role: 'CEO',
    team: 'Management',
    status: 'active',
    age: '29',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
    email: 'tony.reichert@example.com',
  },
  {
    id: 2,
    name: 'Zoey Lang',
    role: 'Tech Lead',
    team: 'Development',
    status: 'paused',
    age: '25',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d',
    email: 'zoey.lang@example.com',
  },
  {
    id: 3,
    name: 'Jane Fisher',
    role: 'Sr. Dev',
    team: 'Development',
    status: 'active',
    age: '22',
    avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d',
    email: 'jane.fisher@example.com',
  },
  {
    id: 4,
    name: 'William Howard',
    role: 'C.M.',
    team: 'Marketing',
    status: 'vacation',
    age: '28',
    avatar: 'https://i.pravatar.cc/150?u=a048581f4e29026701d',
    email: 'william.howard@example.com',
  },
  {
    id: 5,
    name: 'Kristen Copper',
    role: 'S. Manager',
    team: 'Sales',
    status: 'active',
    age: '24',
    avatar: 'https://i.pravatar.cc/150?u=a092581d4ef9026700d',
    email: 'kristen.cooper@example.com',
  },
  {
    id: 6,
    name: 'Brian Kim',
    role: 'P. Manager',
    team: 'Management',
    age: '29',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d',
    email: 'brian.kim@example.com',
    status: 'active',
  },
  {
    id: 7,
    name: 'Michael Hunt',
    role: 'Designer',
    team: 'Design',
    status: 'paused',
    age: '27',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e29027007d',
    email: 'michael.hunt@example.com',
  },
  {
    id: 8,
    name: 'Samantha Brooks',
    role: 'HR Manager',
    team: 'HR',
    status: 'active',
    age: '31',
    avatar: 'https://i.pravatar.cc/150?u=a042581f4e27027008d',
    email: 'samantha.brooks@example.com',
  },
  {
    id: 9,
    name: 'Frank Harrison',
    role: 'F. Manager',
    team: 'Finance',
    status: 'vacation',
    age: '33',
    avatar: 'https://i.pravatar.cc/150?img=4',
    email: 'frank.harrison@example.com',
  },
  {
    id: 10,
    name: 'Emma Adams',
    role: 'Ops Manager',
    team: 'Operations',
    status: 'active',
    age: '35',
    avatar: 'https://i.pravatar.cc/150?img=5',
    email: 'emma.adams@example.com',
  },
  {
    id: 11,
    name: 'Brandon Stevens',
    role: 'Jr. Dev',
    team: 'Development',
    status: 'active',
    age: '22',
    avatar: 'https://i.pravatar.cc/150?img=8',
    email: 'brandon.stevens@example.com',
  },
  {
    id: 12,
    name: 'Megan Richards',
    role: 'P. Manager',
    team: 'Product',
    status: 'paused',
    age: '28',
    avatar: 'https://i.pravatar.cc/150?img=10',
    email: 'megan.richards@example.com',
  },
  {
    id: 13,
    name: 'Oliver Scott',
    role: 'S. Manager',
    team: 'Security',
    status: 'active',
    age: '37',
    avatar: 'https://i.pravatar.cc/150?img=12',
    email: 'oliver.scott@example.com',
  },
  {
    id: 14,
    name: 'Grace Allen',
    role: 'M. Specialist',
    team: 'Marketing',
    status: 'active',
    age: '30',
    avatar: 'https://i.pravatar.cc/150?img=16',
    email: 'grace.allen@example.com',
  },
  {
    id: 15,
    name: 'Noah Carter',
    role: 'IT Specialist',
    team: 'I. Technology',
    status: 'paused',
    age: '31',
    avatar: 'https://i.pravatar.cc/150?img=15',
    email: 'noah.carter@example.com',
  },
  {
    id: 16,
    name: 'Ava Perez',
    role: 'Manager',
    team: 'Sales',
    status: 'active',
    age: '29',
    avatar: 'https://i.pravatar.cc/150?img=20',
    email: 'ava.perez@example.com',
  },
  {
    id: 17,
    name: 'Liam Johnson',
    role: 'Data Analyst',
    team: 'Analysis',
    status: 'active',
    age: '28',
    avatar: 'https://i.pravatar.cc/150?img=33',
    email: 'liam.johnson@example.com',
  },
  {
    id: 18,
    name: 'Sophia Taylor',
    role: 'QA Analyst',
    team: 'Testing',
    status: 'active',
    age: '27',
    avatar: 'https://i.pravatar.cc/150?img=29',
    email: 'sophia.taylor@example.com',
  },
  {
    id: 19,
    name: 'Lucas Harris',
    role: 'Administrator',
    team: 'Information Technology',
    status: 'paused',
    age: '32',
    avatar: 'https://i.pravatar.cc/150?img=50',
    email: 'lucas.harris@example.com',
  },
  {
    id: 20,
    name: 'Mia Robinson',
    role: 'Coordinator',
    team: 'Operations',
    status: 'active',
    age: '26',
    avatar: 'https://i.pravatar.cc/150?img=45',
    email: 'mia.robinson@example.com',
  },
]

export function DataTable() {
  const [filterValue, setFilterValue] = React.useState('')
  const [selectedKeys, setSelectedKeys] = React.useState<Selection>(new Set([]))
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>(new Set(INITIAL_VISIBLE_COLUMNS))
  const [statusFilter, setStatusFilter] = React.useState<Selection>('all')
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: 'age',
    direction: 'ascending',
  })
  const [page, setPage] = React.useState(1)

  const pages = Math.ceil(users.length / rowsPerPage)

  const hasSearchFilter = Boolean(filterValue)

  const headerColumns = React.useMemo(() => {
    if (visibleColumns === 'all') return columns

    return columns.filter((column) => Array.from(visibleColumns).includes(column.uid))
  }, [visibleColumns])

  const filteredItems = React.useMemo(() => {
    let filteredUsers = [...users]

    if (hasSearchFilter) {
      filteredUsers = filteredUsers.filter((user) => user.name.toLowerCase().includes(filterValue.toLowerCase()))
    }
    if (statusFilter !== 'all' && Array.from(statusFilter).length !== statusOptions.length) {
      filteredUsers = filteredUsers.filter((user) => Array.from(statusFilter).includes(user.status))
    }

    return filteredUsers
  }, [users, filterValue, statusFilter])

  const items = React.useMemo(() => {
    const start = (page - 1) * rowsPerPage
    const end = start + rowsPerPage

    return filteredItems.slice(start, end)
  }, [page, filteredItems, rowsPerPage])

  const sortedItems = React.useMemo(() => {
    return [...items].sort((a: User, b: User) => {
      const first = a[sortDescriptor.column as keyof User] as number
      const second = b[sortDescriptor.column as keyof User] as number
      const cmp = first < second ? -1 : first > second ? 1 : 0

      return sortDescriptor.direction === 'descending' ? -cmp : cmp
    })
  }, [sortDescriptor, items])

  const onRowsPerPageChange = React.useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setRowsPerPage(Number(e.target.value))
    setPage(1)
  }, [])

  const onSearchChange = React.useCallback((value?: string) => {
    if (value) {
      setFilterValue(value)
      setPage(1)
    } else {
      setFilterValue('')
    }
  }, [])

  const bottomContent = BottomContent(hasSearchFilter, page, pages, setPage, selectedKeys, items)

  const classNames = React.useMemo(
    () => ({
      wrapper: ['max-h-[382px]', 'max-w-3xl'],
      th: ['bg-transparent', 'text-default-500', 'border-b', 'border-divider', 'last:max-w-8'],
      td: [
        // changing the rows border radius
        // first
        'first:group-data-[first=true]/tr:before:rounded-none',
        'last:group-data-[first=true]/tr:before:rounded-none',
        // middle
        'group-data-[middle=true]/tr:before:rounded-none',
        // last
        'first:group-data-[last=true]/tr:before:rounded-none',
        'last:group-data-[last=true]/tr:before:rounded-none',

        'last:max-w-8 ',
      ],
    }),
    [],
  )

  return (
    <Table
      isCompact
      removeWrapper
      className='overflow-x-auto overflow-y-hidden'
      aria-label='Example table with custom cells, pagination and sorting'
      bottomContent={bottomContent}
      bottomContentPlacement='outside'
      checkboxesProps={{
        classNames: {
          wrapper: 'after:bg-foreground after:text-background text-background size-3.5 before:rounded-md after:rounded-sm rounded-sm',
        },
      }}
      classNames={classNames}
      selectedKeys={selectedKeys}
      selectionMode='multiple'
      sortDescriptor={sortDescriptor}
      topContent={TopContent({ filterValue, statusFilter, visibleColumns, onSearchChange, onRowsPerPageChange, setFilterValue, setStatusFilter, setVisibleColumns })}
      topContentPlacement='outside'
      onSelectionChange={setSelectedKeys}
      onSortChange={setSortDescriptor}>
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn key={column.uid} align={column.uid === 'actions' ? 'center' : 'start'} allowsSorting={column.sortable}>
            {column.name}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody emptyContent={'No users found'} items={sortedItems}>
        {(item) => <TableRow key={item.id}>{(columnKey) => <TableCell>{renderCellFunction(item, columnKey)}</TableCell>}</TableRow>}
      </TableBody>
    </Table>
  )
}

function renderCellFunction(user: User, columnKey: React.Key) {
  const cellValue = user[columnKey as keyof User]

  switch (columnKey) {
    case 'name':
      return (
        <User
          avatarProps={{ radius: 'full', size: 'sm', src: user.avatar }}
          classNames={{
            description: 'text-default-500',
          }}
          description={user.email}
          name={cellValue}>
          {user.email}
        </User>
      )
    case 'role':
      return (
        <div className='flex flex-col'>
          <p className='text-bold text-small capitalize'>{cellValue}</p>
          <p className='text-bold text-tiny text-default-500 capitalize'>{user.team}</p>
        </div>
      )
    case 'status':
      return (
        <Chip className='text-default-600 gap-1 border-none capitalize' color={statusColorMap[user.status]} size='sm' variant='dot'>
          {cellValue}
        </Chip>
      )
    case 'actions':
      return (
        <Dropdown className='bg-background border-default-200 border-1'>
          <DropdownTrigger>
            <Button isIconOnly radius='full' size='sm' variant='light'>
              <VerticalDotsIcon className='text-default-400' />
            </Button>
          </DropdownTrigger>
          <DropdownMenu>
            <DropdownItem key='view'>View</DropdownItem>
            <DropdownItem key='edit'>Edit</DropdownItem>
            <DropdownItem key='delete'>Delete</DropdownItem>
          </DropdownMenu>
        </Dropdown>
      )
    default:
      return cellValue
  }
}

function BottomContent(
  hasSearchFilter: boolean,
  page: number,
  pages: number,
  setPage: React.Dispatch<React.SetStateAction<number>>,
  selectedKeys: Selection,
  items: { id: number; name: string; role: string; team: string; status: string; age: string; avatar: string; email: string }[],
) {
  return (
    <div className='flex items-center justify-between px-2 py-2'>
      <Pagination
        showControls
        classNames={{
          cursor: 'bg-foreground text-background',
        }}
        color='default'
        isDisabled={hasSearchFilter}
        page={page}
        total={pages}
        variant='light'
        onChange={setPage}
      />
      <span className='text-small text-default-400'>{selectedKeys === 'all' ? 'All items selected' : `${selectedKeys.size} of ${items.length} selected`}</span>
    </div>
  )
}

function TopContent({
  filterValue,
  setFilterValue,
  onSearchChange,
  statusFilter,
  visibleColumns,
  setStatusFilter,
  setVisibleColumns,
  onRowsPerPageChange,
}: {
  statusFilter: Selection
  visibleColumns: Selection
  filterValue: string
  setFilterValue: Dispatch<SetStateAction<string>>
  setVisibleColumns: (keys: SharedSelection) => void
  setStatusFilter: (keys: SharedSelection) => void
  onSearchChange: () => void
  onRowsPerPageChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}) {
  return (
    <div className='flex flex-col gap-4'>
      <div className='flex items-end justify-between gap-3'>
        <Input
          isClearable
          classNames={{
            base: 'w-full sm:max-w-[44%]',
            inputWrapper: 'border-1',
          }}
          placeholder='Search by name...'
          size='sm'
          startContent={<SearchIcon className='text-default-300' />}
          value={filterValue}
          variant='bordered'
          onClear={() => setFilterValue('')}
          onValueChange={onSearchChange}
        />
        <div className='flex gap-3'>
          <Dropdown>
            <DropdownTrigger className='hidden sm:flex'>
              <Button endContent={<ChevronDownIcon className='text-small' />} size='sm' variant='flat'>
                Status
              </Button>
            </DropdownTrigger>
            <DropdownMenu disallowEmptySelection aria-label='Table Columns' closeOnSelect={false} selectedKeys={statusFilter} selectionMode='multiple' onSelectionChange={setStatusFilter}>
              {statusOptions.map((status) => (
                <DropdownItem key={status.uid} className='capitalize'>
                  {capitalize(status.name)}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          <Dropdown>
            <DropdownTrigger className='hidden sm:flex'>
              <Button endContent={<ChevronDownIcon className='text-small' />} size='sm' variant='flat'>
                Columns
              </Button>
            </DropdownTrigger>
            <DropdownMenu disallowEmptySelection aria-label='Table Columns' closeOnSelect={false} selectedKeys={visibleColumns} selectionMode='multiple' onSelectionChange={setVisibleColumns}>
              {columns.map((column) => (
                <DropdownItem key={column.uid} className='capitalize'>
                  {capitalize(column.name)}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>

          <ShadcnButton variant='secondary' size='sm'>
            Add New
            <PlusIcon />
          </ShadcnButton>
        </div>
      </div>
      <div className='flex items-center justify-between'>
        <span className='text-default-400 text-small'>Total {users.length} users</span>
        <label className='text-default-400 text-small flex items-center'>
          Rows per page:
          <select className='text-default-400 text-small bg-transparent outline-transparent outline-solid' onChange={onRowsPerPageChange}>
            <option value='5'>5</option>
            <option value='10'>10</option>
            <option value='15'>15</option>
          </select>
        </label>
      </div>
    </div>
  )
}
