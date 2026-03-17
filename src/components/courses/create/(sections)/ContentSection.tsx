'use client'

import { useCourseStore } from '@/src/components/courses/create/CreateCourseProvider'
import { SimpleEditor } from '@/src/components/tiptap-examples/simple-editor'
import { Any } from '@/types'

export default function ContentSection() {
  const { contents, updateContent } = useCourseStore((store) => store)
  const dummyCategoryId = 'dummyId'

  return (
    <div className='flex flex-1 flex-col gap-6'>
      <div className='flex flex-col gap-1'>
        <h2 className='h-fit text-xl font-semibold'>Add course contents</h2>
        <span className='text-muted-foreground'>
          Create your new contents for this course. These contents can be used by users to increase their knowledge and to understand why questions were incorrectly answered.
        </span>
      </div>

      <SimpleEditor
        defaultContent={contents.find((c) => c.categoryId === dummyCategoryId)?.content}
        onUpdateAction={(content) => {
          updateContent(dummyCategoryId, content as Any)
        }}
      />
    </div>
  )
}
