'use client'

import { useState } from 'react'
import { CheckIcon, ChevronRightIcon } from 'lucide-react'
import { QuestionScoresLineChart } from '@/src/components/charts/QuestionScoresLineChart'
import { PreviewQuestionResult_QuestionItem } from '@/src/components/checks/[share_token]/results/ExamQuestionResultTable'
import { Button } from '@/src/components/shadcn/button'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/src/components/shadcn/drawer'
import { Label } from '@/src/components/shadcn/label'
import { Slider } from '@/src/components/shadcn/slider'
import { useIsMobile } from '@/src/hooks/use-mobile'

export default function ShowAnswerDrawer_TableCell({ item, children }: { item: PreviewQuestionResult_QuestionItem; children: React.ReactNode }) {
  const isMobile = useIsMobile()
  const [slideValue, setSliderValue] = useState([item.score])

  return (
    <Drawer direction={isMobile ? 'bottom' : 'right'}>
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
          <DrawerTitle className='capitalize'>Preview user question answer</DrawerTitle>
          <DrawerDescription>Viewing question {item.position} of the users respective examination attempt.</DrawerDescription>
        </DrawerHeader>
        <div className='flex flex-1 flex-col gap-4 overflow-y-auto px-4 text-sm'>
          <QuestionScoresLineChart className='h-[175px]' />
          <form className='mt-4 flex flex-col gap-10'>
            <div className='col-span-2 flex flex-2 flex-col gap-2'>
              <Label htmlFor='question' className='text-xs text-muted-foreground capitalize'>
                {item.type.replace('-', ' ')} Question
              </Label>
              <h2 className='text-base/6 font-medium tracking-wide'>{item.questionText}</h2>
            </div>

            <div className='flex justify-between gap-6'>
              <div className='flex flex-2 flex-col gap-3'>
                <div className='flex items-center justify-between'>
                  <Label htmlFor='slider'>Question Score</Label>
                  <span className='text-sm text-muted-foreground'>{slideValue[0]} points</span>
                </div>
                <Slider id='slider' max={item.points} min={0} onValueChange={setSliderValue} onPointerDown={(e) => e.stopPropagation()} value={slideValue} />
                <div className='flex items-center justify-between text-xs text-muted-foreground'>
                  <span>0 points</span>
                  <span>{item.points} points</span>
                </div>
              </div>
              <div className='flex-1' />
            </div>

            <div className='flex flex-col gap-3'>
              <Label htmlFor='answers'>Answers</Label>
              <div className='grid-container mx-3 [--grid-column-count:2] [--grid-desired-gap-x:36px] [--grid-desired-gap:24px] [--grid-item-min-width:80px]'>
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className='relative flex h-10 w-full items-center justify-center rounded-md bg-neutral-200 dark:bg-neutral-700'>
                    {(i === 0 || i === 3) && <CheckIcon className='absolute top-0.5 right-0.5 size-3.5' />}
                    Answer {i + 1}
                  </div>
                ))}
              </div>
            </div>
          </form>
        </div>
        <DrawerFooter className='grid grid-cols-2 gap-12'>
          <DrawerClose asChild>
            <Button className='' variant='outline'>
              Close
            </Button>
          </DrawerClose>

          <DrawerClose asChild>
            <Button className=''>Save Changes</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
