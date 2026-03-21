'use client'

import { useEffect, useMemo, useState } from 'react'
import { useIsFirstRender } from '@uidotdev/usehooks'
import { PenIcon, PlusCircleIcon } from 'lucide-react'
import z from 'zod'
import { useCourseStore } from '@/src/components/courses/create/CreateCourseProvider'
import { Button } from '@/src/components/shadcn/button'
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/shadcn/card'
import { Label } from '@/src/components/shadcn/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/src/components/Shared/Dialog'
import Field from '@/src/components/Shared/form/Field'
import Select from '@/src/components/Shared/form/Select'
import { SimpleEditor } from '@/src/components/tiptap-examples/simple-editor'
import { RHFProvider } from '@/src/hooks/Shared/form/react-hook-form/RHFProvider'
import useRHF from '@/src/hooks/Shared/form/useRHF'
import { getUUID } from '@/src/lib/Shared/getUUID'
import lorem from '@/src/lib/Shared/Lorem'
import { cn } from '@/src/lib/Shared/utils'
import { CategorySchema } from '@/src/schemas/CategorySchema'
import { CourseContent, CourseContentSchema, instantiateCourseContent } from '@/src/schemas/CourseContentSchema'

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
        <CreateNewContentDialog mode='create'>
          <Card className='flex h-full w-lg items-center justify-center'>
            <CardContent className='flex gap-4 text-primary'>
              <PlusCircleIcon /> Create new Content
            </CardContent>
          </Card>
        </CreateNewContentDialog>
        {contents.map((content) => (
          <Card key={content.categoryId} className='max-h-72 w-lg'>
            <CardHeader>
              <CardTitle>{content.title}</CardTitle>
              <CardDescription>{content.description}</CardDescription>
              <CardAction>
                <CreateNewContentDialog mode='edit' courseContent={content}>
                  <Button variant='link' asChild aria-label='edit course content' className='enabled:text-orange-400 dark:enabled:text-orange-300/80'>
                    <PenIcon />
                    Edit
                  </Button>
                </CreateNewContentDialog>
              </CardAction>
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

type BaseContentDialogProps = {
  children: React.ReactNode
}

type CreateContentDialogProps = BaseContentDialogProps & {
  mode: 'create'
}

type EditContentDialogProps = BaseContentDialogProps & {
  mode: 'edit'
  courseContent: CourseContent
}
type ContentDialogProps = CreateContentDialogProps | EditContentDialogProps

function CreateNewContentDialog({ children }: CreateContentDialogProps): React.ReactNode
function CreateNewContentDialog({ children }: EditContentDialogProps): React.ReactNode
function CreateNewContentDialog({ children, ...rest }: ContentDialogProps) {
  const isFirstRender = useIsFirstRender()
  const [dialogOpen, setDialogOpen] = useState(false)
  const { storeCourseContent, questionCategories, contents, addCategory } = useCourseStore((store) => store)
  const categories = useMemo(() => questionCategories.filter((category) => !contents.some((existingContents) => existingContents.categoryId === category.id)), [questionCategories, contents])

  const rhf = useRHF(CourseContentSchema, { mode: 'all', defaultValues: (_, instantiations) => ({ ...instantiations, description: lorem().split(' ').slice(0, 10).join(' ') }) })
  const {
    baseFieldProps,
    form: {
      formState: { isValid },
      setValue,
      ...form
    },
  } = rhf

  useEffect(() => {
    if (isFirstRender) return

    if (rest.mode === 'create') {
      console.debug(`Resetting content-dialog form with mode 'create'`)
      form.reset({ ...instantiateCourseContent(), description: lorem().split(' ').slice(0, 10).join(' ') })
    }
    // pre-fill "default-values" by ressetting form with edit-values
    else {
      console.debug(`Resetting content-dialog form with mode 'edit'`)
      form.reset(rest.courseContent)
      console.log(rest.courseContent.content)
    }
  }, [rest.mode, (rest as EditContentDialogProps).courseContent])

  function submitHandler(data: z.output<typeof CourseContentSchema>) {
    storeCourseContent(data)
    setDialogOpen(false)
    rhf.form.reset()
  }

  function createCategory(name: string) {
    const newCategory: CategorySchema = { id: getUUID(), name, prequisiteCategoryId: null, skipOnMissingPrequisite: false }

    addCategory(newCategory)
    setValue('categoryId', newCategory.id)
    return newCategory
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className='sm:max-w-[70dvw]'>
        <DialogHeader className='border-b border-b-neutral-400/80 pb-3 text-left dark:border-b-neutral-500/80'>
          <DialogTitle>{rest.mode === 'create' ? 'Create new' : 'Edit'} Content</DialogTitle>
        </DialogHeader>
        <RHFProvider {...rhf}>
          <form className='flex flex-col gap-6 p-2' onSubmit={rhf.form.handleSubmit(submitHandler)}>
            <div className='flex gap-8'>
              <div
                className={cn(
                  'grid flex-1',
                  'grid-cols-1 items-baseline justify-baseline gap-3 *:last:mb-0 *:odd:mt-3 *:odd:first:mt-0',
                  '@md:grid-cols-[auto_1fr] @md:gap-7 @md:gap-x-7 @md:*:last:mb-0 @md:*:odd:mt-0',
                )}>
                <Field {...baseFieldProps} name='title' placeholder='Basic History of Austria' />
              </div>
              <div
                className={cn(
                  'grid flex-1',
                  'grid-cols-1 items-baseline justify-baseline gap-3 *:last:mb-0 *:odd:mt-3 *:odd:first:mt-0',
                  '@md:grid-cols-[auto_1fr] @md:gap-7 @md:gap-x-7 @md:*:last:mb-0 @md:*:odd:mt-0',
                )}>
                <Field {...baseFieldProps} name='description' placeholder='Includes fundamental information about Austria.' />
              </div>
            </div>

            <div className='flex flex-1 flex-col gap-3 *:w-full'>
              <Label className='px-1'>Category</Label>
              <Select
                selectTriggerClassname='-ml-0.5'
                popoverContentClassname='auto-popover-content-width'
                onSelect={({ value: categoryId }) => setValue('categoryId', categoryId)}
                options={[...categories.map((cat) => ({ label: cat.name, value: cat.id }))]}
                mode='create'
                onCreate={(name) => {
                  console.log(`Oncreate has received: '${name}' as the new category-name`)
                  const cat = createCategory(name)
                  return { label: cat.name, value: cat.id }
                }}
                triggerPlaceholder='Select a category'
                defaultValue={
                  rest.mode === 'edit'
                    ? {
                        label: questionCategories.find((c) => c.id === rest.courseContent.categoryId)?.name ?? 'unknown',
                        value: rest.courseContent.categoryId,
                      }
                    : undefined
                }
              />
            </div>
            <SimpleEditor defaultContent={rest.mode === 'edit' ? rest.courseContent.content : undefined} onUpdateAction={(content) => setValue('content', content)} />
            <Button type='submit' disabled={!isValid}>
              Submit
            </Button>
          </form>
        </RHFProvider>
      </DialogContent>
    </Dialog>
  )
}
