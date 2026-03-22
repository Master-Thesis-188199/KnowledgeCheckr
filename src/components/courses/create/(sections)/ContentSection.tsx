'use client'

import { PenIcon, PlusCircleIcon, TrashIcon } from 'lucide-react'
import CourseContentDialog from '@/src/components/courses/create/(sections)/CourseContentDialog'
import { useCourseStore } from '@/src/components/courses/create/CreateCourseProvider'
import { Button } from '@/src/components/shadcn/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/shadcn/card'
import ConfirmationDialog from '@/src/components/Shared/ConfirmationDialog/ConfirmationDialog'
import { RichTextEditor } from '@/src/components/tiptap-examples/RichTextEditor'
import { useScopedI18n } from '@/src/i18n/client-localization'

export default function ContentSection() {
  const { contents, removeCourseContent } = useCourseStore((store) => store)
  const t = useScopedI18n('Courses.Create.ContentSection')

  return (
    <div className='flex flex-1 flex-col gap-10'>
      <div className='flex flex-col gap-1'>
        <h2 className='h-fit text-xl font-semibold'>{t('title')}</h2>
        <span className='text-muted-foreground'>{t('description')}</span>
      </div>

      <div className='grid grid-cols-[repeat(auto-fill,minmax(380px,1fr))] gap-12'>
        <CourseContentDialog mode='create'>
          <Card className='flex h-full items-center justify-center'>
            <CardContent className='flex gap-4 text-primary'>
              <PlusCircleIcon /> {t('Actions.create_new_button_label')}
            </CardContent>
          </Card>
        </CourseContentDialog>
        {contents.map((content) => (
          <Card key={content.categoryId} className='max-h-72'>
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
                    {t('Actions.delete_course_button_label')}
                  </Button>
                </ConfirmationDialog>
              </CardAction>
            </CardHeader>
            <CardContent className='pointer-events-none flex h-full px-4.5 **:[div]:[[role=presentation]]:max-h-42 **:[div]:[[role=presentation]]:min-h-auto **:[div]:[[role=presentation]]:border-ring-subtle **:[div]:[[role=presentation]]:p-2.5 **:[div]:[[role=presentation]]:text-xs'>
              <RichTextEditor defaultContent={content.content} readOnly />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
