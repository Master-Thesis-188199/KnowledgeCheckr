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
import { updateKnowledgeCheckShareToken } from '@/database/knowledgeCheck/update'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'

export default function KnowledgeCheckMenu({ id, questions, share_key }: {} & Pick<KnowledgeCheck, 'share_key' | 'questions' | 'id'>) {
  const router = useRouter()
  const isAccessible = share_key !== null
  const hasQuestions = questions.length > 0

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
          <DropdownMenuItem>Start Practicing</DropdownMenuItem>
          <DropdownMenuItem>Start Examination</DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSub>
          <DropdownMenuSubTrigger>Invite users to</DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuItem>start Practicing</DropdownMenuItem>
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
