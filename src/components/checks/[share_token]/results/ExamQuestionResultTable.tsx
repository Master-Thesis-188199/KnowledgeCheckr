'use client'

import { IconCircleCheckFilled, IconDotsVertical } from '@tabler/icons-react'
import { ColumnDef } from '@tanstack/react-table'
import { ChartColumnIcon, EyeIcon, TrashIcon, XIcon } from 'lucide-react'
import ShowAnswerDrawer_TableCell from '@/src/components/checks/[share_token]/results/PreviewQuestionResultDrawer'
import { Badge } from '@/src/components/shadcn/badge'
import { Button } from '@/src/components/shadcn/button'
import { Checkbox } from '@/src/components/shadcn/checkbox'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/src/components/shadcn/dropdown-menu'
import { Input } from '@/src/components/shadcn/input'
import { DataTable } from '@/src/components/Shared/Table/DataTable'
import createDummyQuestionInput from '@/src/lib/dummy/createDummyUserInput'
import { instantiateQuestion, Question } from '@/src/schemas/QuestionSchema'
import { QuestionInput } from '@/src/schemas/UserQuestionInputSchema'

export type PreviewQuestionResult_QuestionItem = {
  id: string
  position: number
  type: Question['type']
  questionText: string
  score: number
  grade?: string
  points: Question['points']
  category: Question['category']
  rawQuestion: Question
  userInput?: QuestionInput
}

export default function ExamQuestionResultTable() {
  const columns: ColumnDef<PreviewQuestionResult_QuestionItem>[] = [
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
        <div className='text-center text-foreground' id={`${row.original.id}-duration`}>
          {row.original.position}
        </div>
      ),
    },
    {
      id: 'primary',
      accessorKey: 'question',
      header: 'Question',
      cell: ({ row }) => {
        return <div className='text-left text-foreground'>{row.original.questionText}</div>
      },
      enableHiding: false,
    },

    {
      accessorKey: 'category',
      header: () => <div className='text-center'>Category</div>,
      cell: ({ row }) => (
        <Badge variant='outline' className='px-1.5 text-muted-foreground'>
          {row.original.category}
        </Badge>
      ),
    },

    {
      accessorKey: 'answer status',
      header: () => <div className='text-center'>Answer Status</div>,
      cell: () => (
        <Badge variant='outline' className='px-1.5 text-muted-foreground'>
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
        <Badge variant='outline' className='px-1.5 text-muted-foreground'>
          {row.original.type}
        </Badge>
      ),
    },
    {
      accessorKey: 'score',
      header: () => <div className='text-center'>Score</div>,
      cell: ({ row }) => (
        <div className='text-center text-xs text-foreground' id={`${row.original.id}-score`}>
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
            className='h-fit w-12 border-ring-subtle/70 bg-transparent px-0 py-1.5 text-center text-xs dark:border-ring-subtle/70 dark:bg-transparent [&::-webkit-inner-spin-button]:-translate-x-1 [&::-webkit-inner-spin-button]:scale-75'
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
            <ShowAnswerDrawer_TableCell item={row.original}>
              <Button variant='link' size='sm' className='text-foreground/50'>
                <EyeIcon />
                Show Answers
              </Button>
            </ShowAnswerDrawer_TableCell>
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
              <span className='sr-only'>Open menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end' className='w-40'>
            <ShowAnswerDrawer_TableCell item={row.original}>
              <DropdownMenuItem className='justify-between' onSelect={(e) => e.preventDefault()}>
                Show Answers
                <ChartColumnIcon className='size-3.5' />
              </DropdownMenuItem>
            </ShowAnswerDrawer_TableCell>
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

  const data: PreviewQuestionResult_QuestionItem[] = Array.from({ length: dummySize }, (_, i) => {
    const rawQuestion = instantiateQuestion()
    const { id, category, points, question, type } = rawQuestion

    return {
      id,
      category,
      type,
      points,
      questionText: question,
      position: i + 1,
      // eslint-disable-next-line react-hooks/purity
      score: Math.round(Math.random() * points),
      rawQuestion,
      userInput: createDummyQuestionInput(rawQuestion),
    }
  })

  return <DataTable data={data} columns={columns} columnHideOrder={['answer status', 'category', 'position', 'points', 'preview-action', 'type', 'score']} />
}
