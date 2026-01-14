'use client'

import React from 'react'
import { motion } from 'framer-motion'
import KnowledgeCheckMenu from '@/src/components/checks/(hamburger-menu)/KnowledgeCheckMenu'
import { ShareKnowledgeCheckButton } from '@/src/components/checks/ShareKnowledgeCheckButton'
import Card from '@/src/components/Shared/Card'
import { InitialsIcon } from '@/src/components/Shared/InitialsIcon'
import { cn } from '@/src/lib/Shared/utils'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'

export function KnowledgeCheckCard(check: KnowledgeCheck) {
  return (
    <Card as={motion.div} disableInteractions initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className={cn('relative flex h-full flex-col justify-between gap-10')}>
      <div className='absolute top-3 right-4 flex gap-1'>
        <ShareKnowledgeCheckButton check={check} />
        <KnowledgeCheckMenu id={check.id} questions={check.questions} share_key={check.share_key} owner_id={check.owner_id!} />
      </div>
      <div className='flex flex-col items-center gap-1 px-4'>
        <InitialsIcon size={64} name={check.name} className='mx-auto mt-4 mb-2' />
        <h2 className='text-center text-xl font-semibold text-neutral-600 dark:text-neutral-300'>{check.name}</h2>
        <span className='line-clamp-2 text-center text-sm text-balance text-neutral-500 dark:text-neutral-400'>{check.description}</span>
      </div>
      <div className='flex flex-wrap justify-evenly gap-8 px-6'>
        <StatisticElement label='Questions' value={check.questions.length} />
        <StatisticElement
          label='estimatedTime'
          value={
            <>
              10<span className='text-base'>m</span>
            </>
          }
        />
        <StatisticElement label='Points' value={check.questions.map((q) => q.points).reduce((prev, current) => (prev += current), 0)} />
      </div>
      <Footer updatedAt={check.updatedAt} />
    </Card>
  )
}

function Footer({ updatedAt }: { updatedAt?: Date }) {
  return (
    <div className='-mt-6 -mb-1 flex flex-row-reverse justify-between border-t border-neutral-400/80 px-4 pt-3 text-xs text-neutral-500/70 dark:border-neutral-700 dark:text-neutral-400/70'>
      <div>last modified: {updatedAt ? new Date(updatedAt).toLocaleDateString('de', { year: '2-digit', month: '2-digit', day: '2-digit' }) : 'N/A'}</div>
    </div>
  )
}

function StatisticElement({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className='flex max-w-fit flex-col items-center gap-1'>
      <dt className='text-sm text-neutral-500 dark:text-neutral-400'>{label}</dt>
      <dd className='order-first text-lg font-semibold tracking-tight text-neutral-600/90 dark:text-neutral-300'>{value}</dd>
    </div>
  )
}
