import ShareTokenFormContext from '@/src/components/courses/start/ShareTokenFormContext'
import { ShareTokenInput } from '@/src/components/courses/start/ShareTokenInput'
import ShareTokenOptions from '@/src/components/courses/start/ShareTokenOptions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/src/components/shadcn/card'
import PageHeading from '@/src/components/Shared/PageHeading'
import { getScopedI18n } from '@/src/i18n/server-localization'

export default async function StartCheckPage() {
  const t = await getScopedI18n('StartOptionsPage')

  return (
    <>
      <PageHeading title={t('title')} />

      <Card className='mx-auto w-full max-w-2xl'>
        <CardHeader className='border-b'>
          <CardTitle>{t('Card.title')}</CardTitle>
          <CardDescription>{t('Card.description')}</CardDescription>
        </CardHeader>
        <CardContent className='flex flex-col gap-6'>
          <ShareTokenFormContext>
            <ShareTokenInput />
            <ShareTokenOptions />
          </ShareTokenFormContext>
        </CardContent>
      </Card>
    </>
  )
}
