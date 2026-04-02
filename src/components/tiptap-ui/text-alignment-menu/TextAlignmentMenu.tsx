'use client'

import { TextAlignJustifyIcon } from 'lucide-react'
import { ChevronDownIcon } from '@/components/tiptap-icons/chevron-down-icon'
import { Button } from '@/components/tiptap-ui-primitive/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/src/components/shadcn/dropdown-menu'
import { TextAlignButton } from '@/src/components/tiptap-ui/text-align-button'
import { useScopedI18n } from '@/src/i18n/client-localization'

export function TextAlignmentMenu({ children, options, className }: { children?: React.ReactNode; options: Array<'left' | 'right' | 'center'>; className?: string }) {
  const t = useScopedI18n('Components.RichTextEditor.Toolbar')

  return (
    <DropdownMenu modal>
      <DropdownMenuTrigger asChild variant='ghost' className={className}>
        <Button type='button' variant='ghost' role='button' tabIndex={-1} aria-label={t('Alignment.trigger_aria_label')} tooltip={t('Alignment.trigger_tooltip_label')} className={className}>
          {children ? (
            children
          ) : (
            <>
              <TextAlignJustifyIcon className='tiptap-button-icon' />
              <ChevronDownIcon className='tiptap-button-dropdown-small' />
            </>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align='start' className='rounded-xl' variant='ghost'>
        <DropdownMenuGroup>
          {options.map((alignment) => (
            <DropdownMenuItem key={`text-alignment-${alignment}`} asChild>
              <TextAlignButton align={alignment} text={t(`Alignment.${alignment}_label`)} />
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
