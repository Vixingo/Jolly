import  { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { getStoreSettings, type StoreSettings } from '../lib/store-settings'
import { applyThemeColors, DEFAULT_THEME_COLORS } from '../lib/theme-utils'

interface StoreSettingsContextType {
  storeSettings: StoreSettings | null
  isLoading: boolean
  refreshStoreSettings: () => Promise<void>
}

const StoreSettingsContext = createContext<StoreSettingsContextType | undefined>(undefined)

interface StoreSettingsProviderProps {
  children: ReactNode
}

export function StoreSettingsProvider({ children }: StoreSettingsProviderProps) {
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const loadStoreSettings = async () => {
    try {
      setIsLoading(true)
      const settings = await getStoreSettings()
      setStoreSettings(settings)
      
      // Apply theme colors if available
      if (settings) {
        applyThemeColors({
          primary: settings.theme_primary_color || DEFAULT_THEME_COLORS.primary,
          secondary: settings.theme_secondary_color || DEFAULT_THEME_COLORS.secondary,
          accent: settings.theme_accent_color || DEFAULT_THEME_COLORS.accent
        })
      }
    } catch (error) {
      console.error('Error loading store settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const refreshStoreSettings = async () => {
    await loadStoreSettings()
  }

  useEffect(() => {
    loadStoreSettings()
  }, [])

  const value: StoreSettingsContextType = {
    storeSettings,
    isLoading,
    refreshStoreSettings
  }

  return (
    <StoreSettingsContext.Provider value={value}>
      {children}
    </StoreSettingsContext.Provider>
  )
}

export function useStoreSettings() {
  const context = useContext(StoreSettingsContext)
  if (context === undefined) {
    throw new Error('useStoreSettings must be used within a StoreSettingsProvider')
  }
  return context
}

// Helper hooks for common store settings
export function useStoreName() {
  const { storeSettings } = useStoreSettings()
  return storeSettings?.store_name || 'Jolly Store'
}

export function useStoreLogo() {
  const { storeSettings } = useStoreSettings()
  return storeSettings?.logo_url || null
}

export function useStoreFavicon() {
  const { storeSettings } = useStoreSettings()
  return storeSettings?.favicon_url || null
}

export function useStoreContact() {
  const { storeSettings } = useStoreSettings()
  return {
    email: storeSettings?.store_email || '',
    phone: storeSettings?.store_phone || '',
    whatsapp: storeSettings?.store_whatsapp || '',
    address: storeSettings?.store_address || ''
  }
}

export function useStoreSocialLinks() {
  const { storeSettings } = useStoreSettings()
  return {
    facebook: storeSettings?.facebook_url || '',
    instagram: storeSettings?.instagram_url || '',
    twitter: storeSettings?.twitter_url || '',
    linkedin: storeSettings?.linkedin_url || '',
    youtube: storeSettings?.youtube_url || '',
    tiktok: storeSettings?.tiktok_url || ''
  }
}

export function useStorePolicies() {
  const { storeSettings } = useStoreSettings()
  return {
    privacy: storeSettings?.privacy_policy || '',
    terms: storeSettings?.terms_of_service || '',
    return: storeSettings?.return_policy || '',
    shipping: storeSettings?.shipping_policy || ''
  }
}

export function useStoreCurrency() {
  const { storeSettings } = useStoreSettings()
  return storeSettings?.currency || 'USD'
}