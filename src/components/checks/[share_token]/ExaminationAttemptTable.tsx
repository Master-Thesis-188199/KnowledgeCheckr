'use client'

import * as React from 'react'
import { closestCenter, DndContext, type DragEndEvent, KeyboardSensor, MouseSensor, TouchSensor, type UniqueIdentifier, useSensor, useSensors } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import {
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
  IconCircleCheckFilled,
  IconDotsVertical,
  IconLayoutColumns,
  IconLoader,
  IconTrendingUp,
} from '@tabler/icons-react'
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type Row,
  type SortingState,
  type Table as TableType,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table'
import { differenceInMinutes } from 'date-fns'
import isEqual from 'lodash/isEqual'
import { EyeIcon } from 'lucide-react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import { z } from 'zod'
import { Badge } from '@/components/shadcn/badge'
import { Button } from '@/components/shadcn/button'
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/shadcn/chart'
import { Checkbox } from '@/components/shadcn/checkbox'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/shadcn/drawer'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/shadcn/dropdown-menu'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { Separator } from '@/components/shadcn/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table'
import { useIsMobile } from '@/hooks/use-mobile'
import { cn } from '@/src/lib/Shared/utils'

const ExamAttemptItemSchema = z.object({
  id: z.number().or(z.string()),
  username: z.string(),
  type: z.enum(['normal', 'anonymous']).or(z.string().nonempty()),
  status: z.enum(['Done', 'in-progress']).or(z.string().nonempty()),
  startedAt: z.date(),
  finishedAt: z.date(),
  score: z.number(),
  totalCheckScore: z.number(),
})

type ExamAttemptItem = z.infer<typeof ExamAttemptItemSchema>

const columns: ColumnDef<ExamAttemptItem>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <div className='flex items-center justify-center'>
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && 'indeterminate')}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className='flex items-center justify-center'>
        <Checkbox checked={row.getIsSelected()} onCheckedChange={(value) => row.toggleSelected(!!value)} aria-label='Select row' />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'username',
    header: 'Username',
    cell: ({ row }) => {
      return <TableCellViewer item={row.original} />
    },
    enableHiding: false,
  },

  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant='outline' className='text-muted-foreground px-1.5'>
        {row.original.status === 'Done' ? <IconCircleCheckFilled className='fill-green-500 dark:fill-green-400/70' /> : <IconLoader />}
        {row.original.status}
      </Badge>
    ),
  },
  {
    accessorKey: 'duration',
    header: () => <div className=''>Duration</div>,
    cell: ({ row }) => (
      <div className='text-foreground' id={`${row.original.id}-duration`}>
        {differenceInMinutes(row.original.finishedAt, row.original.startedAt)} minutes
      </div>
    ),
  },
  {
    accessorKey: 'type',
    header: 'User Type',
    cell: ({ row }) => (
      <div className='w-fit'>
        <Badge variant='outline' className='text-muted-foreground px-1.5'>
          {row.original.type}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: 'score',
    header: () => <div className='w-full text-center'>Score</div>,
    cell: ({ row }) => (
      <div className='text-foreground text-center text-xs' id={`${row.original.id}-score`}>
        {row.original.score}
      </div>
    ),
  },
  {
    accessorKey: 'totalScore',
    header: () => <div className='w-full text-center'>Max Score</div>,
    cell: ({ row }) => (
      <div className='text--foreground text-center text-xs' id={`${row.original.id}-total-check-score`}>
        {row.original.totalCheckScore}
      </div>
    ),
  },
  {
    accessorKey: 'action-details',
    header: undefined,
    cell: ({ row }) => {
      return (
        <div className='flex justify-center'>
          <QuickEditTableCell item={row.original} />
        </div>
      )
    },
    enableHiding: false,
  },
  {
    id: 'actions',
    cell: () => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='data-[state=open]:bg-muted text-muted-foreground flex size-8' size='icon'>
            <IconDotsVertical />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-32'>
          <DropdownMenuItem>Edit</DropdownMenuItem>
          <DropdownMenuItem>Make a copy</DropdownMenuItem>
          <DropdownMenuItem>Favorite</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant='destructive'>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

// gap between columns (padding) except for action columns
const sharedClasses = '*:[th]:not-data-[column-id^=action]:px-5 *:[td]:not-data-[column-id^=action]:px-5 *:[th]:not-data-[column-id^=action]:border-x'

function DraggableRow({ row }: { row: Row<ExamAttemptItem> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  return (
    <TableRow
      data-state={row.getIsSelected() && 'selected'}
      data-dragging={isDragging}
      ref={setNodeRef}
      className={cn('relative z-0 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80', sharedClasses)}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition,
      }}>
      {row.getVisibleCells().map((cell) => (
        <TableCell data-column-id={cell.column.id} key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  )
}

export function ExaminationAttemptTable({ data: initialData }: { data: ExamAttemptItem[] }) {
  const [data, setData] = React.useState(() => initialData)
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  })
  const sortableId = React.useId()
  const sensors = useSensors(useSensor(MouseSensor, {}), useSensor(TouchSensor, {}), useSensor(KeyboardSensor, {}))

  const dataIds = React.useMemo<UniqueIdentifier[]>(() => data?.map(({ id }) => id) || [], [data])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    getRowId: (row) => row.id.toString(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  React.useEffect(() => {
    if (isEqual(data, initialData)) return

    console.debug('[ExamAttemptTable]: InitialData changed updating table-data.')
    setData(initialData)
  }, [initialData])

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (active && over && active.id !== over.id) {
      setData((data) => {
        const oldIndex = dataIds.indexOf(active.id)
        const newIndex = dataIds.indexOf(over.id)
        return arrayMove(data, oldIndex, newIndex)
      })
    }
  }

  return (
    <div className='flex w-full flex-col justify-start gap-6'>
      <div className='-mb-2 flex items-center justify-between px-4 lg:px-6'>
        <div className='ml-2 hidden items-center gap-2 lg:flex'>
          <Label htmlFor='rows-per-page' className='text-sm font-medium'>
            Rows per page
          </Label>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}>
            <SelectTrigger size='sm' className='w-20' id='rows-per-page'>
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side='top'>
              {[10, 20, 30, 40, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className='flex items-center gap-2'>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' size='sm'>
                <IconLayoutColumns />
                <span className='hidden lg:inline'>Customize Columns</span>
                <span className='lg:hidden'>Columns</span>
                <IconChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className='w-56'>
              {table
                .getAllColumns()
                .filter((column) => typeof column.accessorFn !== 'undefined' && column.getCanHide())
                .map((column) => {
                  return (
                    <DropdownMenuCheckboxItem key={column.id} className='capitalize' checked={column.getIsVisible()} onCheckedChange={(value) => column.toggleVisibility(!!value)}>
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className='relative flex flex-col gap-4 overflow-auto px-4 lg:px-6'>
        <div className='overflow-hidden rounded-lg border'>
          <DndContext collisionDetection={closestCenter} modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd} sensors={sensors} id={sortableId}>
            <Table>
              <TableHeader className='bg-muted sticky top-0 z-10'>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className={cn('*:[th[id=username]]:w-full', sharedClasses)}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead data-column-id={header.id} key={header.id} id={header.id} colSpan={header.colSpan}>
                          {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody className='**:data-[slot=table-cell]:first:w-8'>
                {table.getRowModel().rows?.length ? (
                  <SortableContext items={dataIds} strategy={verticalListSortingStrategy}>
                    {table.getRowModel().rows.map((row) => (
                      <DraggableRow key={row.id} row={row} />
                    ))}
                  </SortableContext>
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className='h-24 text-center'>
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </DndContext>
        </div>
        <TableFooter table={table} />
      </div>
    </div>
  )
}

function TableFooter({ table }: { table: TableType<ExamAttemptItem> }) {
  return (
    <div className='flex items-center justify-between px-4'>
      <div className='text-muted-foreground hidden flex-1 text-sm lg:flex'>
        {table.getFilteredSelectedRowModel().rows.length > 0 && `${table.getFilteredSelectedRowModel().rows.length} of ${table.getFilteredRowModel().rows.length} row(s) selected.`}
      </div>
      <div className='mb-0.25 flex w-full items-center gap-8 lg:w-fit'>
        <div className='flex w-fit items-center justify-center text-sm font-medium'>
          Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
        </div>
        <div className='ml-auto flex items-center gap-2 lg:ml-0'>
          <Button variant='outline' className='hidden h-8 w-8 p-0 lg:flex' onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
            <span className='sr-only'>Go to first page</span>
            <IconChevronsLeft />
          </Button>
          <Button variant='outline' className='size-8' size='icon' onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            <span className='sr-only'>Go to previous page</span>
            <IconChevronLeft />
          </Button>
          <Button variant='outline' className='size-8' size='icon' onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            <span className='sr-only'>Go to next page</span>
            <IconChevronRight />
          </Button>
          <Button variant='outline' className='mb-0 hidden size-8 lg:flex' size='icon' onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
            <span className='sr-only'>Go to last page</span>
            <IconChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  )
}

const chartData = [
  { month: 'January', desktop: 186, mobile: 80 },
  { month: 'February', desktop: 305, mobile: 200 },
  { month: 'March', desktop: 237, mobile: 120 },
  { month: 'April', desktop: 73, mobile: 190 },
  { month: 'May', desktop: 209, mobile: 130 },
  { month: 'June', desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: 'Desktop',
    color: 'var(--primary)',
  },
  mobile: {
    label: 'Mobile',
    color: 'var(--primary)',
  },
} satisfies ChartConfig

function TableCellViewer({ item }: { item: ExamAttemptItem }) {
  const isMobile = useIsMobile()

  return (
    <Drawer direction={isMobile ? 'bottom' : 'right'}>
      <DrawerTrigger asChild>
        <Button variant='link' className='text-foreground w-fit px-0 text-left'>
          {item.username}
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className='gap-1'>
          <DrawerTitle>{item.username}</DrawerTitle>
          <DrawerDescription>Showing total visitors for the last 6 months</DrawerDescription>
        </DrawerHeader>
        <div className='flex flex-col gap-4 overflow-y-auto px-4 text-sm'>
          {!isMobile && (
            <>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 0,
                    right: 10,
                  }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey='month' tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} hide />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator='dot' />} />
                  <Area dataKey='mobile' type='natural' fill='var(--color-mobile)' fillOpacity={0.6} stroke='var(--color-mobile)' stackId='a' />
                  <Area dataKey='desktop' type='natural' fill='var(--color-desktop)' fillOpacity={0.4} stroke='var(--color-desktop)' stackId='a' />
                </AreaChart>
              </ChartContainer>
              <Separator />
              <div className='grid gap-2'>
                <div className='flex gap-2 leading-none font-medium'>
                  Trending up by 5.2% this month <IconTrendingUp className='size-4' />
                </div>
                <div className='text-muted-foreground'>
                  Showing total visitors for the last 6 months. This is just some random text to test the layout. It spans multiple lines and should wrap around.
                </div>
              </div>
              <Separator />
            </>
          )}
          <form className='flex flex-col gap-4'>
            <div className='flex flex-col gap-3'>
              <Label htmlFor='username'>Header</Label>
              <Input id='username' defaultValue={item.username} />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='flex flex-col gap-3'>
                <Label htmlFor='type'>Type</Label>
                <Select defaultValue={item.type}>
                  <SelectTrigger id='type' className='w-full'>
                    <SelectValue placeholder='Select a type' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Table of Contents'>Table of Contents</SelectItem>
                    <SelectItem value='Executive Summary'>Executive Summary</SelectItem>
                    <SelectItem value='Technical Approach'>Technical Approach</SelectItem>
                    <SelectItem value='Design'>Design</SelectItem>
                    <SelectItem value='Capabilities'>Capabilities</SelectItem>
                    <SelectItem value='Focus Documents'>Focus Documents</SelectItem>
                    <SelectItem value='Narrative'>Narrative</SelectItem>
                    <SelectItem value='Cover Page'>Cover Page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='flex flex-col gap-3'>
                <Label htmlFor='status'>Status</Label>
                <Select defaultValue={item.status}>
                  <SelectTrigger id='status' className='w-full'>
                    <SelectValue placeholder='Select a status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Done'>Done</SelectItem>
                    <SelectItem value='In Progress'>In Progress</SelectItem>
                    <SelectItem value='Not Started'>Not Started</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='flex flex-col gap-3'>
                <Label htmlFor='score'>Score</Label>
                <Input id='score' defaultValue={item.score} />
              </div>
            </div>
          </form>
        </div>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose asChild>
            <Button variant='outline'>Done</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function QuickEditTableCell({ item }: { item: ExamAttemptItem }) {
  const isMobile = useIsMobile()

  return (
    <Drawer direction={isMobile ? 'bottom' : 'right'}>
      <DrawerTrigger asChild>
        <Button variant='link' size='sm' className='text-foreground/50'>
          <EyeIcon />
          Details
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className='gap-1'>
          <DrawerTitle>{item.username}</DrawerTitle>
          <DrawerDescription>Showing total visitors for the last 6 months</DrawerDescription>
        </DrawerHeader>
        <div className='flex flex-col gap-4 overflow-y-auto px-4 text-sm'>
          {!isMobile && (
            <>
              <ChartContainer config={chartConfig}>
                <AreaChart
                  accessibilityLayer
                  data={chartData}
                  margin={{
                    left: 0,
                    right: 10,
                  }}>
                  <CartesianGrid vertical={false} />
                  <XAxis dataKey='month' tickLine={false} axisLine={false} tickMargin={8} tickFormatter={(value) => value.slice(0, 3)} hide />
                  <ChartTooltip cursor={false} content={<ChartTooltipContent indicator='dot' />} />
                  <Area dataKey='mobile' type='natural' fill='var(--color-mobile)' fillOpacity={0.6} stroke='var(--color-mobile)' stackId='a' />
                  <Area dataKey='desktop' type='natural' fill='var(--color-desktop)' fillOpacity={0.4} stroke='var(--color-desktop)' stackId='a' />
                </AreaChart>
              </ChartContainer>
              <Separator />
              <div className='grid gap-2'>
                <div className='flex gap-2 leading-none font-medium'>
                  Trending up by 5.2% this month <IconTrendingUp className='size-4' />
                </div>
                <div className='text-muted-foreground'>
                  Showing total visitors for the last 6 months. This is just some random text to test the layout. It spans multiple lines and should wrap around.
                </div>
              </div>
              <Separator />
            </>
          )}
          <form className='flex flex-col gap-4'>
            <div className='flex flex-col gap-3'>
              <Label htmlFor='username'>Header</Label>
              <Input id='username' defaultValue={item.username} />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='flex flex-col gap-3'>
                <Label htmlFor='type'>Type</Label>
                <Select defaultValue={item.type}>
                  <SelectTrigger id='type' className='w-full'>
                    <SelectValue placeholder='Select a type' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Table of Contents'>Table of Contents</SelectItem>
                    <SelectItem value='Executive Summary'>Executive Summary</SelectItem>
                    <SelectItem value='Technical Approach'>Technical Approach</SelectItem>
                    <SelectItem value='Design'>Design</SelectItem>
                    <SelectItem value='Capabilities'>Capabilities</SelectItem>
                    <SelectItem value='Focus Documents'>Focus Documents</SelectItem>
                    <SelectItem value='Narrative'>Narrative</SelectItem>
                    <SelectItem value='Cover Page'>Cover Page</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className='flex flex-col gap-3'>
                <Label htmlFor='status'>Status</Label>
                <Select defaultValue={item.status}>
                  <SelectTrigger id='status' className='w-full'>
                    <SelectValue placeholder='Select a status' />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='Done'>Done</SelectItem>
                    <SelectItem value='In Progress'>In Progress</SelectItem>
                    <SelectItem value='Not Started'>Not Started</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div className='flex flex-col gap-3'>
                <Label htmlFor='score'>Score</Label>
                <Input id='score' defaultValue={item.score} />
              </div>
            </div>
          </form>
        </div>
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose asChild>
            <Button variant='outline'>Done</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
