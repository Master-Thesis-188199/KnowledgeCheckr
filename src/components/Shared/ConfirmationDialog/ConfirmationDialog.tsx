import { useState } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/shadcn/alert-dialog'

type Props = {
  children: React.ReactNode
  title?: string
  body?: string
  confirmLabel?: string
  cancelLabel?: string
  confirmAction: () => Promise<unknown> | unknown
  onConfirmSuccess?: () => void
  onCancelClose?: () => void
}

export default function ConfirmationDialog({ children, title, body, confirmAction, onConfirmSuccess, confirmLabel, cancelLabel, onCancelClose }: Props) {
  const [open, setOpen] = useState<boolean>(false)

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild onClick={() => setOpen(true)}>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent onInteractionOutside={() => setOpen(false)}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title ?? 'Are you absolutely sure?'}</AlertDialogTitle>
          <AlertDialogDescription>{body ?? 'This action cannot be undone. This will permanently delete this element from your account and remove its data from our servers.'}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              onCancelClose?.()
              setOpen(false)
            }}>
            {cancelLabel ?? 'Cancel'}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              await confirmAction()
              setOpen(false)
              onConfirmSuccess?.()
            }}>
            {confirmLabel ?? 'Continue'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
