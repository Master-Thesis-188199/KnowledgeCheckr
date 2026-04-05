'use client'

import { ChevronRightIcon } from 'lucide-react'
import { Button } from '@/src/components/shadcn/button'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/src/components/shadcn/drawer'
import { RichTextEditor } from '@/src/components/tiptap-examples/RichTextEditor'
import { useIsMobile } from '@/src/hooks/use-mobile'
import { useScopedI18n } from '@/src/i18n/client-localization'
import { CourseContent } from '@/src/schemas/CourseContentSchema'

export function PracticeContentDrawer({ children, content }: { children: React.ReactNode; content?: CourseContent }) {
  const isMobile = useIsMobile()
  const t = useScopedI18n('Shared')

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
          <DrawerTitle>{content?.title}</DrawerTitle>
          <DrawerDescription className='line-clamp-2'>{content?.description}</DrawerDescription>
        </DrawerHeader>
        <div className='flex flex-1 flex-col gap-4 overflow-y-auto px-4 text-sm'>
          <RichTextEditor defaultContent={content?.content} readOnly editorPaneClassname='max-h-[65dvh] lg:max-h-[75dvh] ' growth='fill' />
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button>{t('close_label')}</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
