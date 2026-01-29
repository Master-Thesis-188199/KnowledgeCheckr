'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { KeySquareIcon, LockIcon } from 'lucide-react'
import KnowledgeCheckMenu from '@/src/components/checks/(hamburger-menu)/KnowledgeCheckMenu'
import DegradingScoreIndicator from '@/src/components/checks/DegradingScoreIndicator'
import { ShareKnowledgeCheckButton } from '@/src/components/checks/ShareKnowledgeCheckButton'
import Card from '@/src/components/Shared/Card'
import { InitialsIcon } from '@/src/components/Shared/InitialsIcon'
import { useCurrentLocale, useScopedI18n } from '@/src/i18n/client-localization'
import { useSession } from '@/src/lib/auth/client'
import { cn } from '@/src/lib/Shared/utils'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'

export function KnowledgeCheckCard(check: KnowledgeCheck) {
  const { data } = useSession()
  const userId = data?.user.id
  const isCollaborator = userId ? check.collaborators.includes(userId) : false
  const isOwner = userId ? check.owner_id === userId : false

  let role: 'Guest' | 'Owner' | 'Collaborator' = 'Guest'
  if (isOwner) role = 'Owner'
  else if (isCollaborator) role = 'Collaborator'

  const t = useScopedI18n('Components.KnowledgeCheckCard')
  return (
    <Card
      as={motion.div}
      data-knowledge-check-id={check.id}
      disableInteractions
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn('relative flex h-full flex-col justify-between gap-10')}>
      <div className='absolute top-0 left-0 z-10 opacity-65'>
        {/* eslint-disable-next-line react-hooks/purity */}
        <DegradingScoreIndicator className='min-w-10 rounded-tl-md rounded-br-md p-1.5 px-3 text-sm' knowledgeCheckScore={+(Math.random() * 105).toFixed(0)} />
      </div>
      <div className='absolute top-3 right-4 left-4 flex items-center justify-between'>
        <div className='ml-auto flex gap-1'>
          <ShareKnowledgeCheckButton check={check} />
          <KnowledgeCheckMenu {...check} />
        </div>
      </div>
      <div className='flex flex-col items-center gap-1 px-4'>
        <InitialsIcon size={64} name={check.name} className='mx-auto mt-4 mb-2' />
        <h2 className='text-center text-xl font-semibold text-neutral-600 dark:text-neutral-300'>{check.name}</h2>
        <span className='line-clamp-2 text-center text-sm text-balance text-neutral-500 dark:text-neutral-400'>{check.description}</span>
      </div>
      <div className='flex flex-wrap justify-evenly gap-8 px-6'>
        <StatisticElement label={t('Statistics.questions_label')} value={check.questions.length} />
        <StatisticElement
          label={t('Statistics.estimatedTime_label')}
          value={
            <>
              10<span className='text-base'>m</span>
            </>
          }
        />
        <StatisticElement label={t('Statistics.points_label')} value={check.questions.map((q) => q.points).reduce((prev, current) => (prev += current), 0)} />
      </div>
      <Footer updatedAt={check.updatedAt} role={role} />
    </Card>
  )
}

function Footer({ updatedAt, role }: { updatedAt?: Date; role: 'Guest' | 'Owner' | 'Collaborator' }) {
  const t = useScopedI18n('Components.KnowledgeCheckCard')
  const currentLocale = useCurrentLocale()
  return (
    <div className='relative -mt-6 -mb-1 flex justify-between border-t border-neutral-400/80 px-4 pt-3 text-xs text-neutral-500/70 dark:border-neutral-700 dark:text-neutral-500'>
      <div className='flex items-center gap-1 text-[oklch(60%_0_0)]'>
        {role === 'Guest' && <LockIcon className='size-4' />}
        {role === 'Owner' && <KeySquareIcon className='size-3.5' />}
        <span className={cn('rounded-md select-none', role !== 'Guest' && 'font-semibold')}>{role}</span>
      </div>
      <div className='text-neutral-500/70 dark:text-neutral-400/70'>
        {t('last_modified_label')} {updatedAt ? new Date(updatedAt).toLocaleDateString(currentLocale, { year: '2-digit', month: '2-digit', day: '2-digit' }) : 'N/A'}
      </div>
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
