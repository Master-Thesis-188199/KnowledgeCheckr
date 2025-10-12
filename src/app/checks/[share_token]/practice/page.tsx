import { getKnowledgeCheckByShareToken } from '@/database/knowledgeCheck/select'
import { PracticeStoreProvider } from '@/src/components/checks/[share_token]/practice/PracticeStoreProvider'
import { Button } from '@/src/components/shadcn/button'
import PageHeading from '@/src/components/Shared/PageHeading'
import { notFound } from 'next/navigation'

export default async function PracticePage({ params }: { params: Promise<{ share_token: string }> }) {
  const { share_token } = await params

  const check = await getKnowledgeCheckByShareToken(share_token)

  if (!check) {
    notFound()
  }

  return (
    <PracticeStoreProvider initialStoreProps={{ questions: check.questions }}>
      <PageHeading title='Practice' />

      <div className='mx-auto'>
        <div className='mb-8 flex gap-12'>
          {check.questions.map((q, i) => (
            <div key={q.id} className='relative w-fit'>
              <span className='absolute right-0 bottom-2 left-0 text-center text-sm text-neutral-300'>{i + 1}</span>
              <div className='h-2 w-16 rounded-xl bg-neutral-400' children='' />
            </div>
          ))}
        </div>

        <div className='my-8 flex flex-col items-center justify-center gap-2'>
          <span className='text-2xl font-semibold'>What colors are part of france&apos;s flag?</span>
          <span className='text-neutral-300'>Pick one or more answers</span>
        </div>

        <div className='mx-auto h-[55vh] w-[40vw] rounded-md ring-1'></div>
        <div className='mt-6 flex justify-center px-8'>
          <Button variant='secondary'>Check</Button>
        </div>
      </div>
    </PracticeStoreProvider>
  )
}
