import { useNavigationAbort } from '@/src/components/navigation-abortion/NavigationAbortProvider'
import NextLink, { LinkProps } from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useCallback, type MouseEvent } from 'react'

/**
 * This component wraps the next/Link component and allows navigation-abortion by checking whether the navigationAbortion is enabled.
 */
export default function Link({ onClick, href, children, ...nextLinkProps }: LinkProps & { children?: React.ReactNode }) {
  const nextRouter = useRouter()
  const { isNavigationAbortSet, showNavigationAbortModal } = useNavigationAbort()

  const handleLinkClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()

      if (onClick) {
        onClick(e)
      }

      if (isNavigationAbortSet) {
        showNavigationAbortModal(href.toString())
      } else {
        nextRouter.push(href.toString())
      }
    },
    [isNavigationAbortSet, href, nextRouter, onClick, showNavigationAbortModal],
  )

  return (
    <NextLink href={href} onClick={handleLinkClick} {...nextLinkProps}>
      {children}
    </NextLink>
  )
}
