import { twMerge } from 'tailwind-merge'

export default async function PageHeading({ title, className }: { title: string; className?: string }) {
  return <h1 className={twMerge('mb-8 text-[22px] font-semibold tracking-wider', className)}>{title}</h1>
}
