import { instantiateKnowledgeCheck, KnowledgeCheck } from '@/src/schemas/KnowledgeCheck'

export default async function ChecksPage() {
  const checks = Array.from({ length: 4 }).map(() => instantiateKnowledgeCheck())

  return (
    <main>
      <h1 className='mb-8 text-[22px] font-semibold tracking-wider'>Your Checks</h1>
      <div className='checks-grid grid grid-cols-1 gap-4 @[800px]:grid-cols-2 @[1200px]:grid-cols-3'>
        {checks.map((check, i) => (
          <RenderCheck key={i} {...check} />
        ))}
      </div>
    </main>
  )
}

function RenderCheck(props: KnowledgeCheck) {
  return (
    <div className='relative flex flex-col gap-2 rounded-md bg-neutral-200/60 p-4 ring-1 ring-neutral-400/60 hover:cursor-pointer hover:bg-neutral-300/50 hover:ring-2 hover:ring-neutral-400/80 dark:bg-neutral-700/40 dark:ring-neutral-600 dark:hover:bg-neutral-700 dark:hover:ring-neutral-500'>
      <div className='absolute top-0 right-0 rounded-bl-2xl bg-neutral-400/30 pt-1 pr-1 pb-1.5 pl-2 text-sm tracking-wide dark:bg-blue-600/40'>#{props.id}</div>
      <div className='check-header flex items-center justify-between gap-2 border-b border-b-neutral-400/60 pb-2 dark:border-b-neutral-500'>
        <span>{props.name}</span>
      </div>
      <div className='flex flex-col gap-2 text-neutral-500 dark:text-neutral-400'>
        <div className='flex gap-4'>
          <span className='text-neutral-700 dark:text-neutral-300'>Name: </span>
          <span>{props.description}</span>
        </div>
        <div className='flex gap-4'>
          <span className='text-neutral-700 dark:text-neutral-300'>Questions: </span>
          <span>{props.questions.length}</span>
        </div>
      </div>
    </div>
  )
}
