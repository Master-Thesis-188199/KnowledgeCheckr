'use client'

import React, { ElementType } from 'react'
import { useMultiStageStore } from '@/src/components/Shared/MultiStageProgress/MultiStageStoreProvider'
import { cn } from '@/src/lib/Shared/utils'

type WrapperProps<T extends React.ElementType> = {
  as?: T
  children: React.ReactNode
  stage: number
} & React.ComponentPropsWithoutRef<T>

type Props<T extends React.ElementType = 'div'> = WrapperProps<T>

export function MutliStageRenderer<C extends ElementType = 'div'>({ children, stage, as, className, ...rest }: Props<C>) {
  const { stage: currentStage } = useMultiStageStore((store) => store)
  const Component = (as ?? 'div') as ElementType

  if (Component === React.Fragment) {
    return <>{children}</>
  }

  if (currentStage !== stage) return null

  return (
    <Component className={cn(currentStage !== stage && 'hidden', className)} {...rest}>
      {children}
    </Component>
  )
}
