import { EllipsisIcon, Share2Icon, TrashIcon } from 'lucide-react'
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
import { generateToken } from '@/src/lib/Shared/generateToken'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'

export default function KnowledgeCheckMenu({ id, questions, share_key }: {} & Pick<KnowledgeCheck, 'share_key' | 'questions' | 'id'>) {
  const router = useRouter()
  const hasQuestions = questions.length > 0

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
      <DropdownMenuContent className='w-56' align='start'>
        <DropdownMenuLabel className='text-center'>Actions</DropdownMenuLabel>

        <DropdownMenuGroup>
          <DropdownMenuItem
            disabled={!hasQuestions}
            onClick={gatherShareToken('Unable to start Practice', (token) => {
              router.push(`${window.location.origin}/checks/${token}/practice`)
            })}>
            Start Practicing
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={!hasQuestions}
            onClick={gatherShareToken('Unable to start Examination', (token) => {
              router.push(`${window.location.origin}/checks/${token}`)
            })}>
            Start Examination
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger disabled={!hasQuestions}>Invite users to</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
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
              <DropdownMenuItem>start Examination</DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>

        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Link href={`/checks/edit/${id}`}>Edit KnowledgeCheck</Link>
          </DropdownMenuItem>
          <DropdownMenuItem disabled>Duplicate KnowledgeCheck</DropdownMenuItem>
          <DropdownMenuItem disabled>Inspect Statistics</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() =>
            updateKnowledgeCheckShareToken({ checkId: id, token: null }).then((success) => {
              if (!success) return

              router.refresh()
              const pageHeading = document.querySelector('main h1')
              pageHeading?.scrollIntoView({ block: 'end', behavior: 'smooth' })
              toast('Successfully removed share-token', { type: 'success' })
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
            removeKnowledgeCheck({ checkId: id }).then((success) => {
              if (!success) return

              router.refresh()
              const pageHeading = document.querySelector('main h1')
              pageHeading?.scrollIntoView({ block: 'end', behavior: 'smooth' })
              toast('Successfully deleted KnowledgeCheck', { type: 'success' })
            })
          }>
          Delete KnowledgeCheck
          <TrashIcon />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
