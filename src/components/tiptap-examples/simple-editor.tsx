'use client'

import '@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss'
import '@/components/tiptap-node/list-node/list-node.scss'
import '@/components/tiptap-node/heading-node/heading-node.scss'
import '@/components/tiptap-node/paragraph-node/paragraph-node.scss'
// --- Styles ---
import { useEffect, useRef, useState } from 'react'
import { Highlight } from '@tiptap/extension-highlight'
import { TaskItem, TaskList } from '@tiptap/extension-list'
import { TextAlign } from '@tiptap/extension-text-align'
import { Typography } from '@tiptap/extension-typography'
import { Selection } from '@tiptap/extensions'
import { EditorContent, EditorContext, useEditor } from '@tiptap/react'
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
import { cn } from '@/src/lib/Shared/utils'

const MainToolbarContent = ({ onHighlighterClick, isMobile, onFontClick }: { onFontClick: () => void; onHighlighterClick: () => void; isMobile: boolean }) => {
  return (
    <>
      <Spacer />

      <ToolbarGroup>
        <UndoRedoButton action='undo' />
        <UndoRedoButton action='redo' />
      </ToolbarGroup>

      <ToolbarSeparator />

      <ToolbarGroup>
        <HeadingDropdownMenu modal={false} levels={[1, 2, 3, 4]} />
        <ListDropdownMenu modal={false} types={['bulletList', 'orderedList', 'taskList']} />
      </ToolbarGroup>

      <ToolbarSeparator />

      <Button variant={'ghost'} onClick={onFontClick} className='@[30rem]/editor:hidden!'>
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

export function SimpleEditor() {
  const isMobile = useIsBreakpoint()
  const [mobileView, setMobileView] = useState<SubmenuKey>('main')
  const editorInputRef = useRef<HTMLDivElement>(null)

  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        'autofocus': 'on',
        'autocomplete': 'off',
        'autocorrect': 'off',
        'autocapitalize': 'off',
        'aria-label': 'Main content area, start typing to enter text.',
        'class': 'simple-editor',
      },
    },
    extensions: [
      //@ts-expect-error Internal package type-assertion issue
      StarterKit.configure({ horizontalRule: false }),
      HorizontalRule,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Typography,
      Selection,
    ],
  })

  useEffect(() => {
    if (!isMobile && mobileView !== 'main') {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setMobileView('main')
    }
  }, [isMobile, mobileView])

  return (
    <div data-slot='rich-text-editor-wrapper' className='flex flex-1 flex-col items-center'>
      <div data-slot='rich-text-editor-container' className='@container/editor flex size-full max-h-[58dvh] flex-col lg:max-w-[85%]'>
        <EditorContext.Provider value={{ editor }}>
          <Toolbar>
            {mobileView === 'main' ? (
              <MainToolbarContent onFontClick={() => setMobileView('font')} onHighlighterClick={() => setMobileView('highlighter')} isMobile={isMobile} />
            ) : (
              <MobileToolbarContent type={mobileView} onBack={() => setMobileView('main')} onHighlighterClick={() => setMobileView('highlighter')} />
            )}
          </Toolbar>

          <EditorContent
            ref={editorInputRef}
            onClick={() => {
              const paragraphs = editorInputRef.current!.children
              const lastParagraph = paragraphs.item(paragraphs.length - 1)! as HTMLParagraphElement
              // focusses the last paragraph when the editor-pane is clicked.
              lastParagraph.focus()
            }}
            editor={editor}
            role='presentation'
            className={cn('rounded-md border border-input-ring', 'flex flex-1 flex-col', 'min-h-72 p-5', 'cursor-text overflow-auto')}
          />
        </EditorContext.Provider>
      </div>
    </div>
  )
}
