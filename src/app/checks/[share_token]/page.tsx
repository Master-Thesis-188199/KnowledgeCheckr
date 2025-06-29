import DisplayQuestion from '@/components/check/DisplayQuestion'
import { getKnowledgeCheckByShareToken } from '@/database/knowledgeCheck/select'
import PageHeading from '@/src/components/Shared/PageHeading'
import { cn } from '@/src/lib/Shared/utils'
import { notFound } from 'next/navigation'

export default async function CheckPage({ params }: { params: Promise<{ share_token: string }> }) {
  const { share_token } = await params

  const check = await getKnowledgeCheckByShareToken(share_token)

  if (!check) {
    notFound()
  }

  return (
    <>
      <PageHeading title={check.name ?? '<check-name>'} />

      <div className='grid grid-cols-[1fr_auto] gap-12'>
        <div className='mx-auto max-h-fit w-full max-w-7xl'>{check.questions && <DisplayQuestion {...check.questions.at(0)!} />}</div>
        <div className='flex max-h-fit min-h-24 min-w-72 flex-col justify-evenly gap-3 rounded-md p-4 ring-2 dark:ring-neutral-500'>
          <span className='font-semibold dark:text-neutral-300'>Questions</span>
          <div className='grid grid-cols-[repeat(auto-fill,30px)] gap-1.5'>
            {check.questions.map((question, i) => (
              <button
                className={cn(
                  'flex size-7 items-center justify-center rounded-lg p-1 text-sm ring-1 hover:cursor-pointer hover:ring-neutral-300/60 dark:ring-neutral-500 dark:hover:bg-neutral-600',
                  i === 0 && 'hover:cursor-default dark:bg-neutral-600 dark:ring-neutral-300/60',
                )}
                key={`question-nav-${i}`}>
                {i + 1}
              </button>
            ))}
          </div>
          <button className='ml-auto text-sm hover:cursor-pointer hover:underline dark:text-neutral-200/60'>Finish Check</button>
        </div>
      </div>

      <div className='flex hidden flex-col gap-8'>
        <div className='grid grid-cols-1 gap-8 @[1000px]:grid-cols-2 @[1400px]:grid-cols-3 @[1400px]:gap-14'>
          {check.questions.map((question) => (
            <DisplayQuestion key={question.id} {...question} />
          ))}
        </div>
      </div>
    </>
  )
}
