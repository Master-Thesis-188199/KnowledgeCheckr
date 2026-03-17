'use client'

import { TextAlignJustifyIcon } from 'lucide-react'
import { ChevronDownIcon } from '@/components/tiptap-icons/chevron-down-icon'
import { Button } from '@/components/tiptap-ui-primitive/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from '@/src/components/shadcn/dropdown-menu'
import { TextAlignButton } from '@/src/components/tiptap-ui/text-align-button'

export function TextAlignmentMenu({ children, options, className }: { children?: React.ReactNode; options: Array<'left' | 'right' | 'center'>; className?: string }) {
  return (
    <DropdownMenu modal>
      <DropdownMenuTrigger asChild variant='ghost' className={className}>
        <Button type='button' variant='ghost' role='button' tabIndex={-1} aria-label='Format text alignment' tooltip='Alignment options' className={className}>
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
              <TextAlignButton align={alignment} text={`Align ${alignment}`} />
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
