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
import { useScopedI18n } from '@/src/i18n/client-localization'

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
  const t = useScopedI18n('Components.ConfirmationDialog')
  const [open, setOpen] = useState<boolean>(false)

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild onClick={() => setOpen(true)}>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent onInteractionOutside={() => setOpen(false)}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title ?? t('default_title')}</AlertDialogTitle>
          <AlertDialogDescription>{body ?? t('default_body')}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              onCancelClose?.()
              setOpen(false)
            }}>
            {cancelLabel ?? t('default_cancel_label')}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              await confirmAction()
              setOpen(false)
              onConfirmSuccess?.()
            }}>
            {confirmLabel ?? t('default_confirm_label')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
