'use client'

import * as React from 'react'
import { closestCenter, DndContext, type DragEndEvent, KeyboardSensor, MouseSensor, TouchSensor, type UniqueIdentifier, useSensor, useSensors } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { IconChevronDown, IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight, IconCircleCheckFilled, IconDotsVertical, IconLayoutColumns, IconLoader } from '@tabler/icons-react'
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
import { useOrientation, usePrevious, useWindowSize } from '@uidotdev/usehooks'
import { differenceInMinutes, format } from 'date-fns'
import { deAT, enUS } from 'date-fns/locale'
import isEqual from 'lodash/isEqual'
import { ChartColumnIcon, ChevronRightIcon, EyeIcon, TrashIcon } from 'lucide-react'
import Link from 'next/link'
import { z } from 'zod'
import { Badge } from '@/components/shadcn/badge'
import { Button } from '@/components/shadcn/button'
import { Checkbox } from '@/components/shadcn/checkbox'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/shadcn/drawer'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/shadcn/dropdown-menu'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table'
import { useIsMobile } from '@/hooks/use-mobile'
import { QuestionScoresLineChart } from '@/src/components/charts/QuestionScoresLineChart'
import { useCurrentLocale } from '@/src/i18n/client-localization'
import getKeys from '@/src/lib/Shared/Keys'
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
      return (
        <DrawerActionTableCell item={row.original}>
          <Button variant='link' className='text-foreground w-fit px-0 text-left'>
            {row.original.username}
          </Button>
        </DrawerActionTableCell>
      )
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
    accessorKey: 'preview-action',
    header: undefined,
    cell: ({ row }) => {
      return (
        <div className='flex justify-center'>
          <DrawerActionTableCell item={row.original}>
            <Button variant='link' size='sm' className='text-foreground/50'>
              <EyeIcon />
              Preview
            </Button>
          </DrawerActionTableCell>
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='data-[state=open]:bg-muted text-muted-foreground flex size-8' size='icon'>
            <IconDotsVertical />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-40'>
          <Link href={`results/${row.original.id}`}>
            <DropdownMenuItem className='justify-between'>
              Show Results
              <ChartColumnIcon className='size-3.5' />
            </DropdownMenuItem>
          </Link>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant='destructive' className='justify-between'>
            Delete Attempt
            <TrashIcon className='size-3.5' />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
]

// gap between columns (padding) except for action columns
const sharedClasses =
  '*:[th]:not-data-[column-id*=action]:px-5 *:[td]:not-data-[column-id*=action]:px-5 *:[th]:not-data-[column-id*=action]:border-x *:[th]:border-neutral-300 dark:*:[th]:border-inherit'

function DraggableRow({ row }: { row: Row<ExamAttemptItem> }) {
  const { transform, transition, setNodeRef, isDragging } = useSortable({
    id: row.original.id,
  })

  return (
    <TableRow
      data-state={row.getIsSelected() && 'selected'}
      data-dragging={isDragging}
      ref={setNodeRef}
      className={cn(
        'relative z-0 hover:bg-neutral-200/30 data-[dragging=true]:z-10 data-[dragging=true]:opacity-80 data-[state=selected]:bg-neutral-200/50 dark:hover:bg-neutral-700/40 dark:data-[state=selected]:bg-neutral-700/50',
        sharedClasses,
      )}
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

  // #region Automatic ** hiding **  of columns when table overflows (re-appearance is not automatic). Disabled once user makes manual changes
  const tableRef = React.useRef<HTMLTableElement>(null)
  const size = useWindowSize()
  const orientation = useOrientation()
  const prevOrientation = usePrevious(orientation.type)
  const prevSize = usePrevious(size)
  const [columnHidingPolicy, setColumnHidingPolicy] = React.useState<'automatic' | 'manual'>('automatic')

  React.useEffect(() => {
    if (prevOrientation === orientation.type) return
    console.log('Orientation changed.')
    setColumnHidingPolicy('automatic')
    setColumnVisibility({})
  }, [orientation])

  React.useEffect(() => {
    if (columnHidingPolicy !== 'automatic') {
      console.warn('Aborting automatic resizing --> manual mode')
      return
    }

    // initial render
    if ((prevSize === null || prevSize.width === null) && prevOrientation === orientation.type) return

    // unchanged
    if (prevSize === size && prevOrientation === orientation.type) return

    if (!tableRef.current) return

    const el = tableRef.current
    const isOverflowing = el.clientWidth < el.scrollWidth || el.clientHeight < el.scrollHeight

    const columnHideOrder = ['status', 'type', 'duration', 'totalScore', 'preview-action']
    const disabled = getKeys(columnVisibility).filter((key) => !columnVisibility[key])

    if (!isOverflowing) return

    const next = columnHideOrder.filter((colId) => !disabled.includes(colId))[0]
    if (!next) return

    // hide respective column
    table.getColumn(next)?.toggleVisibility()

    console.log(`Table is overflowing.... hiding "${next}" column.`)
  }, [size, columnVisibility, orientation, columnHidingPolicy])
  // #endregion

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
    <div className='@container/table flex w-full flex-col justify-start gap-6'>
      <div className='-mb-2 flex items-center justify-between px-4 lg:px-6'>
        <div className='ml-2 hidden items-center gap-2 @sm/table:flex'>
          <Label htmlFor='rows-per-page' className='text-sm font-medium'>
            Rows per page
          </Label>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}>
            <SelectTrigger
              size='sm'
              className='dark:border-ring-subtle border-ring-subtle !h-7 w-fit bg-neutral-200/70 hover:cursor-pointer hover:bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-600/80'
              id='rows-per-page'>
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
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className='capitalize'
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => {
                        column.toggleVisibility(!!value)
                        setColumnHidingPolicy('manual')
                      }}>
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
            <Table tableContainerRef={tableRef}>
              <TableHeader className='sticky top-0 z-10 bg-neutral-200/70 dark:bg-neutral-900/70'>
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

function DrawerActionTableCell({ item, children }: { item: ExamAttemptItem; children: React.ReactNode }) {
  const isMobile = useIsMobile()
  const currentLocale = useCurrentLocale()

  return (
    <Drawer direction={isMobile ? 'bottom' : 'right'}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className='data-[vaul-drawer-direction=right]:*:data-close:flex'>
        <div data-close className='absolute top-0 bottom-0 -left-2.5 hidden items-center'>
          <DrawerClose asChild>
            <Button variant='ghost' size='icon' className='bg-background size-4 text-neutral-600 hover:scale-115 dark:text-neutral-300'>
              <ChevronRightIcon className='' />
            </Button>
          </DrawerClose>
        </div>
        <DrawerHeader className='mb-6 gap-1 border-b'>
          <DrawerTitle>Examination Attempt - {item.username}</DrawerTitle>
          <DrawerDescription>Showing basics about {item.username}&apos;s examaination attempt.</DrawerDescription>
        </DrawerHeader>
        <div className='flex flex-1 flex-col gap-4 overflow-y-auto px-4 text-sm'>
          <QuestionScoresLineChart />
          <form className='mt-4 flex flex-col gap-6'>
            <div className='grid-container [--grid-column-count:2] [--grid-desired-gap-x:48px] [--grid-desired-gap:24px] [--grid-item-min-width:80px]'>
              <div className='col-span-2 flex flex-2 flex-col gap-3'>
                <Label htmlFor='username'>Username</Label>
                <Input id='username' readOnly defaultValue={item.username} />
              </div>

              <div className='flex flex-1 flex-col gap-3'>
                <Label htmlFor='score'>User Score</Label>
                <Input id='score' type='number' defaultValue={item.score} />
              </div>
              <div className='flex flex-1 flex-col gap-3'>
                <Label htmlFor='startedAt'>Start Time</Label>
                <Input id='startedAt' readOnly defaultValue={format(item.startedAt, 'P pp', { locale: currentLocale === 'en' ? enUS : deAT })} />
              </div>
              <div className='flex flex-col gap-3'>
                <Label htmlFor='duration'>Duration</Label>
                <Input id='duration' readOnly defaultValue={differenceInMinutes(item.finishedAt, item.startedAt) + ' minutes'} />
              </div>
              <div className='flex flex-1 flex-col gap-3'>
                <Label htmlFor='finishedAt'>End Time</Label>
                <Input id='finishedAt' readOnly defaultValue={format(item.startedAt, 'P pp', { locale: currentLocale === 'en' ? enUS : deAT })} />
              </div>
            </div>
          </form>
        </div>
        <DrawerFooter className='grid grid-cols-2 gap-12'>
          <DrawerClose asChild>
            <Button className='' variant='outline'>
              Close
            </Button>
          </DrawerClose>

          <DrawerClose asChild>
            <Button className=''>Save Changes</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
