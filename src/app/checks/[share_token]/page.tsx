import DisplayQuestion from '@/components/check/DisplayQuestion'
import { getKnowledgeCheckByShareToken } from '@/database/knowledgeCheck/select'
import PageHeading from '@/src/components/Shared/PageHeading'
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
      <div className='flex flex-col gap-8'>
        <div className='grid grid-cols-1 gap-8 @[1000px]:grid-cols-2 @[1400px]:grid-cols-3 @[1400px]:gap-14'>
          {check.questions.map((question) => (
            <DisplayQuestion key={question.id} {...question} />
          ))}
        </div>
      </div>
    </>
  )
}
