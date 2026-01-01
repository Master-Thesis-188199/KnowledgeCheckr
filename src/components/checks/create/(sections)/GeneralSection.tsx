'use client'

import { ComponentType, InputHTMLAttributes } from 'react'
import { Textarea } from '@headlessui/react'
import { twMerge } from 'tailwind-merge'
import { useCheckStore } from '@/src/components/checks/create/CreateCheckProvider'
import Card from '@/src/components/Shared/Card'
import Input from '@/src/components/Shared/form/Input'
import { cn } from '@/src/lib/Shared/utils'

export default function GeneralSection() {
  const { setName, setDescription, name, description, closeDate } = useCheckStore((state) => state)

  return (
    <Card className='@container flex flex-col gap-8 p-3' disableInteractions>
      <div className='header -m-3 flex flex-col rounded-t-md border-b border-neutral-400 bg-neutral-300 p-2 px-3 text-neutral-600 dark:border-neutral-500 dark:bg-neutral-700/60 dark:text-neutral-300'>
        <div className='flex items-center justify-between'>
          <h2 className=''>General Information</h2>
        </div>
      </div>
      <div
        className={cn(
          // prettier-ignore
          'grid items-center p-2',
          'grid-cols-1 gap-3 *:odd:mt-6 *:odd:first:mt-0',
          '@md:grid-cols-[auto_1fr] @md:gap-9 @md:gap-x-7 @md:*:odd:mt-0',
        )}>
        <InputGroup defaultValue={name} onChange={(e) => setName(e.target.value)} name='check-name' label='Name' placeholder='Enter the name of your knowledge check' />
        <InputGroup
          defaultValue={description || ''}
          onChange={(e) => setDescription(e.target.value)}
          label='Description'
          className='min-h-20 resize-none'
          as={Textarea}
          name='check-description'
          placeholder='Describe the concept of your knowledge check using a few words.'
        />
        <InputGroup
          label='Deadline'
          type='date'
          name='check-close-date'
          // eslint-disable-next-line react-hooks/purity
          defaultValue={new Date(closeDate ?? Date.now())
            .toLocaleDateString('de')
            .split('.')
            .reverse()
            .map((el) => (el.length < 2 ? '0' + el : el))
            .join('-')}
          className='text-sm text-neutral-500 dark:text-neutral-400 [&::-webkit-calendar-picker-indicator]:brightness-50'
        />
        <InputGroup label='Administrators' name='check-contributors' />
      </div>
    </Card>
  )
}

export function InputGroup<E extends ComponentType>({ label, as, ...props }: { label: string; as?: E } & InputHTMLAttributes<HTMLInputElement>) {
  const Element = as || Input

  return (
    <>
      <label className='text-neutral-600 dark:text-neutral-400'>{label}</label>
      <Element
        placeholder='Enter some text'
        {...props}
        className={twMerge(
          'focus:ring-ring-focus dark:focus:ring-ring-focus hover:ring-ring-hover dark:hover:ring-ring-hover rounded-md px-3 py-1.5 text-neutral-600 ring-1 ring-neutral-400 outline-none placeholder:text-neutral-400/90 hover:cursor-text focus:ring-[1.2px] dark:text-neutral-300/80 dark:ring-neutral-500 dark:placeholder:text-neutral-400/50',
          props.className,
        )}
      />
    </>
  )
}
