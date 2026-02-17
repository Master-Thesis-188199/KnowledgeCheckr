import { IconDotsVertical } from '@tabler/icons-react'
import { Row } from '@tanstack/react-table'
import { ChartColumnIcon, TrashIcon } from 'lucide-react'
import { PreviewQuestionResult_QuestionItem } from '@/src/components/checks/[share_token]/results/ExamQuestionResultTable'
import ShowAnswerDrawer_TableCell from '@/src/components/checks/[share_token]/results/PreviewQuestionResultDrawer'
import { Button } from '@/src/components/shadcn/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/src/components/shadcn/dropdown-menu'

export default function ExamQuestionTable_ActionMenu({ row }: { row: Row<PreviewQuestionResult_QuestionItem> }) {
  return (
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
  )
}
