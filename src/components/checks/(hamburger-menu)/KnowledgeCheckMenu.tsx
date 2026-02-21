'use client'

import { useState } from 'react'
import { ArrowUpRightIcon, CopyPlusIcon, EllipsisIcon, Share2Icon, SquarePenIcon, TrashIcon } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import { Button } from '@/components/shadcn/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/shadcn/dropdown-menu'
import { removeKnowledgeCheck } from '@/database/knowledgeCheck/delete'
import { storeKnowledgeCheckShareToken } from '@/database/knowledgeCheck/insert'
import { updateKnowledgeCheckShareToken } from '@/database/knowledgeCheck/update'
import ConfirmationDialog from '@/src/components/Shared/ConfirmationDialog/ConfirmationDialog'
import { TooltipProps } from '@/src/components/Shared/Tooltip'
import { useScopedI18n } from '@/src/i18n/client-localization'
import { useSession } from '@/src/lib/auth/client'
import { generateToken } from '@/src/lib/Shared/generateToken'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'

export default function KnowledgeCheckMenu({ id, questions, share_key, owner_id, collaborators }: {} & KnowledgeCheck) {
  const t = useScopedI18n('Components.KnowledgeCheckCardMenu')
  const [menuOpen, setMenuOpen] = useState(false)

  const { data } = useSession()
  const userId = data?.user.id

  const isOwner = owner_id === userId
  const isContributor = userId ? collaborators.includes(userId) : false

  const router = useRouter()
  const hasQuestions = questions.length > 0

  const baseTooltipOptions: Partial<TooltipProps> = {
    variant: 'destructive',
    side: 'right',
  }

  /**
   * This simple utility function returns an onClick handler that essentially calls the callback function with the existing share-token or
   * generates a new token, stores the token and then calls the callback with the newly generated token. In case storing the token is unsuccessful,
   * the `failureToastMessage´ is used as the error-message displayed in a toast letting the user know the operation was unsuccessful.
   * @param failureToastMessage The message used to let users know the operation was unsuccessful
   * @param callback The callback function which is used when a) a share-key exists or b) after a new token was generated and stored.
   * @returns a callable onClick handler
   */
  const gatherShareToken = (failureToastMessage: string, callback: (token: NonNullable<KnowledgeCheck['share_key']>) => void) => () => {
    if (share_key) {
      callback(share_key)
      return
    }

    const token = generateToken()
    storeKnowledgeCheckShareToken(id, token)
      .then(() => {
        router.refresh()
        callback(token)
      })
      .catch(() => toast(failureToastMessage, { type: 'error' }))
  }

  return (
    <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen} modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' onClick={(e) => e.preventDefault()} className='size-auto px-1 py-0.5 hover:ring-1 hover:ring-ring-hover'>
          <EllipsisIcon className='size-5 text-neutral-500 dark:text-neutral-400' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-58' align='start'>
        <DropdownMenuLabel className='text-center'>{t('menu_label')}</DropdownMenuLabel>

        <DropdownMenuGroup>
          <DropdownMenuItem
            className='group justify-between'
            enableTooltip={!hasQuestions}
            tooltipOptions={{ ...baseTooltipOptions, content: t('start_practice.tooltip') }}
            disabled={!hasQuestions}
            onClick={gatherShareToken(t('start_practice.toast'), (token) => {
              router.push(`${window.location.origin}/checks/${token}/practice`)
            })}>
            {t('start_practice.label')}
            <ArrowUpRightIcon className='text-neutral-600 group-data-disabled:text-inherit dark:text-neutral-400' />
          </DropdownMenuItem>

          <DropdownMenuItem
            className='group justify-between'
            enableTooltip={!hasQuestions}
            tooltipOptions={{ ...baseTooltipOptions, content: t('start_examination.tooltip') }}
            disabled={!hasQuestions}
            onClick={gatherShareToken(t('start_examination.toast'), (token) => {
              router.push(`${window.location.origin}/checks/${token}`)
            })}>
            {t('start_examination.label')}
            <ArrowUpRightIcon className='text-neutral-600 group-data-disabled:text-inherit dark:text-neutral-400 dark:group-data-disabled:text-inherit' />
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger enableTooltip={!hasQuestions} tooltipOptions={{ ...baseTooltipOptions, content: 'This check has no questions, sharing disabled.' }} disabled={!hasQuestions}>
            {t('invite_to_submenu_label')}
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent sideOffset={4}>
              <DropdownMenuItem
                onClick={gatherShareToken('Unable to generate share-token', (token) => {
                  navigator.clipboard
                    .writeText(`${window.location.origin}/checks/${token}/practice`)
                    .then(() => toast(t('copy_practice.toast_success'), { type: 'success' }))
                    .catch(() => toast(t('copy_practice.toast_failure'), { type: 'error' }))
                })}>
                {t('copy_practice.label')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={gatherShareToken('Unable to generate share-token', (token) => {
                  navigator.clipboard
                    .writeText(`${window.location.origin}/checks/${token}/`)
                    .then(() => toast(t('copy_examination.toast_success'), { type: 'success' }))
                    .catch(() => toast(t('copy_examination.toast_failure'), { type: 'error' }))
                })}>
                {t('copy_examination.label')}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem disabled={!isOwner && !isContributor} enableTooltip={!isOwner && !isContributor} tooltipOptions={{ ...baseTooltipOptions, content: t('edit_check.tooltip') }}>
            <Link href={`/checks/edit/${id}`} className='flex flex-1 justify-between'>
              {t('edit_check.label')}
              <SquarePenIcon className='size-3.5 text-neutral-600 group-data-disabled:text-inherit dark:text-neutral-400 dark:group-data-disabled:text-inherit' />
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className='justify-between' disabled>
            {t('clone_check.label')}
            <CopyPlusIcon className='size-4 text-neutral-600 group-data-disabled:text-inherit dark:text-neutral-400 dark:group-data-disabled:text-inherit' />
          </DropdownMenuItem>
          <DropdownMenuItem disabled>{t('inspect_statistics.label')}</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />

        <ConfirmationDialog
          body={t('remove_share_token.confirmation_dialog_body')}
          onConfirmSuccess={() => setMenuOpen(false)}
          confirmAction={() =>
            updateKnowledgeCheckShareToken({ checkId: id, token: null })
              .then((success) => {
                if (!success) return toast(t('Shared.toast_deletion_not_found'), { type: 'info' })

                router.refresh()
                const pageHeading = document.querySelector('main #page-heading')
                pageHeading?.scrollIntoView({ block: 'end', behavior: 'smooth' })
                toast(t('remove_share_token.toast_deletion_successful'), { type: 'success' })
              })
              .catch((err) => {
                console.error('[Error]: Removing share-token failed.', err)
                toast(t('remove_share_token.toast_deletion_failure'), { type: 'error' })
              })
          }>
          <DropdownMenuItem
            disabled={share_key === null || (!isOwner && !isContributor)}
            enableTooltip={share_key === null || (!isOwner && !isContributor)}
            tooltipOptions={{
              ...baseTooltipOptions,
              content: share_key === null ? t('remove_share_token.tooltip') : !isOwner && !isContributor ? t('Shared.tooltip_not_allowed') : undefined,
            }}
            onSelect={(e) => e.preventDefault()}
            variant='destructive'
            className='justify-between'>
            Remove Share Token
            <Share2Icon />
          </DropdownMenuItem>
        </ConfirmationDialog>
        <ConfirmationDialog
          body={t('delete_knowledgeCheck.confirmation_dialog_body')}
          onConfirmSuccess={() => setMenuOpen(false)}
          confirmAction={() => {
            removeKnowledgeCheck({ checkId: id })
              .then((success) => {
                if (!success) return toast(t('Shared.toast_deletion_not_found'), { type: 'info' })

                router.refresh()
                const pageHeading = document.querySelector('main #page-heading')
                pageHeading?.scrollIntoView({ block: 'end', behavior: 'smooth' })
                toast(t('delete_knowledgeCheck.toast_deletion_successful'), { type: 'success' })
              })
              .catch((err) => {
                console.error('[Error]: Removing knowledgeCheck failed.', err)
                toast(t('delete_knowledgeCheck.toast_deletion_failure'), { type: 'error' })
              })
          }}>
          <DropdownMenuItem
            disabled={!isOwner}
            enableTooltip={!isOwner}
            tooltipOptions={{
              ...baseTooltipOptions,
              content: t('Shared.tooltip_not_allowed'),
            }}
            onSelect={(e) => e.preventDefault()}
            variant='destructive'
            className='justify-between'>
            {t('delete_knowledgeCheck.label')}
            <TrashIcon />
          </DropdownMenuItem>
        </ConfirmationDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
