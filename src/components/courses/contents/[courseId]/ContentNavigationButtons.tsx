'use client'

import { useContentContext } from '@/src/components/courses/contents/[courseId]/ContentProvider'
import { Button } from '@/src/components/shadcn/button'

export function NextContentButton() {
  const { contents, currentContentIndex, setCurrentIndex } = useContentContext()

  if (contents.length <= currentContentIndex + 1) return <div />

  return (
    <Button onClick={() => setCurrentIndex((prev) => prev + 1)} variant='link'>
      Continue to {contents.at(currentContentIndex + 1)?.title}
    </Button>
  )
}

export function PreviousContentButton() {
  const { contents, currentContentIndex, setCurrentIndex } = useContentContext()

  if (currentContentIndex - 1 < 0) return <div />

  return (
    <Button onClick={() => setCurrentIndex((prev) => prev - 1)} variant='link'>
      Go back to {contents.at(currentContentIndex - 1)?.title}
    </Button>
  )
}
