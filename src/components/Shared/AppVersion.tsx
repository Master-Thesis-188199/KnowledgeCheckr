import Link from 'next/link'
import { twMerge } from 'tailwind-merge'
import getVersion from '@/lib/Shared/getVersion'
import env from '@/src/lib/Shared/Env'

export default async function AppVersion() {
  const version = await getVersion()

  return (
    <div className={twMerge('hidden justify-end', env.SHOW_APP_VERSION && 'flex')}>
      <Link
        href={`https://github.com/Master-Thesis-188199/KnowledgeCheckr/releases/tag/${version}`}
        className='rounded-md p-1.5 text-xs dark:text-neutral-300/70 dark:hover:bg-neutral-700 dark:hover:text-neutral-300'
        children={version}
      />
    </div>
  )
}
