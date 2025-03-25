import PageHeading from '@/components/Shared/PageHeading'
import React, { ElementType, InputHTMLAttributes } from 'react'
import Card from '@/components/Shared/Card'
import { twMerge } from 'tailwind-merge'
import { Info } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/Shared/Popover'
import { Close } from '@radix-ui/react-popover'
import { cn } from '@/lib/Shared/utils'
import { DynamicIcon, IconName } from 'lucide-react/dynamic'

export default async function CreateCheckPage() {
  return (
    <div>
      <PageHeading title='Create KnowledgeCheck' />
      <div className='columns-xl gap-12 space-y-12'>
        <Card className='@container flex flex-col gap-8 p-3' disableHoverStyles>
          <div className='header -m-3 flex flex-col rounded-t-md border-b border-neutral-400 bg-neutral-300 p-2 px-3 text-neutral-600 dark:border-neutral-500 dark:bg-neutral-700/60 dark:text-neutral-300'>
            <div className='flex items-center justify-between'>
              <h2 className=''>General Information</h2>
            </div>
          </div>
          <div className='grid grid-cols-[auto_1fr] items-center gap-9 gap-x-7 p-2'>
            <InputGroup label='Name' placeholder='Enter the name of your knowledge check' />
            <InputGroup label='Description' className='min-h-20 resize-none' as='textarea' placeholder='Describe the concept of your knowledge check using a few words.' />
            <InputGroup
              label='Deadline'
              type='date'
              defaultValue={new Date(Date.now())
                .toLocaleDateString('de')
                .split('.')
                .reverse()
                .map((el) => (el.length < 2 ? '0' + el : el))
                .join('-')}
              className='text-sm text-neutral-500 dark:text-neutral-400'
            />
            <InputGroup label='Administrators' />
          </div>
        </Card>
        <Card disableHoverStyles className='break-inside-avoid'>
          <h2 className='text-lg'>Settings</h2>
          <div className='h-[500px]'></div>
        </Card>
        <Card disableHoverStyles className='break-inside-avoid'>
          <div className='header -m-3 mb-0 flex flex-col rounded-t-md border-b border-neutral-400 bg-neutral-300 p-2 px-3 text-neutral-600 dark:border-neutral-500 dark:bg-neutral-700/60 dark:text-neutral-300'>
            <div className='flex items-center justify-between'>
              <h2 className=''>Questions</h2>
            </div>
          </div>
          <div className='questions'>
            <div className='if-no-questions-show-empty-container my-20 flex flex-col items-center justify-center gap-6'>
              <Info className='size-16 text-neutral-400 dark:text-neutral-500' />
              <span className='tracking-wide text-neutral-500 dark:text-neutral-400'>Currently there are no questions associated to this quiz</span>
            </div>
          </div>
          <div className='flex justify-center gap-8'>
            <Popover>
              <PopoverTrigger className='mx-4 w-72 rounded-md border-2 border-dashed border-blue-500/70 p-3 tracking-wider hover:cursor-pointer dark:border-neutral-300/70 dark:text-neutral-300 dark:hover:bg-neutral-500/30'>
                Add Question
              </PopoverTrigger>

              <PopoverContent side='bottom' sideOffset={20} className='border-0 p-0 dark:bg-neutral-900'>
                <div className='rounded-md border border-neutral-400/40 bg-neutral-200 p-3.5 shadow-md shadow-neutral-300 dark:border-neutral-600 dark:bg-neutral-700/50 dark:text-neutral-200 dark:shadow-neutral-900'>
                  <ul className='space-y-4'>
                    <QuestionPopoverOption text='Single Choice Question' icon='mouse-pointer' />
                    <QuestionPopoverOption text='Multiple Choice Question' icon='list' />
                    <QuestionPopoverOption text='Open Answer Question' icon='type' />
                    <QuestionPopoverOption text='Drag Drop Question' icon='square-dashed-mouse-pointer' />
                  </ul>
                </div>
              </PopoverContent>
            </Popover>
          </div>
        </Card>
        <Card className='h-60 break-inside-avoid' children={<></>} disableHoverStyles></Card>
      </div>
    </div>
  )
}

function InputGroup<E extends ElementType>({ label, as, ...props }: { label: string; as?: E } & InputHTMLAttributes<HTMLInputElement>) {
  const Element = as || 'input'

  return (
    <>
      <label className='text-neutral-600 dark:text-neutral-400'>{label}</label>
      <Element
        placeholder='Enter some text'
        {...props}
        className={twMerge(
          'rounded-md px-3 py-1.5 text-neutral-600 ring-1 ring-neutral-400 outline-none placeholder:text-neutral-400/90 hover:cursor-text hover:ring-neutral-500 focus:ring-[1.2px] focus:ring-neutral-700 dark:text-neutral-300/80 dark:ring-neutral-500 dark:placeholder:text-neutral-400/50 dark:hover:ring-neutral-300/60 dark:focus:ring-neutral-300/80',
          props.className,
        )}
      />
    </>
  )
}

function QuestionPopoverOption({ icon, text }: { text: string; icon: IconName }) {
  return (
    <li>
      <Close
        className={cn(
          'flex w-full items-center gap-4 rounded-md p-2 px-3 hover:cursor-pointer hover:ring-[1.5px]',
          'bg-neutral-300/60 ring-neutral-400/70',
          'ring-1 dark:bg-neutral-800/60 dark:text-neutral-200/80 dark:ring-neutral-600/80 dark:hover:bg-neutral-800/80 dark:hover:text-neutral-200 dark:hover:ring-neutral-500/90',
        )}>
        <DynamicIcon name={icon} className='size-4' />
        {text}
      </Close>
    </li>
  )
}
