'use client'

import * as React from 'react'
import { IconCircleCheckFilled, IconDotsVertical, IconLoader } from '@tabler/icons-react'
import { type ColumnDef } from '@tanstack/react-table'
import { differenceInMinutes, format } from 'date-fns'
import { deAT, enUS } from 'date-fns/locale'
import { ChartColumnIcon, ChevronRightIcon, EyeIcon, TrashIcon } from 'lucide-react'
import Link from 'next/link'
import { z } from 'zod'
import { Badge } from '@/components/shadcn/badge'
import { Button } from '@/components/shadcn/button'
import { Checkbox } from '@/components/shadcn/checkbox'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/shadcn/drawer'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/shadcn/dropdown-menu'
import { Input } from '@/components/shadcn/input'
import { Label } from '@/components/shadcn/label'
import { useIsMobile } from '@/hooks/use-mobile'
import { QuestionScoresLineChart } from '@/src/components/charts/QuestionScoresLineChart'
import { DataTable } from '@/src/components/Shared/Table/DataTable'
import { useCurrentLocale, useScopedI18n } from '@/src/i18n/client-localization'
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

export function ExaminationAttemptTable({ data: initialData }: { data: ExamAttemptItem[] }) {
  const currentLocale = useCurrentLocale()
  const tDataTable = useScopedI18n('Components.DataTable')
  const tShared = useScopedI18n('Shared.Timestamp')
  const t = useScopedI18n('Checks.ExaminatonResults.ExaminationAttemptTable')

  const columns = React.useMemo(() => {
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
        id: 'primary',
        accessorKey: t('columns.username_header'),
        header: t('columns.username_header'),
        cell: ({ row }) => {
          return (
            <DrawerActionTableCell item={row.original}>
              <Button variant='link' className='w-fit px-0 text-left text-foreground'>
                {row.original.username}
              </Button>
            </DrawerActionTableCell>
          )
        },
        enableHiding: false,
      },

      {
        id: 'status',
        accessorKey: t('columns.status_header'),
        header: t('columns.status_header'),
        cell: ({ row }) => (
          <Badge variant='outline' className='px-1.5 text-muted-foreground'>
            {row.original.status === 'Done' || row.original.status === 'Erledigt' ? <IconCircleCheckFilled className='fill-green-500 dark:fill-green-400/70' /> : <IconLoader />}
            {row.original.status}
          </Badge>
        ),
      },
      {
        id: 'duration',
        accessorKey: t('columns.duration_header'),
        header: () => <div className=''>{t('columns.duration_header')}</div>,
        cell: ({ row }) => (
          <div className='text-foreground' id={`${row.original.id}-duration`}>
            {tShared('minute', { count: differenceInMinutes(row.original.finishedAt, row.original.startedAt) })}
          </div>
        ),
      },
      {
        id: 'type',
        accessorKey: t('columns.user_type_header'),
        header: t('columns.user_type_header'),
        cell: ({ row }) => (
          <div className='w-fit'>
            <Badge variant='outline' className='px-1.5 text-muted-foreground'>
              {row.original.type}
            </Badge>
          </div>
        ),
      },
      {
        id: 'score',
        accessorKey: t('columns.score_header'),
        header: () => <div className='w-full text-center'>{t('columns.score_header')}</div>,
        cell: ({ row }) => (
          <div className='text-center text-xs text-foreground' id={`${row.original.id}-score`}>
            {row.original.score}
          </div>
        ),
      },
      {
        id: 'totalScore',
        accessorKey: t('columns.totalScore_header'),
        header: () => <div className='w-full text-center'>{t('columns.totalScore_header')}</div>,
        cell: ({ row }) => (
          <div className='text-center text-xs text-foreground' id={`${row.original.id}-total-check-score`}>
            {row.original.totalCheckScore}
          </div>
        ),
      },
      {
        id: 'preview-action',
        header: undefined,
        cell: ({ row }) => {
          return (
            <div className='flex justify-center'>
              <DrawerActionTableCell item={row.original}>
                <Button variant='link' size='sm' className='text-foreground/50'>
                  <EyeIcon />
                  {t('columns.preview_action_cell')}
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
              <Button variant='ghost' className='flex size-8 text-muted-foreground data-[state=open]:bg-muted' size='icon'>
                <IconDotsVertical />
                <span className='sr-only'>{t('columns.actions_menu.sr_only_trigger')}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end' className={cn('w-40', currentLocale === 'de' && 'w-48')}>
              <Link href={`results/${row.original.id}`}>
                <DropdownMenuItem className='justify-between'>
                  {t('columns.actions_menu.show_results_label')}
                  <ChartColumnIcon className='size-3.5' />
                </DropdownMenuItem>
              </Link>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant='destructive' className='justify-between'>
                {t('columns.actions_menu.delete_attempt_label')}
                <TrashIcon className='size-3.5' />
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ),
      },
    ]
    return columns
  }, [t, tDataTable, tShared, currentLocale])

  return <DataTable columns={columns} data={initialData} columnHideOrder={['status', 'type', 'duration', 'totalScore', 'preview-action']} />
}

function DrawerActionTableCell({ item, children }: { item: ExamAttemptItem; children: React.ReactNode }) {
  const tShared = useScopedI18n('Shared.Timestamp')
  const t = useScopedI18n('Checks.ExaminatonResults.ExaminationAttemptTable.Drawer')
  const isMobile = useIsMobile()
  const currentLocale = useCurrentLocale()

  return (
    <Drawer direction={isMobile ? 'bottom' : 'right'}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className='data-[vaul-drawer-direction=right]:*:data-close:flex'>
        <div data-close className='absolute top-0 bottom-0 -left-2.5 hidden items-center'>
          <DrawerClose asChild>
            <Button variant='ghost' size='icon' className='size-4 bg-background text-neutral-600 hover:scale-115 dark:text-neutral-300'>
              <ChevronRightIcon className='' />
            </Button>
          </DrawerClose>
        </div>
        <DrawerHeader className='mb-6 gap-1 border-b'>
          <DrawerTitle>{t('title', { username: item.username })}</DrawerTitle>
          <DrawerDescription>{t('description', { username: item.username })}</DrawerDescription>
        </DrawerHeader>
        <div className='flex flex-1 flex-col gap-4 overflow-y-auto px-4 text-sm'>
          <QuestionScoresLineChart />
          <form className='mt-4 flex flex-col gap-6'>
            <div className='grid-container [--grid-column-count:2] [--grid-desired-gap-x:48px] [--grid-desired-gap:24px] [--grid-item-min-width:80px]'>
              <div className='col-span-2 flex flex-2 flex-col gap-3'>
                <Label htmlFor='username'>{t('username_label')}</Label>
                <Input id='username' readOnly defaultValue={item.username} />
              </div>

              <div className='flex flex-1 flex-col gap-3'>
                <Label htmlFor='score'>{t('user_score_label')}</Label>
                <Input id='score' type='number' defaultValue={item.score} />
              </div>
              <div className='flex flex-1 flex-col gap-3'>
                <Label htmlFor='startedAt'>{t('start_time_label')}</Label>
                <Input id='startedAt' readOnly defaultValue={format(item.startedAt, 'P pp', { locale: currentLocale === 'en' ? enUS : deAT })} />
              </div>
              <div className='flex flex-col gap-3'>
                <Label htmlFor='duration'>{t('duration_label')}</Label>
                <Input id='duration' readOnly defaultValue={tShared('minute', { count: differenceInMinutes(item.finishedAt, item.startedAt) })} />
              </div>
              <div className='flex flex-1 flex-col gap-3'>
                <Label htmlFor='finishedAt'>{t('end_time_label')}</Label>
                <Input id='finishedAt' readOnly defaultValue={format(item.finishedAt, 'P pp', { locale: currentLocale === 'en' ? enUS : deAT })} />
              </div>
            </div>
          </form>
        </div>
        <DrawerFooter className='grid grid-cols-2 gap-12'>
          <DrawerClose asChild>
            <Button className='' variant='outline'>
              {t('close_button_label')}
            </Button>
          </DrawerClose>

          <DrawerClose asChild>
            <Button className=''>{t('submit_button_label')}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
