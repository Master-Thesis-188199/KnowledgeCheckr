'use client'

import { useContentContext } from '@/src/components/courses/contents/[courseId]/ContentProvider'
import { RichTextEditor } from '@/src/components/tiptap-examples/RichTextEditor'
import { cn } from '@/src/lib/Shared/utils'

export function ContentRenderer() {
  const { contents, currentContentIndex } = useContentContext()

  return <RichTextEditor readOnly defaultContent={contents.at(currentContentIndex)?.content} editorPaneClassname={cn('border-dashed p-4')} editorContainerClassname='max-h-[62dvh]' />
}
