'use client'

import { PenIcon, PlusCircleIcon } from 'lucide-react'
import CourseContentDialog from '@/src/components/courses/create/(sections)/CourseContentDialog'
import { useCourseStore } from '@/src/components/courses/create/CreateCourseProvider'
import { Button } from '@/src/components/shadcn/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/shadcn/card'
import { SimpleEditor } from '@/src/components/tiptap-examples/simple-editor'

export default function ContentSection() {
  const { contents } = useCourseStore((store) => store)

  return (
    <div className='flex flex-1 flex-col gap-10'>
      <div className='flex flex-col gap-1'>
        <h2 className='h-fit text-xl font-semibold'>Course Contents</h2>
        <span className='text-muted-foreground'>
          Create your new contents for this course. These contents can be used by users to increase their knowledge and to understand why questions were incorrectly answered.
        </span>
      </div>

      <div className='grid grid-cols-2 gap-8'>
        <CourseContentDialog mode='create'>
          <Card className='flex h-full w-lg items-center justify-center'>
            <CardContent className='flex gap-4 text-primary'>
              <PlusCircleIcon /> Create new Content
            </CardContent>
          </Card>
        </CourseContentDialog>
        {contents.map((content) => (
          <Card key={content.categoryId} className='max-h-72 w-lg'>
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
              </CardAction>
            </CardHeader>
            <CardContent className='px-4.5 **:[div]:[[role=presentation]]:max-h-42 **:[div]:[[role=presentation]]:min-h-auto **:[div]:[[role=presentation]]:p-2.5 **:[div]:[[role=presentation]]:text-xs'>
              <SimpleEditor defaultContent={content.content} readOnly />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
