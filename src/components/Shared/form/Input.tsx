'use client'

import { InputHTMLAttributes } from 'react'
import { twMerge } from 'tailwind-merge'

export default function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      placeholder='Enter some text'
      {...props}
      className={twMerge(
        'rounded-md bg-neutral-100/90 px-3 py-1.5 text-neutral-600 ring-1 ring-neutral-400 outline-none placeholder:text-neutral-400/90 hover:cursor-text hover:ring-neutral-500 focus:ring-[1.2px] focus:ring-neutral-600 dark:bg-neutral-800 dark:text-neutral-300/80 dark:ring-neutral-500 dark:placeholder:text-neutral-400/50 dark:hover:ring-neutral-300/60 dark:focus:ring-neutral-300/80',
        props.className,
      )}
    />
  )
}
