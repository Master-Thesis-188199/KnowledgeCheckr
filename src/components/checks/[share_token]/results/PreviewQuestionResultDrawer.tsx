'use client'

import React, { Dispatch, SetStateAction, useState } from 'react'
import { ChevronRightIcon, UserCheckIcon, UserIcon } from 'lucide-react'
import { QuestionScoresLineChart } from '@/src/components/charts/QuestionScoresLineChart'
import { PreviewQuestionResult_QuestionItem } from '@/src/components/checks/[share_token]/results/ExamQuestionResultTable'
import { Button } from '@/src/components/shadcn/button'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/src/components/shadcn/drawer'
import { Input } from '@/src/components/shadcn/input'
import { Label } from '@/src/components/shadcn/label'
import { Slider } from '@/src/components/shadcn/slider'
import { Textarea } from '@/src/components/shadcn/textarea'
import { useIsMobile } from '@/src/hooks/use-mobile'
import { useScopedI18n } from '@/src/i18n/client-localization'
import { cn } from '@/src/lib/Shared/utils'
import { ChoiceQuestion, DragDropQuestion, OpenQuestion } from '@/src/schemas/QuestionSchema'
import { QuestionInput } from '@/src/schemas/UserQuestionInputSchema'

export default function ShowAnswerDrawer_TableCell({
  item,
  children,
  open,
  setOpenAction,
}: {
  item: PreviewQuestionResult_QuestionItem
  children?: React.ReactNode
  open?: boolean
  setOpenAction?: Dispatch<SetStateAction<boolean>>
}) {
  const tShared = useScopedI18n('Shared.Question')
  const t = useScopedI18n('Checks.ExaminatonResults.ShowAnswerDrawer_TableCell')
  const isMobile = useIsMobile()
  const [slideValue, setSliderValue] = useState([item.score])

  return (
    <Drawer direction={isMobile ? 'bottom' : 'right'} open={open} onOpenChange={setOpenAction}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent className='data-[vaul-drawer-direction=right]:*:data-close:flex'>
        <div data-close className='absolute inset-y-0 -left-2.5 hidden items-center'>
          <DrawerClose asChild>
            <Button variant='ghost' size='icon' className='size-4 bg-background text-neutral-600 hover:scale-115 dark:text-neutral-300'>
              <ChevronRightIcon className='' />
            </Button>
          </DrawerClose>
        </div>
        <DrawerHeader className='mb-6 gap-1 border-b'>
          <DrawerTitle className=''>{t('title')}</DrawerTitle>
          <DrawerDescription>{t('description')}</DrawerDescription>
        </DrawerHeader>
        <div className='flex flex-1 flex-col gap-4 overflow-y-auto px-4 text-sm'>
          <QuestionScoresLineChart className='h-[175px] min-h-[175px]' />
          <form className='mt-4 flex flex-col gap-10 pb-8'>
            <div className='col-span-2 flex flex-2 flex-col gap-2'>
              <Label htmlFor='question' className='text-xs text-muted-foreground capitalize'>
                {tShared(`type.${item.type}`).replace('-', ' ')} {tShared('question_label')}
              </Label>
              <h2 className='text-base/6 font-medium tracking-wide'>{item.questionText}</h2>
            </div>

            <div className='flex justify-center gap-10 px-2'>
              <div className='flex flex-1 flex-col gap-3'>
                <div className='flex items-center justify-between'>
                  <Label htmlFor='slider'>{t('score_slider_label')}</Label>
                  <span className='text-sm text-muted-foreground'>{tShared('points', { count: slideValue[0] })}</span>
                </div>
                <Slider id='slider' max={item.points} min={0} onValueChange={setSliderValue} onPointerDown={(e) => e.stopPropagation()} value={slideValue} />
                <div className='flex items-center justify-between text-xs text-muted-foreground'>
                  <span>{tShared('points', { count: 0 })}</span>
                  <span>{tShared('points', { count: item.points })}</span>
                </div>
              </div>

              <div className='flex flex-col gap-3'>
                <Label>{t('grade_label')}</Label>
                <Input
                  defaultValue={item.grade}
                  placeholder='N/A'
                  className='h-fit w-24 border-ring-subtle/70 bg-transparent px-0 py-1.5 text-center dark:border-ring-subtle/70 dark:bg-transparent [&::-webkit-inner-spin-button]:-translate-x-1 [&::-webkit-inner-spin-button]:scale-75'
                />
              </div>
            </div>

            <div className='flex flex-col gap-3'>
              <Label>{item.type !== 'open-question' ? t('answers_array_label') : t('answer_open_question_label')}</Label>
              <ShowQuestionAnswerResults item={item} />
            </div>
          </form>
        </div>
        <DrawerFooter className='grid grid-cols-2 gap-12'>
          <DrawerClose asChild>
            <Button className='' variant='outline'>
              {t('drawer_close_button_label')}
            </Button>
          </DrawerClose>

          <DrawerClose asChild>
            <Button className=''>{t('drawer_submit_button_label')}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}

function ShowQuestionAnswerResults({ item }: { item: PreviewQuestionResult_QuestionItem }) {
  const baseGridClasses = 'grid-container mx-3 pt-1 [--grid-desired-gap-x:36px] [--grid-desired-gap:24px] [--grid-item-min-width:80px]'
  switch (item.type) {
    case 'single-choice':
      return (
        <div className={cn(baseGridClasses, '[--grid-column-count:1] @lg:[--grid-column-count:2]')}>
          <ChoiceAnswerResults item={item} />
        </div>
      )
    case 'multiple-choice':
      return (
        <div className={cn(baseGridClasses, '[--grid-column-count:1] @lg:[--grid-column-count:2]')}>
          <ChoiceAnswerResults item={item} />
        </div>
      )
    case 'drag-drop':
      return (
        <div className={cn(baseGridClasses, '[--grid-column-count:1]')}>
          <DragDropAnswerResults item={item} />
        </div>
      )
    case 'open-question':
      return OpenQuestionAnswerResults({ item })
  }
}

function DragDropAnswerResults({ item: { rawQuestion, userInput } }: { item: PreviewQuestionResult_QuestionItem }) {
  const question = rawQuestion as DragDropQuestion
  const { answers } = question
  const { input } = (userInput as Extract<QuestionInput, { type: (typeof question)['type'] }> | undefined) ?? { input: undefined }

  const isCorrect = (answer: (typeof question)['answers'][number], positionIndex: number) => answers.findIndex((a) => a.id === answer.id) === positionIndex

  if (!input || input.length === 0)
    return answers.map((a) => (
      <AnswerResultLabel label={a.answer} key={a.id} className='col-span-2'>
        Nothing...
      </AnswerResultLabel>
    ))

  return answers.map((a) => {
    const userPosition = input.findIndex((id) => a.id === id)

    return (
      <AnswerResultLabel
        label={a.answer}
        key={a.id}
        className={cn(
          // eslint-disable-next-line require-color-modes/require-color-mode-styles
          isCorrect(a, userPosition) && 'text-muted-foreground opacity-85 ring-2 ring-green-600/50',
          !isCorrect(a, userPosition) && 'ring-[3px] ring-red-600/25 dark:ring-red-400/25',
        )}>
        <div className={cn('absolute top-0 bottom-0 left-3 flex h-full items-center gap-1 text-muted-foreground', !isCorrect(a, userPosition) ? 'font-semibold dark:text-red-400/80' : '')}>
          <UserIcon className='size-3.5' />
          <span>{input.findIndex((id) => a.id === id) + 1}.</span>
        </div>
      </AnswerResultLabel>
    )
  })
}

function ChoiceAnswerResults({ item: { rawQuestion, userInput } }: { item: PreviewQuestionResult_QuestionItem }) {
  const question = rawQuestion as ChoiceQuestion
  const { answers } = question
  const input = userInput as Extract<QuestionInput, { type: (typeof question)['type'] }> | undefined

  const isSelected = (answer: ChoiceQuestion['answers'][number]) => (question.type === 'single-choice' ? input?.selection === answer.id : input?.selection.includes(answer.id))

  return answers.map((a) => (
    <AnswerResultLabel
      label={a.answer}
      key={a.id}
      className={cn(
        '',
        isSelected(a) && 'border-2 border-neutral-400 bg-neutral-300/60 dark:border-ring-hover/30 dark:bg-neutral-600/60',
        a.correct && 'ring-[3px] ring-green-600/50',
        isSelected(a) && !a.correct && 'ring-[3px] ring-red-600/25 dark:ring-red-400/25',
        !isSelected(a) && 'text-muted-foreground opacity-75',
      )}>
      <div className='absolute top-0.5 right-0.5 flex items-center gap-2 *:[svg]:size-4'>
        <UserCheckIcon className={cn('hidden', isSelected(a) && 'block')} />
      </div>
    </AnswerResultLabel>
  ))
}

function OpenQuestionAnswerResults({ item: { rawQuestion, userInput } }: { item: PreviewQuestionResult_QuestionItem }) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const question = rawQuestion as OpenQuestion
  const input = userInput as Extract<QuestionInput, { type: (typeof question)['type'] }> | undefined

  return (
    <>
      <Textarea defaultValue={input?.input} readOnly />
    </>
  )
}
function AnswerResultLabel({ label, children, className }: { label: string; children?: React.ReactNode; className?: string }) {
  return (
    <div className={cn('relative flex h-10 w-full items-center justify-center rounded-md bg-neutral-200 dark:bg-neutral-700', className)}>
      {children}
      {label}
    </div>
  )
}
