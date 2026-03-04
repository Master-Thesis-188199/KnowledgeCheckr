'use client'

import DE from 'country-flag-icons/react/3x2/DE'
import US from 'country-flag-icons/react/3x2/US'
import { FileQuestionIcon } from 'lucide-react'
import { Button } from '@/src/components/shadcn/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/src/components/shadcn/dropdown-menu'
import { useChangeLocale, useCurrentLocale } from '@/src/i18n/client-localization'
import { i18nLocale, locales } from '@/src/i18n/i18nConfig'

export default function LanguageSwitcher() {
  const currentLocale = useCurrentLocale()
  const { Icon } = useLocale(currentLocale, 'size-6')

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-label='change app language' className='flex size-auto items-center p-1' variant='ghost' size='icon'>
          {Icon}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent sideOffset={10} className={'w-32 p-2 text-sm'}>
        {locales.map((locale) => (
          <LocaleItem locale={locale} key={locale} />
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function LocaleItem({ locale }: { locale: i18nLocale }) {
  const { Icon, long } = useLocale(locale)
  const changeLocale = useChangeLocale()

  return (
    <DropdownMenuItem onClick={() => changeLocale(locale)} className='flex h-9 items-center gap-2.5 px-4 py-2 capitalize *:[svg]:size-5'>
      {Icon}
      <span>{long}</span>
    </DropdownMenuItem>
  )
}

function useLocale(locale: i18nLocale, defaultIconClass = 'size-5') {
  switch (locale) {
    case 'en':
      return { Icon: <US title='United States' className={defaultIconClass} />, short: locale, long: 'English' }
    case 'de':
      return { Icon: <DE title='German' className={defaultIconClass} />, short: locale, long: 'German' }
    default:
      return { Icon: <FileQuestionIcon className={defaultIconClass} />, short: locale, long: 'Unknown' }
  }
}
