'use client'

import { generateHTML } from '@tiptap/core'
import { Info, PenIcon, Plus, TrashIcon } from 'lucide-react'
import CourseContentDialog from '@/src/components/courses/create/(sections)/CourseContentDialog'
import { useCourseStore } from '@/src/components/courses/create/CreateCourseProvider'
import { Button } from '@/src/components/shadcn/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/shadcn/card'
import GenericCard from '@/src/components/Shared/Card'
import { CardStageJumpButton } from '@/src/components/Shared/CardStageJumpButton'
import ConfirmationDialog from '@/src/components/Shared/ConfirmationDialog/ConfirmationDialog'
import { RichTextEditor, RichTextEditorExtensions } from '@/src/components/tiptap-examples/RichTextEditor'
import { useScopedI18n } from '@/src/i18n/client-localization'
import { cn } from '@/src/lib/Shared/utils'
import { CourseContent } from '@/src/schemas/CourseContentSchema'

export default function ContentSection() {
  const { contents } = useCourseStore((store) => store)
  const t = useScopedI18n('Courses.Create.ContentSection')

  return (
    <div className='flex flex-1 flex-col gap-10'>
      <div className='flex flex-col gap-1'>
        <h2 className='h-fit text-xl font-semibold'>{t('title')}</h2>
        <span className='text-muted-foreground'>{t('description')}</span>
      </div>

      {contents.length > 0 ? <CourseContentRenderer /> : <EmptyCourseContentBody />}

      <CreateContentButton />
    </div>
  )
}

function CreateContentButton({ disabled }: { disabled?: boolean }) {
  const t = useScopedI18n('Courses.Create.ContentSection')

  return (
    <CourseContentDialog mode='create'>
      <div className='flex justify-center gap-8'>
        <Button variant='outline' size='lg' disabled={disabled}>
          <Plus className='size-5' />
          {t('Actions.create_new_button_label')}
        </Button>
      </div>
    </CourseContentDialog>
  )
}

function CourseContentRenderer() {
  const t = useScopedI18n('Courses.Create.ContentSection')
  const { contents, removeCourseContent } = useCourseStore((store) => store)

  return (
    <div className='grid grid-cols-[repeat(auto-fill,minmax(380px,1fr))] gap-12'>
      {contents.map((content) => {
        const htmlContent = content.content ? generateHTML(content.content, RichTextEditorExtensions) : ''

        return (
          <Card key={content.categoryId} className=''>
            <CardHeader>
              <CardTitle>{content.title}</CardTitle>
              <CardDescription>{content.description}</CardDescription>
              <CardAction>
                <CourseContentDialog mode='edit' courseContent={content}>
                  <Button variant='link' asChild aria-label={t('Actions.edit_content_button_aria_label')} className='enabled:text-orange-400 dark:enabled:text-orange-300/80'>
                    <PenIcon />
                    {t('Actions.edit_content_button_label')}
                  </Button>
                </CourseContentDialog>

                <ConfirmationDialog
                  confirmAction={() => removeCourseContent(content.categoryId)}
                  confirmLabel={t('Actions.delete_content_confirm_label')}
                  body={t('Actions.delete_content_dialog_body')}>
                  <Button variant='link' asChild aria-label={t('Actions.delete_content_button_aria_label')} className='enabled:text-destructive/80'>
                    <TrashIcon />
                    {t('Actions.delete_content_button_label')}
                  </Button>
                </ConfirmationDialog>
              </CardAction>
            </CardHeader>
            <CardContent className='flex h-full px-4.5 **:[div]:[[role=presentation]]:max-h-42 **:[div]:[[role=presentation]]:min-h-auto **:[div]:[[role=presentation]]:cursor-default **:[div]:[[role=presentation]]:border-ring-subtle **:[div]:[[role=presentation]]:p-2.5'>
              <RichTextEditor key={htmlContent} defaultContent={content.content} readOnly size='sm' />
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

function EmptyCourseContentBody() {
  return (
    <div className={cn('flex min-h-60 flex-1 flex-col items-center justify-center gap-6')}>
      <Info className='size-16 text-neutral-400 dark:text-neutral-500' />
      <span className='text-center tracking-wide text-balance text-neutral-500 dark:text-neutral-400'>{'There are currently no contents associated to this course.'}</span>
    </div>
  )
}

export function CourseContentOverview({ jumpBackButton = true }: { jumpBackButton?: boolean }) {
  const { contents } = useCourseStore((store) => store)
  const t = useScopedI18n('Courses.Create.ContentSection')

  function Element(content: CourseContent) {
    return (
      <GenericCard disableInteractions className='flex flex-col gap-1 p-2'>
        <h2 className='text-neutral-700 dark:text-neutral-300'>{content.title}</h2>
        <p className='line-clamp-1 text-sm text-muted-foreground'>{content.description}</p>
      </GenericCard>
    )
  }

  if (contents.length === 0) {
    return (
      <GenericCard disableInteractions className='relative flex break-inside-avoid flex-col p-3'>
        {jumpBackButton && <CardStageJumpButton targetStage={2} />}
        <div className='-mx-3 -mt-3 flex flex-col rounded-t-md border-b border-neutral-400 bg-neutral-300 p-2 px-3 text-neutral-600 dark:border-neutral-500 dark:bg-neutral-700/60 dark:text-neutral-300'>
          <div className='flex items-center justify-between'>
            <h2 className=''>{t('title')}</h2>
          </div>
        </div>
        <div className={cn('flex min-h-60 flex-1 flex-col items-center justify-center gap-6')}>
          <Info className='size-16 text-neutral-400 dark:text-neutral-500' />
          <span className='text-center tracking-wide text-balance text-neutral-500 dark:text-neutral-400'>{'There are currently no contents associated to this course.'}</span>
        </div>
      </GenericCard>
    )
  }

  return (
    <GenericCard disableInteractions className='relative flex break-inside-avoid flex-col p-3'>
      {jumpBackButton && <CardStageJumpButton targetStage={2} />}
      <div className='-mx-3 -mt-3 flex flex-col rounded-t-md border-b border-neutral-400 bg-neutral-300 p-2 px-3 text-neutral-600 dark:border-neutral-500 dark:bg-neutral-700/60 dark:text-neutral-300'>
        <div className='flex items-center justify-between'>
          <h2 className=''>{t('title')}</h2>
        </div>
      </div>

      {contents.length === 0 && <div></div>}

      <div className='mt-5 flex flex-col gap-6'>
        {contents.map((c) => (
          <Element key={c.categoryId} {...c} />
        ))}
      </div>
    </GenericCard>
  )
}
