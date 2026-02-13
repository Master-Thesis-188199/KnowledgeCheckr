'use client'

import { InputHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

export default function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      placeholder='Enter some text'
      {...props}
      className={twMerge(
        'rounded-md bg-neutral-100/90 px-3 py-1.5 text-neutral-600 ring-1 ring-input-ring outline-none placeholder:text-neutral-400/90 dark:bg-neutral-800 dark:text-neutral-300/80 dark:placeholder:text-neutral-400/50',
        'enabled:hover:cursor-text enabled:hover:ring-ring-hover enabled:focus:ring-[1.2px] enabled:focus:ring-ring-focus dark:enabled:hover:ring-ring-hover dark:enabled:focus:ring-ring-focus',
        'disabled:cursor-not-allowed disabled:ring-ring-subtle',
        props.className,
      )}
    />
  )
}
