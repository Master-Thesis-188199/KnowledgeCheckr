import { User } from 'better-auth'
import { UserRound } from 'lucide-react'
import Image from 'next/image'
import { twMerge } from 'tailwind-merge'
import { SidebarElement } from '@/components/root/Navigation/elements/RenderSideBarItems'
import { iconClasses } from '@/components/root/Navigation/SideBarConfiguration'
import { InitialsIcon } from '@/src/components/Shared/InitialsIcon'
import { getServerSession } from '@/src/lib/auth/server'
export default async function SidebarUserBanner() {
  const session = await getServerSession()

  if (!session || !session.user) return LoginBanner()

  return (
    <SidebarElement icon={UserAvatar({ user: session.user })} href={'/account'}>
      {session.user?.name}
    </SidebarElement>
  )
}

function LoginBanner() {
  return (
    <SidebarElement href='/account/login' icon={<UserRound className={iconClasses} />}>
      <span>Please Sign In</span>
    </SidebarElement>
  )
}

export function UserAvatar({ user: { image, name }, className }: { user: User; className?: string }) {
  if (!image) return <InitialsIcon name={encodeURI(name)} className={twMerge(iconClasses, 'rounded-full', className)} />

  return <Image src={image} aria-label='user avatar' alt='User Avatar' height={128} width={128} className={twMerge(iconClasses, 'rounded-full', className)} />
}
