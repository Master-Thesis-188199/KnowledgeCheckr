import ShareTokenFormContext from '@/src/components/checks/start/ShareTokenFormContext'
import { ShareTokenInput } from '@/src/components/checks/start/ShareTokenInput'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/shadcn/card'
import PageHeading from '@/src/components/Shared/PageHeading'

export default async function StartCheckPage() {
  return (
    <>
      <PageHeading title='Start your practice / exam journey' />

      {/* // todo ensure max-w is a either 50vw or 300 px for small screens */}
      <Card className='mx-auto w-full max-w-2xl'>
        <CardHeader className='border-b'>
          <CardTitle>Find KnowledgeCheck by share-token</CardTitle>
          <CardDescription>Provide a given share-token to begin practice / examination.</CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col gap-6'>
          <ShareTokenFormContext>
            <ShareTokenInput />
          </ShareTokenFormContext>
        </CardContent>
      </Card>
    </>
  )
}
