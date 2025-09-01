import Link from 'next/link'

export default async function Unauthorized() {
  return (
    <div className='flex h-full flex-col items-center justify-center'>
      <div className='flex items-center gap-4'>
        <div className='flex h-12 items-center justify-center border-r-[0.5px] border-black pr-4 text-xl font-semibold dark:border-gray-500'>401</div>
        <h1>You&apos;re not authorized to access this page.</h1>
      </div>
      <Link className='mt-8 rounded-md px-3 py-1.5 ring-1 dark:bg-neutral-800 dark:ring-neutral-600 dark:hover:bg-neutral-700' href={'/account/login?type=signin'}>
        Login
      </Link>
    </div>
  )
}
