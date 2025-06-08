import Image from 'next/image'
import { twMerge } from 'tailwind-merge'
export function InitialsIcon({
  name,
  className,
  size = 128,
  characterLength = 2,
  background = 'random',
  rounded = true,
}: {
  name: string
  className?: string
  size?: number
  characterLength?: number
  rounded?: boolean
  background?: 'random' | string
}) {
  return (
    <Image
      src={`https://ui-avatars.com/api/?name=${encodeURI(name)}&background=${background}&size=${size > 512 ? 512 : size}&length=${characterLength}&rounded=${rounded}`}
      unoptimized={true}
      className={twMerge(className)}
      alt={`initials for ${name}`}
      height={size}
      width={size}
    />
  )
}
