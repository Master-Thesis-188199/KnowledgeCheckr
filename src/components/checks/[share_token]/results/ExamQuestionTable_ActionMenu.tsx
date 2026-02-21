import { useState } from 'react'
import { IconDotsVertical } from '@tabler/icons-react'
import { Row } from '@tanstack/react-table'
import { ChartColumnIcon, TrashIcon } from 'lucide-react'
import { PreviewQuestionResult_QuestionItem } from '@/src/components/checks/[share_token]/results/ExamQuestionResultTable'
import ShowAnswerDrawer_TableCell from '@/src/components/checks/[share_token]/results/PreviewQuestionResultDrawer'
import { Button } from '@/src/components/shadcn/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/src/components/shadcn/dropdown-menu'
import { useCurrentLocale, useScopedI18n } from '@/src/i18n/client-localization'
import { cn } from '@/src/lib/Shared/utils'

export default function ExamQuestionTable_ActionMenu({ row }: { row: Row<PreviewQuestionResult_QuestionItem> }) {
  const t = useScopedI18n('Checks.ExaminatonResults.ExaminationQuestionTable.ActionMenu')
  const currentLocale = useCurrentLocale()
  const [drawerOpenState, setDrawerOpenState] = useState(false)

  return (
    <>
      <ShowAnswerDrawer_TableCell item={row.original} open={drawerOpenState} setOpenAction={setDrawerOpenState} />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='ghost' className='flex size-8 text-muted-foreground data-[state=open]:bg-muted' size='icon'>
            <IconDotsVertical />
            <span className='sr-only'>{t('sr_only_trigger')}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className={cn('w-40', currentLocale === 'de' && 'w-48')}>
          <DropdownMenuItem className='justify-between' onSelect={() => requestAnimationFrame(() => setDrawerOpenState(true))}>
            {t('show_answers_label')}
            <ChartColumnIcon className='size-3.5' />
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant='destructive' className='justify-between'>
            {t('delete_answer_label')}
            <TrashIcon className='size-3.5' />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  )
}
