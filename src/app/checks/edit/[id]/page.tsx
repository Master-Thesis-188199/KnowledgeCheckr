import { getKnowledgeCheckById } from '@/database/knowledgeCheck/select'
import GeneralSection from '@/src/app/checks/create/GeneralSection'
import QuestionsSection from '@/src/app/checks/create/QuestionsSection'
import { SaveCreateCheckButton } from '@/src/app/checks/create/SaveCheckButton'
import { CreateCheckStoreProvider } from '@/src/components/check/create/CreateCheckProvider'
import Card from '@/src/components/Shared/Card'
import PageHeading from '@/src/components/Shared/PageHeading'
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
    <CreateCheckStoreProvider initialStoreProps={check}>
      <PageHeading title={check.name} />
      <div className='columns-xl gap-12 space-y-12'>
        <GeneralSection />
        <Card disableHoverStyles className='break-inside-avoid'>
          <h2 className='text-lg'>Settings</h2>
          <div className='h-[500px]'></div>
        </Card>
        <QuestionsSection />
        <Card className='h-60 break-inside-avoid' children={<></>} disableHoverStyles></Card>
      </div>
      <form className='mt-4 flex justify-center gap-2'>
        <SaveCreateCheckButton />
      </form>
      <div />
    </CreateCheckStoreProvider>
  )
}
