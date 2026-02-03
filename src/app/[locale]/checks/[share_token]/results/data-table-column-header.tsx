import { type Column } from '@tanstack/react-table'
import { ArrowDown, ArrowUp, ChevronDownIcon, EyeOff } from 'lucide-react'
import { Button } from '@/components/shadcn/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/shadcn/dropdown-menu'
import { cn } from '@/src/lib/Shared/utils'

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
  features = { sorting: true },
}: DataTableColumnHeaderProps<TData, TValue> & { features?: { sorting?: boolean; hiding?: boolean } }) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        style={{ maxWidth: column.columnDef.maxSize ?? 'none' }}
        asChild
        className={cn('ring-ring-subtle dark:ring-ring-subtle data-[state=open]:bg-transparent dark:data-[state=open]:bg-transparent', 'justify-start', className)}>
        <Button variant='link' size='sm' className={cn('-ml-2 flex h-8 items-center gap-1 data-[state=open]:*:[svg]:stroke-3')}>
          <span>{title}</span>

          {column.getIsSorted() === 'desc' ? <ArrowDown className='size-3.5' /> : column.getIsSorted() === 'asc' ? <ArrowUp className='size-3.5' /> : <ChevronDownIcon className='' />}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='start'>
        <DropdownMenuItem disabled={!features?.sorting} onClick={() => column.toggleSorting(false)}>
          <ArrowUp />
          Asc
        </DropdownMenuItem>
        <DropdownMenuItem disabled={!features?.sorting} onClick={() => column.toggleSorting(true)}>
          <ArrowDown />
          Desc
        </DropdownMenuItem>
        {features.sorting && features.hiding && <DropdownMenuSeparator />}

        {features.hiding && (
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <EyeOff />
            Hide
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
