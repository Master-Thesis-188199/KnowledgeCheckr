'use client'

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { useContentContext } from '@/src/components/courses/contents/[courseId]/ContentProvider'
import { Button } from '@/src/components/shadcn/button'
import { useScopedI18n } from '@/src/i18n/client-localization'

export function NextContentButton() {
  const t = useScopedI18n('Courses.Contents.Navigation')
  const { contents, currentContentIndex, setCurrentIndex } = useContentContext()

  if (contents.length <= currentContentIndex + 1) return <div />
  return (
    <Button onClick={() => setCurrentIndex((prev) => prev + 1)} variant='ghost' className='group flex h-fit max-w-56 flex-col gap-1'>
      <span className='self-start text-sm text-muted-foreground'>{t('next_btn_label')}</span>
      <div className='flex items-center gap-1 group-hover:text-primary group-hover:underline'>
        {contents.at(currentContentIndex + 1)?.title}
        <ChevronRightIcon className='transition-transform group-hover:scale-125' />
      </div>
    </Button>
  )
}

export function PreviousContentButton() {
  const t = useScopedI18n('Courses.Contents.Navigation')
  const { contents, currentContentIndex, setCurrentIndex } = useContentContext()

  if (currentContentIndex - 1 < 0) return <div />

  return (
    <Button onClick={() => setCurrentIndex((prev) => prev - 1)} variant='ghost' className='group flex h-fit max-w-56 flex-col gap-1'>
      <span className='self-end text-right text-sm text-muted-foreground'>{t('previous_btn_label')}</span>
      <div className='flex items-center gap-1 group-hover:text-primary group-hover:underline'>
        <ChevronLeftIcon className='transition-transform group-hover:scale-125' />
        {contents.at(currentContentIndex - 1)?.title}
      </div>
    </Button>
  )
}
