'use client'

import '@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss'
import '@/components/tiptap-node/list-node/list-node.scss'
import '@/components/tiptap-node/heading-node/heading-node.scss'
import '@/components/tiptap-node/paragraph-node/paragraph-node.scss'
// --- Styles ---
import { useEffect, useState } from 'react'
import { Highlight } from '@tiptap/extension-highlight'
import { TaskItem, TaskList } from '@tiptap/extension-list'
import { TextAlign } from '@tiptap/extension-text-align'
import { Typography } from '@tiptap/extension-typography'
import { Selection } from '@tiptap/extensions'
import { Content, EditorContent, EditorContext, Extension, Extensions, useEditor } from '@tiptap/react'
// --- Tiptap Core Extensions ---
import { StarterKit } from '@tiptap/starter-kit'
// --- Components ---
// --- Icons ---
import { ArrowLeftIcon } from '@/components/tiptap-icons/arrow-left-icon'
import { HighlighterIcon } from '@/components/tiptap-icons/highlighter-icon'
// --- Tiptap Node ---
import { ColorHighlightPopover, ColorHighlightPopoverButton, ColorHighlightPopoverContent } from '@/components/tiptap-ui/color-highlight-popover'
// --- Tiptap UI ---
import { HeadingDropdownMenu } from '@/components/tiptap-ui/heading-dropdown-menu'
import { ListDropdownMenu } from '@/components/tiptap-ui/list-dropdown-menu'
import { MarkButton } from '@/components/tiptap-ui/mark-button'
import { TextAlignButton } from '@/components/tiptap-ui/text-align-button'
import { UndoRedoButton } from '@/components/tiptap-ui/undo-redo-button'
// --- UI Primitives ---
import { Spacer } from '@/components/tiptap-ui-primitive/spacer'
import { Toolbar, ToolbarGroup, ToolbarSeparator } from '@/components/tiptap-ui-primitive/toolbar'
// --- Hooks ---
import { Button as ShadcnButton } from '@/src/components/shadcn/button'
import { HorizontalRule } from '@/src/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension'
import { TextAlignmentMenu } from '@/src/components/tiptap-ui/text-alignment-menu/TextAlignmentMenu'
import { Button } from '@/src/components/tiptap-ui-primitive/button'
import { useIsBreakpoint } from '@/src/hooks/use-is-breakpoint'
import { useScopedI18n } from '@/src/i18n/client-localization'
import { cn } from '@/src/lib/Shared/utils'

function MainToolbarContent({ onHighlighterClick, isMobile, onFontClick }: { onFontClick: () => void; onHighlighterClick: () => void; isMobile: boolean }) {
  const t = useScopedI18n('Components.RichTextEditor.Toolbar')
  return (
    <>
      <Spacer />

      <ToolbarGroup>
        <UndoRedoButton action='undo' />
        <UndoRedoButton action='redo' />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu modal levels={[1, 2, 3, 4]} />
        <ListDropdownMenu modal types={['bulletList', 'orderedList', 'taskList']} />
      </ToolbarGroup>

      <ToolbarSeparator />

      <Button tooltip={t('FontOptions.trigger_tooltip_label')} variant={'ghost'} onClick={onFontClick} className='@[30rem]/editor:hidden!'>
        A
      </Button>

      <ToolbarGroup className='hidden! @[30rem]/editor:flex!'>
        <MarkButton type='bold' />
        <MarkButton type='italic' />
        <MarkButton type='strike' />
        <MarkButton type='code' />
        <MarkButton type='underline' />
        {!isMobile ? <ColorHighlightPopover /> : <ColorHighlightPopoverButton onClick={onHighlighterClick} />}
      </ToolbarGroup>

      <ToolbarSeparator />

      <TextAlignmentMenu options={['left', 'center', 'right']} className='@[34rem]/editor:hidden!' />
      <ToolbarGroup className='hidden! @[34rem]/editor:flex!'>
        <TextAlignButton align='left' />
        <TextAlignButton align='center' />
        <TextAlignButton align='right' />
      </ToolbarGroup>

      <Spacer />
    </>
  )
}

const FontMobileSubMenuContent = ({ onHighlighterClick }: { onHighlighterClick: () => void }) => {
  return (
    <>
      <MarkButton type='bold' />
      <MarkButton type='italic' />
      <MarkButton type='strike' />
      <MarkButton type='code' />
      <MarkButton type='underline' />
      {<ColorHighlightPopoverButton onClick={onHighlighterClick} />}
    </>
  )
}

const MobileToolbarContent = ({ type, onBack, onHighlighterClick }: { type: SubmenuKey; onBack: () => void; onHighlighterClick: () => void }) => (
  <>
    <Spacer />
    <ToolbarGroup>
      <ShadcnButton variant='ghost' onClick={onBack}>
        <ArrowLeftIcon className='tiptap-button-icon' />

        {type === 'highlighter' && <HighlighterIcon className='tiptap-button-icon' />}
        {type === 'font' && <>A</>}
      </ShadcnButton>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === 'highlighter' && <ColorHighlightPopoverContent />}
    {type === 'font' && <FontMobileSubMenuContent onHighlighterClick={onHighlighterClick} />}
    <Spacer />
  </>
)

type SubmenuKey = 'main' | 'highlighter' | 'font'

export const RichTextEditorExtensions: Extensions = [
  StarterKit.configure({ horizontalRule: false }) as Extension,
  HorizontalRule,
  TextAlign.configure({ types: ['heading', 'paragraph'] }),
  TaskList,
  TaskItem.configure({ nested: true }),
  Highlight.configure({ multicolor: true }),
  Typography,
  Selection,
]

export function RichTextEditor({
  onUpdateAction,
  defaultContent,
  disabled,
  readOnly,
  size = 'md',
  editorPaneClassname,
}: {
  onUpdateAction?: (content: object) => void
  defaultContent?: Content
  disabled?: boolean
  readOnly?: boolean
  size?: 'sm' | 'md' | 'lg'
  editorPaneClassname?: string
}) {
  const t = useScopedI18n('Components.RichTextEditor')
  const isMobile = useIsBreakpoint()
  const [mobileView, setMobileView] = useState<SubmenuKey>('main')

  const editor = useEditor(
    {
      immediatelyRender: false,
      editable: !(readOnly || disabled),

      editorProps: {
        attributes: {
          'autofocus': 'on',
          'autocomplete': 'off',
          'autocorrect': 'off',
          'autocapitalize': 'off',
          'aria-label': t('Content.input_aria_label'),
          'class': 'simple-editor',
          ...(size ? { 'data-size': size } : {}),
        },
      },
      extensions: RichTextEditorExtensions,
      onUpdate: ({ editor }) => onUpdateAction?.(editor.getJSON()),
      content: defaultContent,
    },
    [readOnly, disabled, size, defaultContent],
  )

  useEffect(() => {
    if (!isMobile && mobileView !== 'main') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMobileView('main')
    }
  }, [isMobile, mobileView])

  return (
    <div data-slot='rich-text-editor-wrapper' className='flex flex-1 flex-col items-center'>
      <div data-slot='rich-text-editor-container' className='@container/editor flex size-full max-h-[58dvh] flex-col'>
        <EditorContext.Provider value={{ editor }}>
          <Toolbar className={cn(readOnly && 'hidden!')}>
            {mobileView === 'main' ? (
              <MainToolbarContent onFontClick={() => setMobileView('font')} onHighlighterClick={() => setMobileView('highlighter')} isMobile={isMobile} />
            ) : (
              <MobileToolbarContent type={mobileView} onBack={() => setMobileView('main')} onHighlighterClick={() => setMobileView('highlighter')} />
            )}
          </Toolbar>

          <EditorContent
            onClick={(e) => {
              // Only focus at end if clicking outside the actual content area
              if (e.target === e.currentTarget && editor) {
                editor.commands.focus('end')
              }
            }}
            editor={editor}
            role='presentation'
            className={cn('rounded-md border border-input-ring', 'flex flex-1 flex-col', 'min-h-72 p-5', 'cursor-text overflow-auto', editorPaneClassname)}
          />
        </EditorContext.Provider>
      </div>
    </div>
  )
}
