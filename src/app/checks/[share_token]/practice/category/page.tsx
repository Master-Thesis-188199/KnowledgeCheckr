import { PracticeCategorySelection } from '@/src/components/checks/[share_token]/practice/PracticeCategorySelection'
import PageHeading from '@/src/components/Shared/PageHeading'

export default async function PracticeCategoryPage() {
  return (
    <>
      <PageHeading title='Choose Category Questions' />
      <PracticeCategorySelection />
    </>
  )
}
