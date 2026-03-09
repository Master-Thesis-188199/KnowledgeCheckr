import ShareTokenOTP from '@/src/components/checks/start/ShareTokenOTP'
import Card from '@/src/components/Shared/Card'
import PageHeading from '@/src/components/Shared/PageHeading'

export default async function StartCheckPage() {
  return (
    <>
      <PageHeading title='Start your practice / exam journey' />

      {/* // todo ensure max-w is a either 50vw or 300 px for small screens */}
      <Card className='mx-auto flex w-full max-w-[50vw] flex-col justify-center gap-6 px-6 py-4' disableInteractions>
        <h2 className='mb-4 text-center font-semibold'>Find KnowledgeCheck by share-token</h2>

        <ShareTokenOTP />
      </Card>
    </>
  )
}
