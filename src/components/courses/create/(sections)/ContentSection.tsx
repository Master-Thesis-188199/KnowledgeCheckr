'use client'

import { useMemo, useState } from 'react'
import { Content } from '@tiptap/react'
import { PlusCircleIcon } from 'lucide-react'
import z from 'zod'
import { useCourseStore } from '@/src/components/courses/create/CreateCourseProvider'
import { Button } from '@/src/components/shadcn/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/shadcn/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/src/components/Shared/Dialog'
import Field from '@/src/components/Shared/form/Field'
import Select from '@/src/components/Shared/form/Select'
import { SimpleEditor } from '@/src/components/tiptap-examples/simple-editor'
import { RHFProvider } from '@/src/hooks/Shared/form/react-hook-form/RHFProvider'
import useRHF from '@/src/hooks/Shared/form/useRHF'
import { getUUID } from '@/src/lib/Shared/getUUID'
import { cn } from '@/src/lib/Shared/utils'
import { CategorySchema } from '@/src/schemas/CategorySchema'
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
  const { updateContent, questionCategories, contents, addCategory } = useCourseStore((store) => store)
  const categories = useMemo(() => questionCategories.filter((category) => !contents.some((existingContents) => existingContents.categoryId === category.id)), [questionCategories, contents])

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

  function createCategory(name: string) {
    const newCategory: CategorySchema = { id: getUUID(), name, prequisiteCategoryId: null, skipOnMissingPrequisite: false }

    addCategory(newCategory)
    setValue('categoryId', newCategory.id)
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

              <Select
                selectTriggerClassname='-ml-0.5'
                popoverContentClassname='auto-popover-content-width'
                onChange={(category) => {
                  if (!categories.find((c) => c.name === category)) {
                    createCategory(category)
                  } else {
                    form.register('categoryId').onChange({ target: { value: category, name: 'categoryId' } })
                  }
                }}
                options={[...categories.map((cat) => ({ label: cat.name, value: cat.id }))]}
                createable
                // defaultValue={{ label: categories.find(c => c.id === form.watch("categoryId"))?.name, value: watch('category') }}
              />
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
