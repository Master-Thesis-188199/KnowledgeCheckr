'use client'
import { useMemo } from 'react'
import { BookTextIcon } from 'lucide-react'
import { useContentContext } from '@/src/components/courses/contents/[courseId]/ContentProvider'
import { Button } from '@/src/components/shadcn/button'
import { cn } from '@/src/lib/Shared/utils'
import { Course } from '@/src/schemas/CourseSchema'

/**
 * Used to switch between available contents. Shows the title of a given content as the button-label in combination with an icon.
 */
export function ContentSwitchButton({ content }: { content: Course['contents'][number] }) {
  const { contents, currentContentIndex, setCurrentIndex } = useContentContext()
  const index = useMemo(() => contents.findIndex((c) => c.categoryId === content.categoryId), [content, contents])

  return (
    <Button
      disabled={index === -1} // index retrieval was unsuccesful -> switching not possible
      variant='link'
      className={cn('w-fit text-ellipsis', index === currentContentIndex ? 'text-primary underline' : 'text-muted-foreground')}
      onClick={() => setCurrentIndex(index)}>
      <BookTextIcon />
      {content.title}
    </Button>
  )
}
