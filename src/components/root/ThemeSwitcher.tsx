'use client'

import { useEffect, useState } from 'react'
import { Transition } from '@headlessui/react'
import { MoonIcon, SunIcon } from '@heroicons/react/24/outline'
import { parseCookies, setCookie } from 'nookies'
import { twMerge } from 'tailwind-merge'
import { useRootStore } from '@/components/root/RootStoreProvider'

type ThemeOption = 'light' | 'dark' | undefined

export default function ThemeSwitcher() {
  const { theme_cookie: defaultValue } = useRootStore((state) => state)
  const { theme, toggleTheme } = ThemeHandler(defaultValue)
  const Icon = theme === 'light' ? SunIcon : MoonIcon

  return (
    <div className='hover:cursor-pointer' onClick={toggleTheme}>
      {/* Fills the space that is otherwise taken by the Switcher Icon, while no theme is set  */}
      <div className={twMerge('size-6', !!theme && 'hidden')} />
      <Transition show={theme === 'light'} enter='transition duration-300' enterFrom='rotate-45 opacity-50' enterTo='rotate-0 opacity-100' leave='hidden'>
        <Icon className={twMerge('size-6', theme === 'dark' && 'hidden')} />
      </Transition>

      <Transition show={theme === 'dark'} enter='transition duration-300' enterFrom='-rotate-45 opacity-50' enterTo='rotate-0 opacity-100' leave='hidden'>
        <Icon className={twMerge('size-6', theme === 'light' && 'hidden')} />
      </Transition>
    </div>
  )
}

function ThemeHandler(defaultValue: ThemeOption) {
  const [theme, setTheme] = useState<ThemeOption>(defaultValue)
  const toggleTheme = () => setTheme(theme === 'light' ? 'dark' : 'light')

  useEffect(() => {
    if (!theme) return

    document.documentElement.dataset.theme = theme
    setCookie(null, 'theme', theme, {
      maxAge: 24 * 60 * 60 * 300, // 300 days
      path: '/',
      secure: false,
      sameSite: true,
    })
  }, [theme])

  useEffect(() => {
    const userPreference: NonNullable<ThemeOption> = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'

    const cookies = parseCookies()
    const theme = cookies.theme

    //? Sets theme based on user's preference when no cookie is set
    if (!theme) {
      document.documentElement.dataset.theme = userPreference || 'dark'
      setTheme(userPreference)
      return
    }

    setTheme(theme === 'light' ? 'light' : 'dark')
  }, [])

  return { theme, toggleTheme }
}
