import React, { useEffect } from 'react'
import { useStoreFavicon } from '../contexts/StoreSettingsContext'

export function DynamicFavicon() {
  const faviconUrl = useStoreFavicon()
  
  useEffect(() => {
    if (faviconUrl) {
      // Get the existing favicon element or create a new one
      let link = document.querySelector('link[rel="icon"]') as HTMLLinkElement
      
      if (!link) {
        link = document.createElement('link')
        link.rel = 'icon'
        document.head.appendChild(link)
      }
      
      // Update the favicon URL
      link.href = faviconUrl
      
      // Also update apple-touch-icon for iOS devices
      let appleLink = document.querySelector('link[rel="apple-touch-icon"]') as HTMLLinkElement
      
      if (!appleLink) {
        appleLink = document.createElement('link')
        appleLink.rel = 'apple-touch-icon'
        document.head.appendChild(appleLink)
      }
      
      appleLink.href = faviconUrl
    }
  }, [faviconUrl])
  
  return null
}