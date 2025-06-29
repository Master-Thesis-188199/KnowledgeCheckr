/* UnsavedChangesModal.tsx */

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/src/components/shadcn/alert-dialog'
import Link from 'next/link'
import { Dispatch, SetStateAction } from 'react'

export interface INavigationAbortContext {
  content: INavigationAbortModalContent | undefined
  setContent: Dispatch<SetStateAction<INavigationAbortModalContent | undefined>>
  showModal: boolean
  setShowModal: Dispatch<SetStateAction<boolean>>
}

export interface INavigationAbortModalContent {
  title?: string
  description?: string
  dismissLabel?: string
  continueLabel?: string
  continueHref?: string
}

export default function NavigationAbortModel({ showModal, content, setContent, setShowModal }: INavigationAbortContext) {
  return (
    <AlertDialog open={showModal}>
      <AlertDialogContent onEscapeKeyDown={() => setShowModal(false)} onInteractionOutside={() => setShowModal(false)}>
        <AlertDialogHeader>
          <AlertDialogTitle>{content?.title || 'You have unsaved changes.'}</AlertDialogTitle>
          <AlertDialogDescription>{content?.description || 'When you leave this page your progress / changes will be lost.'}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setShowModal(false)}>{content?.dismissLabel || 'Back to page'}</AlertDialogCancel>
          <AlertDialogAction>
            <Link
              href={content?.continueHref || '/'}
              onClick={() => {
                setShowModal(false)
                setContent(undefined)
              }}>
              {content?.continueLabel || "I don't want to save changes"}
            </Link>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
