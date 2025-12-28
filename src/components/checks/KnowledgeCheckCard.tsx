'use client'

import { motion } from 'framer-motion'
import { PracticeKnowledgeCheckButton } from '@/src/components/checks/PracticeKnowledgeCheckButton'
import { ShareKnowledgeCheckButton } from '@/src/components/checks/ShareKnowledgeCheckButton'
import Card from '@/src/components/Shared/Card'
import { InitialsIcon } from '@/src/components/Shared/InitialsIcon'
import { cn } from '@/src/lib/Shared/utils'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'

export function KnowledgeCheckCard(check: KnowledgeCheck) {
  return (
    <Card as={motion.a} href={`/checks/edit/${check.id}`} className={cn('group relative flex h-full flex-col justify-between gap-10')}>
      <div className='absolute top-3 right-4 flex gap-1'>
        <ShareKnowledgeCheckButton check={check} />
        <PracticeKnowledgeCheckButton check={check} />
      </div>
      <div className='flex flex-col items-center gap-1 px-4'>
        <InitialsIcon size={64} name={check.name} className='mx-auto mt-4 mb-2' />
        <h2 className='text-center text-xl font-semibold text-neutral-600 dark:text-neutral-300'>{check.name}</h2>
        <span className='line-clamp-2 text-center text-sm text-balance text-neutral-500 dark:text-neutral-400'>{check.description}</span>
      </div>
      <div className='flex flex-wrap justify-evenly gap-8 px-6 text-neutral-300'>
        <div className='flex max-w-fit flex-col items-center gap-1'>
          <dt className='text-sm text-neutral-500 dark:text-neutral-400'>Questions</dt>
          <dd className='order-first text-lg font-semibold tracking-tight text-neutral-600/90 dark:text-neutral-300'>{check.questions.length}</dd>
        </div>
        <div className='flex max-w-fit flex-col items-center gap-1'>
          <dt className='text-sm text-neutral-500 dark:text-neutral-400'>estimated Time</dt>
          <dd className='order-first text-lg font-semibold tracking-tight text-neutral-600/90 dark:text-neutral-300'>
            10<span className='text-base'>m</span>
          </dd>
        </div>
        <div className='flex max-w-fit flex-col items-center gap-1'>
          <dt className='text-sm text-neutral-500 dark:text-neutral-400'>Points</dt>
          <dd className='order-first text-lg font-semibold tracking-tight text-neutral-600/90 dark:text-neutral-300'>
            {check.questions.map((q) => q.points).reduce((prev, current) => (prev += current), 0)}
          </dd>
        </div>
      </div>
      <Footer updatedAt={check.updatedAt} />
    </Card>
  )
}

function Footer({ updatedAt }: { updatedAt?: Date }) {
  return (
    <div className='-mt-6 -mb-1 flex flex-row-reverse justify-between border-t border-neutral-700 px-4 pt-3 text-xs dark:text-neutral-400/70'>
      <div>last modified: {updatedAt ? new Date(updatedAt).toLocaleDateString('de', { year: '2-digit', month: '2-digit', day: '2-digit' }) : 'N/A'}</div>
    </div>
  )
}
