import { notFound } from 'next/navigation'
import { getKnowledgeCheckByShareToken } from '@/database/knowledgeCheck/select'
import { PracticeStoreProvider } from '@/src/components/checks/[share_token]/practice/PracticeStoreProvider'
import { RenderPracticeQuestion } from '@/src/components/checks/[share_token]/practice/RenderPracticeQuestion'
import PageHeading from '@/src/components/Shared/PageHeading'

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
        <div id='practice-question-steps' className='mx-4 mb-8 grid grid-cols-[repeat(auto-fill,minmax(64,1fr))] gap-x-5 gap-y-10 lg:gap-x-12'>
          {check.questions.map((q, i) => (
            <div key={q.id} className='relative w-fit'>
              <span className='absolute right-0 bottom-2 left-0 text-center text-sm text-neutral-300'>{i + 1}</span>
              <div className='h-2 w-16 rounded-xl bg-neutral-400' children='' />
            </div>
          ))}
        </div>

        <RenderPracticeQuestion />
      </div>
    </PracticeStoreProvider>
  )
}
