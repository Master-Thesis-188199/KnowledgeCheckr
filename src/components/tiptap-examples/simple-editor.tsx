'use client'

import '@/components/tiptap-node/blockquote-node/blockquote-node.scss'
import '@/components/tiptap-node/code-block-node/code-block-node.scss'
import '@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss'
import '@/components/tiptap-node/list-node/list-node.scss'
import '@/components/tiptap-node/image-node/image-node.scss'
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
import { TextAlignJustifyIcon } from 'lucide-react'
import content from '@/components/tiptap-examples/data/content.json'
// --- Components ---
// --- Icons ---
import { ArrowLeftIcon } from '@/components/tiptap-icons/arrow-left-icon'
import { HighlighterIcon } from '@/components/tiptap-icons/highlighter-icon'
import { LinkIcon } from '@/components/tiptap-icons/link-icon'
import { HorizontalRule } from '@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension'
// --- Tiptap Node ---
import { ColorHighlightPopover, ColorHighlightPopoverButton, ColorHighlightPopoverContent } from '@/components/tiptap-ui/color-highlight-popover'
// --- Tiptap UI ---
import { HeadingDropdownMenu } from '@/components/tiptap-ui/heading-dropdown-menu'
import { LinkButton, LinkContent, LinkPopover } from '@/components/tiptap-ui/link-popover'
import { ListDropdownMenu } from '@/components/tiptap-ui/list-dropdown-menu'
import { MarkButton } from '@/components/tiptap-ui/mark-button'
import { TextAlignButton } from '@/components/tiptap-ui/text-align-button'
import { UndoRedoButton } from '@/components/tiptap-ui/undo-redo-button'
// --- UI Primitives ---
import { Spacer } from '@/components/tiptap-ui-primitive/spacer'
import { Toolbar, ToolbarGroup, ToolbarSeparator } from '@/components/tiptap-ui-primitive/toolbar'
import { useCursorVisibility } from '@/hooks/use-cursor-visibility'
// --- Hooks ---
import { useWindowSize } from '@/hooks/use-window-size'
import { Button as ShadcnButton } from '@/src/components/shadcn/button'
import { Button } from '@/src/components/tiptap-ui-primitive/button'
import { useIsBreakpoint } from '@/src/hooks/use-is-breakpoint'
import { cn } from '@/src/lib/Shared/utils'

const MainToolbarContent = ({
  onHighlighterClick,
  onLinkClick,
  isMobile,
  onFontClick,
  onAlignmentClick,
}: {
  onAlignmentClick: () => void
  onFontClick: () => void
  onHighlighterClick: () => void
  onLinkClick: () => void
  isMobile: boolean
}) => {
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

        {isMobile && (
          <>
            <ToolbarSeparator />
            <Button variant={'ghost'} onClick={onFontClick}>
              A
            </Button>

            <ToolbarSeparator />
            <Button variant={'ghost'} onClick={onAlignmentClick}>
              <TextAlignJustifyIcon className='size-4' />
            </Button>
          </>
        )}
      </ToolbarGroup>

      {!isMobile && (
        <>
          <ToolbarSeparator />
          <ToolbarGroup>
            <MarkButton type='bold' />
            <MarkButton type='italic' />
            <MarkButton type='strike' />
            <MarkButton type='code' />
            <MarkButton type='underline' />
            {!isMobile ? <ColorHighlightPopover /> : <ColorHighlightPopoverButton onClick={onHighlighterClick} />}
            {!isMobile ? <LinkPopover /> : <LinkButton onClick={onLinkClick} />}
          </ToolbarGroup>
          <ToolbarSeparator />
        </>
      )}

      {!isMobile && (
        <ToolbarGroup>
          <TextAlignButton align='left' />
          <TextAlignButton align='center' />
          <TextAlignButton align='right' />
        </ToolbarGroup>
      )}

      <Spacer />
    </>
  )
}

const AlignmentMobileSubMenuContent = () => {
  return (
    <>
      <TextAlignButton align='left' />
      <TextAlignButton align='center' />
      <TextAlignButton align='right' />
    </>
  )
}

const FontMobileSubMenuContent = ({ onHighlighterClick, onLinkClick }: { onHighlighterClick: () => void; onLinkClick: () => void }) => {
  return (
    <>
      <MarkButton type='bold' />
      <MarkButton type='italic' />
      <MarkButton type='strike' />
      <MarkButton type='code' />
      <MarkButton type='underline' />
      {<ColorHighlightPopoverButton onClick={onHighlighterClick} />}
      {<LinkButton onClick={onLinkClick} />}
    </>
  )
}

const MobileToolbarContent = ({
  type,
  onBack,
  onHighlighterClick,
  onLinkClick,
}: {
  type: 'highlighter' | 'link' | 'font' | 'alignment'
  onBack: () => void
  onHighlighterClick: () => void
  onLinkClick: () => void
}) => (
  <>
    <ToolbarGroup>
      <ShadcnButton variant='ghost' onClick={onBack}>
        <ArrowLeftIcon className='tiptap-button-icon' />

        {type === 'highlighter' && <HighlighterIcon className='tiptap-button-icon' />}
        {type === 'link' && <LinkIcon className='tiptap-button-icon' />}
        {type === 'font' && <>A</>}
        {type === 'alignment' && <TextAlignJustifyIcon />}
      </ShadcnButton>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === 'highlighter' && <ColorHighlightPopoverContent />}
    {type === 'link' && <LinkContent />}
    {type === 'font' && <FontMobileSubMenuContent onHighlighterClick={onHighlighterClick} onLinkClick={onLinkClick} />}
    {type === 'alignment' && <AlignmentMobileSubMenuContent />}
  </>
)

export function SimpleEditor() {
  const isMobile = useIsBreakpoint()
  const { height } = useWindowSize()
  const [mobileView, setMobileView] = useState<'main' | 'highlighter' | 'link' | 'font' | 'alignment'>('main')
  const toolbarRef = useRef<HTMLDivElement>(null)

  const editor = useEditor({
    immediatelyRender: false,
    editorProps: {
      attributes: {
        'autocomplete': 'off',
        'autocorrect': 'off',
        'autocapitalize': 'off',
        'aria-label': 'Main content area, start typing to enter text.',
        'class': 'simple-editor',
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      HorizontalRule,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Typography,
      Selection,
    ],
    content,
  })

  const rect = useCursorVisibility({
    editor,

    // eslint-disable-next-line react-hooks/refs
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  })

  useEffect(() => {
    if (!isMobile && mobileView !== 'main') {
      setMobileView('main')
    }
  }, [isMobile, mobileView])

  return (
    <div className='flex flex-col items-center'>
      <EditorContext.Provider value={{ editor }}>
        <Toolbar
          ref={toolbarRef}
          style={{
            ...(isMobile
              ? {
                  bottom: `calc(100% - ${height - rect.y}px)`,
                }
              : {}),
          }}>
          {mobileView === 'main' ? (
            <MainToolbarContent
              onAlignmentClick={() => setMobileView('alignment')}
              onFontClick={() => setMobileView('font')}
              onHighlighterClick={() => setMobileView('highlighter')}
              onLinkClick={() => setMobileView('link')}
              isMobile={isMobile}
            />
          ) : (
            <MobileToolbarContent type={mobileView} onBack={() => setMobileView('main')} onHighlighterClick={() => setMobileView('highlighter')} onLinkClick={() => setMobileView('link')} />
          )}
        </Toolbar>

        <EditorContent editor={editor} role='presentation' className={cn('rounded-md border border-input-ring', 'flex size-full flex-1 flex-col lg:max-w-[75%]', 'min-h-72 p-5')} />
      </EditorContext.Provider>
    </div>
  )
}
