'use client'

import { useEffect } from 'react'

export function ActiveDelimiter() {
  const CONTENT_DELIMITER = 'main-content'

  useEffect(() => {
    const desktopSidebar = document.querySelector('#desktop-sidebar-container')
    const mobileSidebar = document.querySelector('#mobile-sidebar-menubar')

    const isDesktopActive = () => (desktopSidebar?.parentElement ? window.getComputedStyle(desktopSidebar.parentElement).getPropertyValue('display') !== 'none' : false)
    const isMobileActive = () => (mobileSidebar?.parentElement ? window.getComputedStyle(mobileSidebar.parentElement).getPropertyValue('display') !== 'none' : false)

    if (isDesktopActive()) desktopSidebar?.setAttribute(CONTENT_DELIMITER, 'true')
    else desktopSidebar?.removeAttribute(CONTENT_DELIMITER)

    if (isMobileActive()) mobileSidebar?.setAttribute(CONTENT_DELIMITER, 'true')
    else mobileSidebar?.removeAttribute(CONTENT_DELIMITER)
  })

  return null
}
