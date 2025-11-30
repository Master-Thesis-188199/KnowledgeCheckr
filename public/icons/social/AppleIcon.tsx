import Image from 'next/image'
import ApplePng from '@/public/ApplePng.png'
export default function AppleIcon() {
  return <Image src={ApplePng} height={24} className='dark:invert-[60%]' alt='Apple icon' width={24} />
}
