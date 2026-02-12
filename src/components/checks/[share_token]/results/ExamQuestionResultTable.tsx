'use client'

import { useState } from 'react'
import { IconCircleCheckFilled, IconDotsVertical } from '@tabler/icons-react'
import { ColumnDef } from '@tanstack/react-table'
import { ChartColumnIcon, CheckIcon, ChevronRightIcon, EyeIcon, TrashIcon, XIcon } from 'lucide-react'
import { QuestionScoresLineChart } from '@/src/components/charts/QuestionScoresLineChart'
import { Badge } from '@/src/components/shadcn/badge'
import { Button } from '@/src/components/shadcn/button'
import { Checkbox } from '@/src/components/shadcn/checkbox'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/src/components/shadcn/drawer'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/src/components/shadcn/dropdown-menu'
import { Input } from '@/src/components/shadcn/input'
import { Label } from '@/src/components/shadcn/label'
import { Slider } from '@/src/components/shadcn/slider'
import { DataTable } from '@/src/components/Shared/Table/DataTable'
import { useIsMobile } from '@/src/hooks/use-mobile'
import { instantiateQuestion, Question } from '@/src/schemas/QuestionSchema'

type QuestionItem = {
  id: string
  position: number
  type: Question['type']
  questionText: string
  score: number
  grade?: string
  points: Question['points']
  category: Question['category']
}

export default function ExamQuestionResultTable() {
  const columns: ColumnDef<QuestionItem>[] = [
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
      accessorKey: 'position',
      header: () => 'Pos',
      cell: ({ row }) => (
        <div className='text-foreground text-center' id={`${row.original.id}-duration`}>
          {row.original.position}
        </div>
      ),
    },
    {
      id: 'primary',
      accessorKey: 'question',
      header: 'Question',
      cell: ({ row }) => {
        return <div className='text-foreground text-left'>{row.original.questionText}</div>
      },
      enableHiding: false,
    },

    {
      accessorKey: 'category',
      header: () => <div className='text-center'>Category</div>,
      cell: ({ row }) => (
        <Badge variant='outline' className='text-muted-foreground px-1.5'>
          {row.original.category}
        </Badge>
      ),
    },

    {
      accessorKey: 'answer status',
      header: () => <div className='text-center'>Answer Status</div>,
      cell: () => (
        <Badge variant='outline' className='text-muted-foreground px-1.5'>
          {Math.random() > 0.25 ? (
            <>
              <IconCircleCheckFilled className='fill-green-500 dark:fill-green-400/70' />
              Answered
            </>
          ) : (
            <>
              <XIcon className='stroke-red-500 dark:stroke-red-400' />
              not Answered
            </>
          )}
        </Badge>
      ),
    },
    {
      accessorKey: 'type',
      header: () => <div className='text-center'>Type</div>,
      cell: ({ row }) => (
        <Badge variant='outline' className='text-muted-foreground px-1.5'>
          {row.original.type}
        </Badge>
      ),
    },
    {
      accessorKey: 'score',
      header: () => <div className='text-center'>Score</div>,
      cell: ({ row }) => (
        <div className='text-foreground text-center text-xs' id={`${row.original.id}-score`}>
          {row.original.score}
        </div>
      ),
    },
    {
      accessorKey: 'points',
      header: 'Points',
      cell: ({ row }) => <div className='flex justify-center'>{row.original.points}</div>,
    },
    {
      accessorKey: 'grade',
      header: 'Grade',
      cell: ({ row }) => (
        <div className='flex justify-center'>
          <Input
            defaultValue={row.original.grade}
            placeholder='N/A'
            className='dark:border-ring-subtle/70 border-ring-subtle/70 h-fit w-12 bg-transparent px-0 py-1.5 text-center text-xs dark:bg-transparent [&::-webkit-inner-spin-button]:-translate-x-1 [&::-webkit-inner-spin-button]:scale-75'
          />
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
                Show Answers
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
            <DrawerActionTableCell item={row.original}>
              <DropdownMenuItem className='justify-between' onSelect={(e) => e.preventDefault()}>
                Show Answers
                <ChartColumnIcon className='size-3.5' />
              </DropdownMenuItem>
            </DrawerActionTableCell>
            <DropdownMenuSeparator />
            <DropdownMenuItem variant='destructive' className='justify-between'>
              Delete Answer
              <TrashIcon className='size-3.5' />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const dummySize = 15

  const data: QuestionItem[] = Array.from({ length: dummySize }, (_, i) => {
    const { id, category, points, question, type } = instantiateQuestion()

    return {
      id,
      category,
      type,
      points,
      questionText: question,
      position: i + 1,
      // eslint-disable-next-line react-hooks/purity
      score: Math.round(Math.random() * points),
    }
  })

  return <DataTable data={data} columns={columns} columnHideOrder={['answer status', 'category', 'position', 'points', 'preview-action', 'type', 'score']} />
}

function DrawerActionTableCell({ item, children }: { item: QuestionItem; children: React.ReactNode }) {
  const isMobile = useIsMobile()
  const [slideValue, setSliderValue] = useState([item.score])

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
          <DrawerTitle>Answers for: {item.questionText}</DrawerTitle>
          <DrawerDescription>Showing user answers for question {item.position}.</DrawerDescription>
        </DrawerHeader>
        <div className='flex flex-1 flex-col gap-4 overflow-y-auto px-4 text-sm'>
          <QuestionScoresLineChart className='h-[175px]' />
          <form className='mt-4 flex flex-col gap-6'>
            <div className='col-span-2 flex flex-2 flex-col gap-3'>
              <Label htmlFor='question'>Question</Label>
              <Input id='question' readOnly defaultValue={item.questionText} />
            </div>

            <div className='flex justify-between gap-6'>
              <div className='flex flex-2 flex-col gap-3'>
                <div className='flex items-center justify-between'>
                  <Label htmlFor='slider'>Question Score</Label>
                  <span className='text-muted-foreground text-sm'>{slideValue[0]} points</span>
                </div>
                <Slider id='slider' max={item.points} min={0} onValueChange={setSliderValue} onPointerDown={(e) => e.stopPropagation()} value={slideValue} />
                <div className='text-muted-foreground flex items-center justify-between text-xs'>
                  <span>0 points</span>
                  <span>{item.points} points</span>
                </div>
              </div>
              <div className='flex-1' />
            </div>

            <div className='flex flex-col gap-3'>
              <Label htmlFor='answers'>Answers</Label>
              <div className='grid-container mx-3 [--grid-column-count:2] [--grid-desired-gap-x:36px] [--grid-desired-gap:24px] [--grid-item-min-width:80px]'>
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className='relative flex h-10 w-full items-center justify-center rounded-md bg-neutral-200 dark:bg-neutral-700'>
                    {(i === 0 || i === 3) && <CheckIcon className='absolute top-0.5 right-0.5 size-3.5' />}
                    Answer {i + 1}
                  </div>
                ))}
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
