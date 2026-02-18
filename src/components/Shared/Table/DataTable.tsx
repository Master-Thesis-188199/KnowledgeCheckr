'use client'

import * as React from 'react'
import { closestCenter, DndContext, type DragEndEvent, KeyboardSensor, MouseSensor, TouchSensor, type UniqueIdentifier, useSensor, useSensors } from '@dnd-kit/core'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { IconChevronDown, IconChevronLeft, IconChevronRight, IconChevronsLeft, IconChevronsRight, IconLayoutColumns } from '@tabler/icons-react'
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
import isEqual from 'lodash/isEqual'
import { Button } from '@/components/shadcn/button'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '@/components/shadcn/dropdown-menu'
import { Label } from '@/components/shadcn/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/shadcn/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/shadcn/table'
import getKeys from '@/src/lib/Shared/Keys'
import { cn } from '@/src/lib/Shared/utils'

// gap between columns (padding) except for action columns
const sharedClasses = cn(
  '*:[th]:not-data-[column-id*=action]:px-5 *:[td]:not-data-[column-id*=action]:px-5 *:[th]:not-data-[column-id*=action]:border-x *:[th]:border-neutral-300 dark:*:[th]:border-inherit',
  //* ensure primary column takes up free space (w-full) but the content-width is limited to 40% of screen width.
  //* That way the column may not require more than 40% of screen width based on content.
  //* Hence, the column may take up all the free space (w-full) but if the other table columns require space, then the primary column will not enforce its width above 40% screen width
  '*:[td]:data-[column-id=primary]:max-w-[40vw] ',
  ' *:[td[id=primary]]:w-full *:[th[id=primary]]:w-full *:[td]:data-[column-id=primary]:*:whitespace-nowrap *:[td]:data-[column-id=primary]:*:truncate',
)

function DraggableRow<I extends { id: string | number }>({ row }: { row: Row<I> }) {
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

export function DataTable<T extends I[], I extends { id: string | number }>({ data: initialData, columns, columnHideOrder }: { data: T; columns: ColumnDef<I>[]; columnHideOrder?: string[] }) {
  const [data, setData] = React.useState<I[]>(() => initialData)
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
    if (prevOrientation === orientation.type || prevOrientation === null) return
    console.log('Orientation changed.')
    setColumnHidingPolicy('automatic')
    setColumnVisibility({})
  }, [orientation])

  React.useEffect(() => {
    if (!columnHideOrder || columnHideOrder.length === 0) return

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

    const disabled = getKeys(columnVisibility).filter((key) => !columnVisibility[key])

    if (!isOverflowing) return

    const next = columnHideOrder.filter((colId) => !disabled.includes(colId))[0]
    if (!next) return

    // hide respective column
    table.getColumn(next)?.toggleVisibility()

    console.log(`Table is overflowing.... hiding "${next}" column.`)
  }, [size, columnVisibility, orientation, columnHidingPolicy, pagination])
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
      <div className='-mb-2 flex items-center justify-between'>
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
                      {/* @ts-expect-error Expect accessorKey to be not recognized even though it exists */}
                      {column.columnDef.accessorKey ?? column.id}
                    </DropdownMenuCheckboxItem>
                  )
                })}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className='relative flex flex-col gap-4 overflow-auto'>
        <div className='overflow-hidden rounded-lg border'>
          <DndContext collisionDetection={closestCenter} modifiers={[restrictToVerticalAxis]} onDragEnd={handleDragEnd} sensors={sensors} id={sortableId}>
            <Table tableContainerRef={tableRef}>
              <TableHeader className='sticky top-0 z-10 bg-neutral-200/70 dark:bg-neutral-900/70'>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className={cn('', sharedClasses)}>
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

function TableFooter<I extends { id: string | number }>({ table }: { table: TableType<I> }) {
  return (
    <div className='flex items-center justify-between px-4'>
      <div className={cn('text-muted-foreground hidden flex-1 text-sm transition-opacity lg:flex', table.getFilteredSelectedRowModel().rows.length === 0 && 'opacity-0')}>
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
