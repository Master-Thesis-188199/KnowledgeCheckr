'use client'

import { Folder, Info, Pen, Plus, Trash2 } from 'lucide-react'
import CourseContentDialog from '@/src/components/courses/create/(sections)/CourseContentDialog'
import { useCourseStore } from '@/src/components/courses/create/CreateCourseProvider'
import { Button } from '@/src/components/shadcn/button'
import GenericCard from '@/src/components/Shared/Card'
import { CardStageJumpButton } from '@/src/components/Shared/CardStageJumpButton'
import ConfirmationDialog from '@/src/components/Shared/ConfirmationDialog/ConfirmationDialog'
import { useScopedI18n } from '@/src/i18n/client-localization'
import { cn } from '@/src/lib/Shared/utils'

export default function ContentSection({ jumpBackButton, disabled }: { jumpBackButton?: boolean; disabled?: boolean }) {
  const { contents } = useCourseStore((store) => store)
  const t = useScopedI18n('Courses.Create.ContentSection')

  return (
    <GenericCard disableInteractions className='relative flex break-inside-avoid flex-col p-3'>
      {jumpBackButton && <CardStageJumpButton targetStage={2} />}
      <div className='-mx-3 -mt-3 flex flex-col rounded-t-md border-b border-neutral-400 bg-neutral-300 p-2 px-3 text-neutral-600 dark:border-neutral-500 dark:bg-neutral-700/60 dark:text-neutral-300'>
        <div className='flex flex-col gap-0'>
          <h2 className=''>{t('title')}</h2>
        </div>
      </div>

      {contents.length > 0 ? <CourseContentRenderer disabled={disabled} /> : <EmptyCourseContentBody />}

      <CreateContentButton disabled={disabled} />
    </GenericCard>
  )
}

function CreateContentButton({ disabled }: { disabled?: boolean }) {
  const t = useScopedI18n('Courses.Create.ContentSection')

  return (
    <div className='flex justify-center gap-8'>
      <CourseContentDialog mode='create'>
        <Button variant='outline' size='lg' disabled={disabled}>
          <Plus className='size-5' />
          {t('Actions.create_new_button_label')}
        </Button>
      </CourseContentDialog>
    </div>
  )
}

function CourseContentRenderer({ disabled }: { disabled?: boolean }) {
  const t = useScopedI18n('Courses.Create.ContentSection')
  const { contents, removeCourseContent, questionCategories } = useCourseStore((store) => store)

  return (
    <div className={cn('my-4 grid flex-1 grid-cols-1 gap-6')}>
      {contents.map((content, i) => (
        <GenericCard disableInteractions key={i + content.categoryId} className={cn('relative flex h-fit gap-3 p-2 first:mt-3 hover:bg-none')}>
          <div className='flex flex-1 flex-col p-1'>
            <div className='flex items-center justify-between'>
              <h2 className='text-neutral-700 dark:text-neutral-300'>{content.title}</h2>
              <span className='text-neutral-700 dark:text-neutral-300'>{}</span>
            </div>
            <div className='flex justify-between text-xs'>
              <span className='text-neutral-500 lowercase dark:text-neutral-400'>{content.description}</span>
              <div className='flex items-center gap-1 text-neutral-500 dark:text-neutral-400'>
                <Folder className='size-3' />
                <span className='lowercase'>{questionCategories.find((c) => c.id === content.categoryId)?.name}</span>
              </div>
            </div>
          </div>
          <CourseContentDialog mode='edit' courseContent={content}>
            <Button
              aria-label={t('Actions.edit_content_button_aria_label')}
              size='icon'
              variant='base'
              type='button'
              disabled={disabled}
              className='group my-auto flex size-7.5 items-center gap-4 rounded-lg bg-neutral-300/50 p-1.5 ring-1 ring-neutral-400 hover:cursor-pointer hover:ring-[1.5px] hover:ring-ring-hover dark:bg-neutral-700 dark:ring-neutral-600 dark:hover:ring-ring-hover'>
              <Pen className='size-4 text-orange-600/70 group-hover:stroke-3 dark:text-orange-400/70' />
            </Button>
          </CourseContentDialog>

          <ConfirmationDialog confirmAction={() => removeCourseContent(content.categoryId)} confirmLabel={t('Actions.delete_content_confirm_label')} body={t('Actions.delete_content_dialog_body')}>
            <Button
              size='icon'
              variant='base'
              aria-label={t('Actions.delete_content_button_aria_label')}
              type='button'
              disabled={disabled}
              className='group my-auto flex size-7.5 items-center gap-4 rounded-lg bg-neutral-300/50 ring-1 ring-neutral-400 hover:cursor-pointer hover:ring-[1.5px] hover:ring-ring-hover dark:bg-neutral-700 dark:ring-neutral-600 dark:hover:ring-ring-hover'>
              <Trash2 className='size-4 text-red-600/70 group-hover:stroke-[2.5] dark:text-red-400/70' />
            </Button>
          </ConfirmationDialog>
        </GenericCard>
      ))}
    </div>
  )
}

function EmptyCourseContentBody() {
  const t = useScopedI18n('Courses.Create.ContentSection')
  return (
    <div className={cn('flex min-h-60 flex-1 flex-col items-center justify-center gap-6')}>
      <Info className='size-16 text-neutral-400 dark:text-neutral-500' />
      <span className='text-center tracking-wide text-balance text-neutral-500 dark:text-neutral-400'>{t('empty_content_text')}</span>
    </div>
  )
}
