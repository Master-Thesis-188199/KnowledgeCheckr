import { getKnowledgeCheckById } from '@/database/knowledgeCheck/select'
import GeneralSection from '@/src/app/checks/create/GeneralSection'
import QuestionsSection from '@/src/app/checks/create/QuestionsSection'
import { SaveCreateCheckButton } from '@/src/app/checks/create/SaveCheckButton'
import SettingsSection from '@/src/app/checks/create/SettingsSection'
import { CreateCheckStoreProvider } from '@/src/components/check/create/CreateCheckProvider'
import Card from '@/src/components/Shared/Card'
import PageHeading from '@/src/components/Shared/PageHeading'
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
    <CreateCheckStoreProvider initialStoreProps={check}>
      <PageHeading title={check.name} />
      <div className='grid grid-cols-1 gap-8 lg:grid-cols-[repeat(auto-fill,minmax(780px,1fr))]'>
        <GeneralSection />
        <QuestionsSection />
        <SettingsSection />
        <Card className='h-60 break-inside-avoid' children={<></>} disableHoverStyles></Card>
      </div>
      <form className='mt-4 flex justify-center gap-2'>
        <SaveCreateCheckButton />
      </form>
      <div />
    </CreateCheckStoreProvider>
  )
}
