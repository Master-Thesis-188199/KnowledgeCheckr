import { useCallback, useEffect, useMemo, useState } from 'react'
import { cn } from '@heroui/theme'
import { useIsFirstRender } from '@uidotdev/usehooks'
import z from 'zod'
import { useCourseStore } from '@/src/components/courses/create/CreateCourseProvider'
import { Button } from '@/src/components/shadcn/button'
import { Label } from '@/src/components/shadcn/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/src/components/Shared/Dialog'
import Field from '@/src/components/Shared/form/Field'
import FormFieldError from '@/src/components/Shared/form/FormFieldError'
import Select from '@/src/components/Shared/form/Select'
import { RichTextEditor } from '@/src/components/tiptap-examples/RichTextEditor'
import { RHFProvider } from '@/src/hooks/Shared/form/react-hook-form/RHFProvider'
import useRHF from '@/src/hooks/Shared/form/useRHF'
import { useScopedI18n } from '@/src/i18n/client-localization'
import { getUUID } from '@/src/lib/Shared/getUUID'
import lorem from '@/src/lib/Shared/Lorem'
import { CategorySchema } from '@/src/schemas/CategorySchema'
import { CourseContent, CourseContentSchema, instantiateCourseContent } from '@/src/schemas/CourseContentSchema'

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

export default function CourseContentDialog({ children }: CreateContentDialogProps): React.ReactNode
export default function CourseContentDialog({ children }: EditContentDialogProps): React.ReactNode
export default function CourseContentDialog({ children, ...rest }: ContentDialogProps) {
  const t = useScopedI18n('Courses.Create.ContentSection.CourseContentDialog')
  const isFirstRender = useIsFirstRender()
  const [dialogOpen, setDialogOpen] = useState(false)
  const { storeCourseContent, questionCategories, contents, addCategory } = useCourseStore((store) => store)
  // allows users to re-select the category of the content they are currently editing, even though a content is also associated to this category.
  const currentCategoryId = rest.mode === 'edit' ? rest.courseContent.categoryId : undefined

  const categories = useMemo(
    () => questionCategories.filter((category) => category.id === currentCategoryId || !contents.some((existingContents) => existingContents.categoryId === category.id)),
    [questionCategories, contents, currentCategoryId],
  )

  const RHF = useRHF(CourseContentSchema, {
    mode: 'all',
    defaultValues: (_, instantiations) => {
      if (rest.mode === 'edit') return { ...instantiations, description: lorem().split(' ').slice(0, 10).join(' '), ...rest.courseContent }

      return { ...instantiations, description: lorem().split(' ').slice(0, 10).join(' ') }
    },
  })
  const {
    baseFieldProps,
    form: {
      formState: { errors },
      setValue,
      ...form
    },
  } = RHF

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

  const submitHandler = useCallback(
    (data: z.output<typeof CourseContentSchema>) => {
      storeCourseContent(data)
      setDialogOpen(false)
      form.reset()
    },
    [storeCourseContent, setDialogOpen, form.reset, form],
  )

  const createCategory = useCallback(
    (name: string) => {
      const newCategory: CategorySchema = { id: getUUID(), name, prequisiteCategoryId: null, skipOnMissingPrequisite: false }

      addCategory(newCategory)
      setValue('categoryId', newCategory.id)
      return newCategory
    },
    [addCategory, setValue],
  )

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent className='sm:max-w-[70dvw]'>
        <DialogHeader className='border-b border-b-neutral-400/80 pb-3 text-left dark:border-b-neutral-500/80'>
          <DialogTitle>{rest.mode === 'create' ? t('title_create') : t('title_edit')}</DialogTitle>
        </DialogHeader>
        <RHFProvider {...RHF}>
          <form className='flex flex-col gap-6 p-2' onSubmit={form.handleSubmit(submitHandler)}>
            <div className='flex gap-8'>
              <div
                className={cn(
                  'grid flex-1',
                  'grid-cols-1 items-baseline justify-baseline gap-3 *:last:mb-0 *:odd:mt-3 *:odd:first:mt-0',
                  '@md:grid-cols-[auto_1fr] @md:gap-7 @md:gap-x-7 @md:*:last:mb-0 @md:*:odd:mt-0',
                )}>
                <Field {...baseFieldProps} name='title' label={t('Fields.title_label')} placeholder={t('Fields.title_placeholder')} />
              </div>
              <div
                className={cn(
                  'grid flex-1',
                  'grid-cols-1 items-baseline justify-baseline gap-3 *:last:mb-0 *:odd:mt-3 *:odd:first:mt-0',
                  '@md:grid-cols-[auto_1fr] @md:gap-7 @md:gap-x-7 @md:*:last:mb-0 @md:*:odd:mt-0',
                )}>
                <Field {...baseFieldProps} name='description' label={t('Fields.description_label')} placeholder={t('Fields.description_placeholder')} />
              </div>
            </div>

            <div className='flex flex-1 flex-col gap-3 *:w-full'>
              <Label className='px-1'>{t('Fields.categoryId_label')}</Label>
              <div className='flex flex-col gap-1'>
                <Select
                  selectTriggerClassname='-ml-0.5'
                  popoverContentClassname='auto-popover-content-width'
                  onSelect={({ value: categoryId }) => setValue('categoryId', categoryId, { shouldValidate: true })}
                  options={[...categories.map((cat) => ({ label: cat.name, value: cat.id }))]}
                  mode='create'
                  onCreate={(name) => {
                    console.log(`Oncreate has received: '${name}' as the new category-name`)
                    const cat = createCategory(name)
                    return { label: cat.name, value: cat.id }
                  }}
                  triggerPlaceholder={t('Fields.categoryId_trigger_placerholder')}
                  defaultValue={
                    rest.mode === 'edit'
                      ? {
                          label: questionCategories.find((c) => c.id === rest.courseContent.categoryId)?.name ?? 'unknown',
                          value: rest.courseContent.categoryId,
                        }
                      : undefined
                  }
                />
                <FormFieldError showIcon errors={errors} field='categoryId' />
              </div>
            </div>
            <RichTextEditor defaultContent={rest.mode === 'edit' ? rest.courseContent.content : undefined} onUpdateAction={(content) => setValue('content', content)} />
            <Button type='submit'>{rest.mode === 'create' ? t('submit_create_button_label') : t('submit_update_button_label')}</Button>
          </form>
        </RHFProvider>
      </DialogContent>
    </Dialog>
  )
}
