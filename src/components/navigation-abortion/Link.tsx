import React, { type MouseEvent, useCallback } from 'react'
import NextLink, { LinkProps } from 'next/link'
import { useRouter } from 'next/navigation'
import { useNavigationAbort } from '@/src/components/navigation-abortion/NavigationAbortProvider'

/**
 * This component wraps the next/Link component and allows navigation-abortion by checking whether the navigationAbortion is enabled.
 */
export default function Link({ onClick, href, children, onNavigate, ...nextLinkProps }: LinkProps & { children?: React.ReactNode }) {
  const nextRouter = useRouter()
  const { isNavigationAbortSet, showNavigationAbortModal } = useNavigationAbort()

  const handleLinkClick = useCallback(
    (e: MouseEvent<HTMLAnchorElement>) => {
      e.preventDefault()

      if (onClick) {
        onClick(e)
      } else if (onNavigate) {
        onNavigate(e)
      }

      // Prevents display of modal when trying to navigate to same page (which does not trigger a "redirect" / navigation)
      if (window.location.pathname === href.toString()) return

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
