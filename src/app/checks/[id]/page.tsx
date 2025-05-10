import DisplayQuestion from '@/components/check/DisplayQuestion'
import { getKnowledgeCheckById } from '@/database/knowledgeCheck/select'
import { getServerSession } from '@/src/lib/auth/server'
import { notFound, unauthorized } from 'next/navigation'

export default async function CheckPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { user } = await getServerSession()

  if (!user) {
    unauthorized()
  }

  const check = await getKnowledgeCheckById(id)

  if (!check) {
    notFound()
  }

  return (
    <div className='flex flex-col gap-8'>
      <h1 className='text-xl font-semibold tracking-wider'>{check.name || '<check-name>'}</h1>
      <div className='grid grid-cols-1 gap-8 @[1000px]:grid-cols-2 @[1400px]:grid-cols-3 @[1400px]:gap-14'>
        {check.questions.map((question, i) => (
          <DisplayQuestion key={question.id} {...question} />
        ))}
      </div>
    </div>
  )
}
