'use client'

import { PenIcon, PlusCircleIcon, TrashIcon } from 'lucide-react'
import CourseContentDialog from '@/src/components/courses/create/(sections)/CourseContentDialog'
import { useCourseStore } from '@/src/components/courses/create/CreateCourseProvider'
import { Button } from '@/src/components/shadcn/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/shadcn/card'
import ConfirmationDialog from '@/src/components/Shared/ConfirmationDialog/ConfirmationDialog'
import { SimpleEditor } from '@/src/components/tiptap-examples/simple-editor'

export default function ContentSection() {
  const { contents, removeCourseContent } = useCourseStore((store) => store)

  return (
    <div className='flex flex-1 flex-col gap-10'>
      <div className='flex flex-col gap-1'>
        <h2 className='h-fit text-xl font-semibold'>Course Contents</h2>
        <span className='text-muted-foreground'>
          Create your new contents for this course. These contents can be used by users to increase their knowledge and to understand why questions were incorrectly answered.
        </span>
      </div>

      <div className='grid grid-cols-[repeat(auto-fill,minmax(380px,1fr))] gap-12'>
        <CourseContentDialog mode='create'>
          <Card className='flex h-full items-center justify-center'>
            <CardContent className='flex gap-4 text-primary'>
              <PlusCircleIcon /> Create new Content
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
                  <Button variant='link' asChild aria-label='edit course content' className='enabled:text-orange-400 dark:enabled:text-orange-300/80'>
                    <PenIcon />
                    Edit
                  </Button>
                </CourseContentDialog>

                <ConfirmationDialog
                  confirmAction={() => removeCourseContent(content.categoryId)}
                  confirmLabel='Delete Content'
                  body='This action cannot be undone. This will permanently delete this course conent from this course and remove its data from our servers.'>
                  <Button variant='link' asChild aria-label='edit course content' className='enabled:text-destructive/80'>
                    <TrashIcon />
                    Remove
                  </Button>
                </ConfirmationDialog>
              </CardAction>
            </CardHeader>
            <CardContent className='pointer-events-none flex h-full px-4.5 **:[div]:[[role=presentation]]:max-h-42 **:[div]:[[role=presentation]]:min-h-auto **:[div]:[[role=presentation]]:border-ring-subtle **:[div]:[[role=presentation]]:p-2.5 **:[div]:[[role=presentation]]:text-xs'>
              <SimpleEditor defaultContent={content.content} readOnly />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
