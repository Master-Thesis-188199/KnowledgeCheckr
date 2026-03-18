'use client'

import { useState } from 'react'
import { Content } from '@tiptap/react'
import { PlusCircleIcon } from 'lucide-react'
import z from 'zod'
import { useCourseStore } from '@/src/components/courses/create/CreateCourseProvider'
import { Button } from '@/src/components/shadcn/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/shadcn/card'
import { Combobox, ComboboxContent, ComboboxEmpty, ComboboxInput, ComboboxItem, ComboboxList } from '@/src/components/shadcn/combobox'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/src/components/Shared/Dialog'
import Field from '@/src/components/Shared/form/Field'
import { SimpleEditor } from '@/src/components/tiptap-examples/simple-editor'
import { RHFProvider } from '@/src/hooks/Shared/form/react-hook-form/RHFProvider'
import useRHF from '@/src/hooks/Shared/form/useRHF'
import { cn } from '@/src/lib/Shared/utils'
import { Any } from '@/types'

export default function ContentSection() {
  const { contents } = useCourseStore((store) => store)

  return (
    <div className='flex flex-1 flex-col gap-10'>
      <div className='flex flex-col gap-1'>
        <h2 className='h-fit text-xl font-semibold'>Course Contents</h2>
        <span className='text-muted-foreground'>
          Create your new contents for this course. These contents can be used by users to increase their knowledge and to understand why questions were incorrectly answered.
        </span>
      </div>

      <div className='grid grid-cols-2 gap-8'>
        <CreateNewContentDialog>
          <Card className='flex h-full w-lg items-center justify-center'>
            <CardContent className='flex gap-4 text-primary'>
              <PlusCircleIcon /> Create new Content
            </CardContent>
          </Card>
        </CreateNewContentDialog>
        {contents.map((content) => (
          <Card key={content.categoryId} className='max-h-72 w-lg'>
            <CardHeader>
              <CardTitle>Content title</CardTitle>
              <CardDescription>This is the content description for this content.</CardDescription>
            </CardHeader>
            <CardContent className='px-4.5 **:[div]:[[role=presentation]]:max-h-42 **:[div]:[[role=presentation]]:min-h-auto **:[div]:[[role=presentation]]:p-2.5 **:[div]:[[role=presentation]]:text-xs'>
              <SimpleEditor defaultContent={content.content} readOnly />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

const createContentSchema = z.object({
  title: z.string().nonempty(),
  categoryId: z.string().nonempty(),
  content: z.object(),
})

function CreateNewContentDialog({ children }: { children: React.ReactNode }) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [content, setContent] = useState<Content>()
  const { updateContent, questionCategories, contents } = useCourseStore((store) => store)

  const rhf = useRHF(createContentSchema, { mode: 'all', defaultValues: (_, instantiations) => ({ ...instantiations }) })
  const {
    baseFieldProps,
    form: {
      formState: { isValid },
      setValue,
      ...form
    },
  } = rhf

  function submitHandler(data: z.output<typeof createContentSchema>) {
    updateContent(data.categoryId, content! as Any)
    setDialogOpen(false)
    rhf.form.reset()
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger>{children}</DialogTrigger>

      <DialogContent className='sm:max-w-[70dvw]'>
        <DialogHeader className='border-b border-b-neutral-400/80 pb-3 text-left dark:border-b-neutral-500/80'>
          <DialogTitle>Create new Content</DialogTitle>
        </DialogHeader>
        <RHFProvider {...rhf}>
          <form className='flex flex-col gap-6' onSubmit={rhf.form.handleSubmit(submitHandler)}>
            <div
              className={cn(
                'grid p-2',
                'grid-cols-1 items-baseline justify-baseline gap-3 *:last:mb-0 *:odd:mt-3 *:odd:first:mt-0',
                '@md:grid-cols-[auto_1fr] @md:gap-7 @md:gap-x-7 @md:*:last:mb-0 @md:*:odd:mt-0',
                '-mb-4',
              )}>
              <Field {...baseFieldProps} name='title' />

              <Combobox
                items={questionCategories.filter((category) => !contents.some((existingContents) => existingContents.categoryId === category.id))}
                itemToStringLabel={(category: (typeof questionCategories)[number]) => category.name}
                onValueChange={(item) => setValue('categoryId', item?.id as Any, { shouldValidate: true })}>
                <ComboboxInput showClear placeholder='Select a category' />
                <ComboboxContent className='pointer-events-auto'>
                  <ComboboxEmpty>No category found.</ComboboxEmpty>
                  <ComboboxList>
                    {(item: (typeof questionCategories)[number]) => (
                      <ComboboxItem key={item.id} value={item}>
                        {item.name}
                      </ComboboxItem>
                    )}
                  </ComboboxList>
                </ComboboxContent>
              </Combobox>
            </div>
            <SimpleEditor onUpdateAction={setContent} />
            <Button type='submit' disabled={!isValid}>
              Submit
            </Button>
          </form>
        </RHFProvider>
      </DialogContent>
    </Dialog>
  )
}
