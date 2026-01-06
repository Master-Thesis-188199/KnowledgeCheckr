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
import { TooltipProps } from '@/src/components/Shared/Tooltip'
import { generateToken } from '@/src/lib/Shared/generateToken'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'

export default function KnowledgeCheckMenu({ id, questions, share_key }: {} & Pick<KnowledgeCheck, 'share_key' | 'questions' | 'id'>) {
  const router = useRouter()
  const hasQuestions = questions.length > 0

  const baseTooltipOptions: Partial<TooltipProps> = {
    showsError: true,
    offset: 0,
    placement: 'right-end',
  }

  /**
   * This simple utility function returns an onClick handler that essentially calls the callback function with the existing share-token or
   * generates a new token, stores the token and then calls the callback with the newly generated token. In case storing the token is unsuccessful,
   * the `failureToastMessage´ is used as the error-message displayed in a toast letting the user know the operation was unsuccessful.
   * @param failureToastMessage The message used to let users know the operation was unsuccessful
   * @param callback The callback function which is used when a) a share-key exists or b) after a new token was generated and stored.
   * @returns a callable onClick handler
   */
  const gatherShareToken = (failureToastMessage: string, callback: (token: NonNullable<KnowledgeCheck['share_key']>) => void) => (_: React.MouseEvent<HTMLElement, MouseEvent>) => {
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size='icon' onClick={(e) => e.preventDefault()} className='hover:ring-ring-hover h-auto w-auto px-1 py-0.5 hover:ring-1'>
          <EllipsisIcon className='size-5 text-neutral-500 dark:text-neutral-400' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='w-58' align='start'>
        <DropdownMenuLabel className='text-center'>Actions</DropdownMenuLabel>

        <DropdownMenuGroup>
          <DropdownMenuItem
            className='group justify-between'
            enableTooltip={!hasQuestions}
            tooltipOptions={{ ...baseTooltipOptions, content: 'This check has no questions, practice disabled.' }}
            disabled={!hasQuestions}
            onClick={gatherShareToken('Unable to start Practice', (token) => {
              router.push(`${window.location.origin}/checks/${token}/practice`)
            })}>
            Start Practicing
            <ArrowUpRightIcon className='text-neutral-600 group-data-[disabled]:text-inherit dark:text-neutral-400' />
          </DropdownMenuItem>

          <DropdownMenuItem
            className='group justify-between'
            enableTooltip={!hasQuestions}
            tooltipOptions={{ ...baseTooltipOptions, content: 'This check has no questions, examination disabled.' }}
            disabled={!hasQuestions}
            onClick={gatherShareToken('Unable to start Examination', (token) => {
              router.push(`${window.location.origin}/checks/${token}`)
            })}>
            Start Examination
            <ArrowUpRightIcon className='text-neutral-600 group-data-[disabled]:text-inherit dark:text-neutral-400 dark:group-data-[disabled]:text-inherit' />
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger enableTooltip={!hasQuestions} tooltipOptions={{ ...baseTooltipOptions, content: 'This check has no questions, sharing disabled.' }} disabled={!hasQuestions}>
            Invite users to
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent sideOffset={4}>
              <DropdownMenuItem
                onClick={gatherShareToken('Unable to generate share-token', (token) => {
                  navigator.clipboard
                    .writeText(`${window.location.origin}/checks/${token}/practice`)
                    .then(() => toast('Successfully saved practice-url to your clipboard.', { type: 'success' }))
                    .catch(() => toast('Failed to copy practice link to the clipboard.', { type: 'error' }))
                })}>
                start Practicing
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={gatherShareToken('Unable to generate share-token', (token) => {
                  navigator.clipboard
                    .writeText(`${window.location.origin}/checks/${token}/`)
                    .then(() => toast('Successfully saved exam-url to your clipboard.', { type: 'success' }))
                    .catch(() => toast('Failed to copy examination link to the clipboard.', { type: 'error' }))
                })}>
                start Examination
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link href={`/checks/edit/${id}`} className='flex flex-1 justify-between'>
              Edit KnowledgeCheck
              <SquarePenIcon className='size-3.5 text-neutral-600 group-data-[disabled]:text-inherit dark:text-neutral-400 dark:group-data-[disabled]:text-inherit' />
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem className='justify-between' disabled>
            Clone KnowledgeCheck
            <CopyPlusIcon className='size-4 text-neutral-600 group-data-[disabled]:text-inherit dark:text-neutral-400 dark:group-data-[disabled]:text-inherit' />
          </DropdownMenuItem>
          <DropdownMenuItem disabled>Inspect Statistics</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() =>
            updateKnowledgeCheckShareToken({ checkId: id, token: null })
              .then((success) => {
                if (!success) return

                router.refresh()
                const pageHeading = document.querySelector('main h1')
                pageHeading?.scrollIntoView({ block: 'end', behavior: 'smooth' })
                toast('Successfully removed share-token', { type: 'success' })
              })
              .catch((err) => {
                console.error('[Error]: Removing share-token failed.', err)
                toast('Removing share-token was unsuccessful!', { type: 'error' })
              })
          }
          variant='destructive'
          className='justify-between'>
          Remove Share Token
          <Share2Icon />
        </DropdownMenuItem>
        <DropdownMenuItem
          variant='destructive'
          className='justify-between'
          onClick={() =>
            removeKnowledgeCheck({ checkId: id })
              .then((success) => {
                if (!success) return

                router.refresh()
                const pageHeading = document.querySelector('main h1')
                pageHeading?.scrollIntoView({ block: 'end', behavior: 'smooth' })
                toast('Successfully deleted KnowledgeCheck', { type: 'success' })
              })
              .catch((err) => {
                console.error('[Error]: Removing knowledgeCheck failed.', err)
                toast('Removing knowledgeCheck was unsuccessful!', { type: 'error' })
              })
          }>
          Delete KnowledgeCheck
          <TrashIcon />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
