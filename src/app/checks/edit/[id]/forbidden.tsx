'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/src/components/shadcn/button'

export default function ForbiddenEditPage() {
  const router = useRouter()
  return (
    <div className='flex h-full flex-col items-center justify-center gap-6'>
      <div className='flex items-center gap-4'>
        <div className='flex h-12 items-center justify-center border-r-[0.5px] border-black pr-4 text-xl font-semibold dark:border-gray-500'>403</div>
        <h1>You&apos;re not authorized to edit this check.</h1>
      </div>
      <Button onClick={() => router.back()}>Back</Button>
    </div>
  )
}
