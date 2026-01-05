import { EllipsisIcon, Share2Icon, TrashIcon } from 'lucide-react'
import Link from 'next/link'
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
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'

export default function KnowledgeCheckCardHamburgerMenu({ id, questions, share_key }: {} & Pick<KnowledgeCheck, 'share_key' | 'questions' | 'id'>) {
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
        <DropdownMenuItem variant='destructive' className='justify-between'>
          Remove Share Token
          <Share2Icon />
        </DropdownMenuItem>
        <DropdownMenuItem variant='destructive' className='justify-between'>
          Delete KnowledgeCheck
          <TrashIcon />
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
