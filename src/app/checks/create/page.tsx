import PageHeading from '@/components/Shared/PageHeading'
import { ElementType, InputHTMLAttributes } from 'react'
import Card from '@/components/Shared/Card'
import { twMerge } from 'tailwind-merge'

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
        <Card disableHoverStyles className='h-[700px] break-inside-avoid'>
          <h2 className='text-lg'>Questions</h2>
          <div className='flex justify-center gap-6'>
            {/*<button className='rounded-md px-3 py-1.5 dark:bg-blue-500/40'>Create</button>*/}
            {/*<button className='rounded-md px-3 py-1.5 dark:bg-blue-500/40'>Create</button>*/}
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
          'rounded-md px-3 py-1.5 text-neutral-600 ring-1 ring-neutral-400 outline-none hover:cursor-text hover:ring-neutral-500 focus:ring-[1.2px] focus:ring-neutral-700 dark:text-neutral-400 dark:ring-neutral-500 dark:hover:ring-neutral-300/60 dark:focus:ring-neutral-300/80',
          props.className,
        )}
      />
    </>
  )
}
