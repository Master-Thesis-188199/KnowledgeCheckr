'use client'

import { ShareKnowledgeCheckButton } from '@/src/components/check/ShareKnowledgeCheckButton'
import { InitialsIcon } from '@/src/components/Shared/InitialsIcon'
import { cn } from '@/src/lib/Shared/utils'
import { KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'
import { Tooltip } from '@heroui/tooltip'
import { motion, Variants } from 'framer-motion'
import { InfoIcon, PlayIcon } from 'lucide-react'

// Parent needs empty states just to trigger its children
const cardVariants = {
  rest: {},
  hover: {},
}

// Animate opacity + slide of check-action-bar
const actionVariants: Variants = {
  rest: {
    opacity: 0,
    display: 'none',
    y: 10,
    pointerEvents: 'none',
  },
  hover: {
    opacity: 1,
    display: 'flex',
    y: 0,
    pointerEvents: 'auto',
    transition: { duration: 0.2, ease: 'easeOut' },
  },
}

export function KnowledgeCheckCard(check: KnowledgeCheck) {
  return (
    <motion.a
      href={`/checks/edit/${check.id}`}
      className={cn(
        'group relative flex h-full flex-col justify-between gap-10 rounded-md py-4 ring-1 hover:ring-2 focus:ring-2',
        'bg-neutral-200/40 ring-neutral-400/80 hover:bg-neutral-200/80 focus:bg-neutral-200/60 focus:ring-neutral-400',
        'dark:bg-neutral-700/30 dark:ring-neutral-500/70 dark:hover:bg-neutral-700/60 focus:dark:bg-neutral-700/60 focus:dark:ring-neutral-500',
      )}
      variants={cardVariants}
      initial='rest'
      whileHover='hover'
      animate='rest'>
      <div className='absolute top-3 right-4 flex gap-1'>
        <ShareKnowledgeCheckButton check={check} />

        <Tooltip
          content={
            <div className='flex items-center gap-1.5'>
              <InfoIcon className='size-4' />
              Practice Knowledge
            </div>
          }
          delay={250}
          offset={8}
          closeDelay={0}
          shouldFlip
          className='rounded-md bg-neutral-100 p-2 text-sm shadow-sm shadow-neutral-400 dark:bg-neutral-800 dark:text-neutral-300 dark:shadow-neutral-700'>
          <button className='group/play p-1.5'>
            <PlayIcon className='size-4.5 group-hover/play:animate-pulse group-hover/play:cursor-pointer dark:text-neutral-400 dark:group-hover/play:text-green-500/90' />
          </button>
        </Tooltip>
      </div>
      <div className='flex flex-col items-center gap-1 px-4'>
        <InitialsIcon size={64} name={check.name} className='mx-auto mt-4 mb-2 size-auto' />
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

      {/* <motion.div className='absolute inset-x-0 bottom-0 z-10 flex justify-center gap-12 rounded-md border-0 bg-white/90 py-3 ring-0 outline-none dark:bg-neutral-900' variants={actionVariants}>
        <Button variant='primary' disabled>
          Exercise
        </Button>
        <Button variant='outline' disabled>
          Edit
        </Button>
      </motion.div> */}
    </motion.a>
  )
}
