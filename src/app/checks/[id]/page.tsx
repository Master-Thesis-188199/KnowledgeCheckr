import DisplayQuestion from '@/components/check/DisplayQuestion'
import { getKnowledgeCheckById } from '@/database/knowledgeCheck/select'
import requireAuthentication from '@/src/lib/auth/requireAuthentication'
import { notFound } from 'next/navigation'

export default async function CheckPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await requireAuthentication()

  const check = await getKnowledgeCheckById(id)

  if (!check) {
    notFound()
  }

  return (
    <div className='flex flex-col gap-8'>
      <h1 className='text-xl font-semibold tracking-wider'>{check.name || '<check-name>'}</h1>
      <div className='grid grid-cols-1 gap-8 @[1000px]:grid-cols-2 @[1400px]:grid-cols-3 @[1400px]:gap-14'>
        {check.questions.map((question) => (
          <DisplayQuestion key={question.id} {...question} />
        ))}
      </div>
    </div>
  )
}
