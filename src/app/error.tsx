'use client' // Error boundaries must be Client Components

import { useEffect } from 'react'
import Card from '@/src/components/Shared/Card'
import { cn } from '@/src/lib/Shared/utils'

export default function RootErrorBoundary({ error }: { error: Error & { digest?: string }; reset: () => void }) {
  const isDevelelopment = process.env.NODE_ENV === 'development'
  const isProduction = process.env.NODE_ENV === 'production'

  useEffect(() => {
    if (isProduction) return

    console.error(error)
  }, [error])

  return (
    <div className='mb-10 flex h-full items-center justify-center'>
      <Card disableInteractions className={cn('flex max-w-xl flex-col gap-4', isDevelelopment && 'max-w-7xl')}>
        <h2 className='border-b border-neutral-400/70 pb-2 text-lg font-semibold text-red-500 dark:border-neutral-600 dark:text-red-400'>{error.name} </h2>
        <div className={cn('px-2 text-red-600/90 dark:text-red-400/90', isProduction && 'hidden')}>
          <p className='mb-4'>{error.message}</p>
          {String(error.stack)
            .split('\n')
            .map((trace, i) => (
              <p className='text-balance' key={trace + i}>
                {trace}
              </p>
            ))}
        </div>
        <div className={cn('px-2 text-red-600/90 dark:text-red-400/90', isDevelelopment && 'hidden')}>
          <p>Unfortunately, an internal issue caused your request to fail. Retry your previous action after a few minutes. In case the issue persists please contact the team.</p>
        </div>
      </Card>
    </div>
  )
}
