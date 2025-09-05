import { supabase } from './supabase'

export interface StoreSettings {
  id?: string
  store_name: string
  store_description?: string
  store_email?: string
  store_phone?: string
  store_whatsapp?: string
  store_address?: string
  logo_url?: string
  logo_storage_path?: string
  favicon_url?: string
  favicon_storage_path?: string
  currency: string
  facebook_url?: string
  instagram_url?: string
  twitter_url?: string
  linkedin_url?: string
  youtube_url?: string
  tiktok_url?: string
  privacy_policy?: string
  terms_of_service?: string
  return_policy?: string
  shipping_policy?: string
  theme_primary_color?: string
  theme_secondary_color?: string
  theme_accent_color?: string
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface StoreSettingsFormData {
  store_name: string
  store_description: string
  store_email: string
  store_phone: string
  store_whatsapp: string
  store_address: string
  currency: string
  favicon_url: string
  facebook_url: string
  instagram_url: string
  twitter_url: string
  linkedin_url: string
  youtube_url: string
  tiktok_url: string
  privacy_policy: string
  terms_of_service: string
  return_policy: string
  shipping_policy: string
  theme_primary_color: string
  theme_secondary_color: string
  theme_accent_color: string
}

export const CURRENCY_OPTIONS = [
  { value: 'USD', label: 'USD ($)', symbol: '$' },
  { value: 'EUR', label: 'EUR (€)', symbol: '€' },
  { value: 'GBP', label: 'GBP (£)', symbol: '£' },
  { value: 'JPY', label: 'JPY (¥)', symbol: '¥' },
  { value: 'BDT', label: 'BDT (৳)', symbol: '৳' },
  { value: 'INR', label: 'INR (₹)', symbol: '₹' },
  { value: 'CAD', label: 'CAD (C$)', symbol: 'C$' },
  { value: 'AUD', label: 'AUD (A$)', symbol: 'A$' },
]

// Get current store settings
export async function getStoreSettings(): Promise<StoreSettings | null> {
  try {
    const { data, error } = await supabase
      .from('store_settings')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') {
      console.error('Error fetching store settings:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error fetching store settings:', error)
    return null
  }
}

// Update store settings
export async function updateStoreSettings(settings: Partial<StoreSettings>): Promise<StoreSettings | null> {
  try {
    // First, get the current settings
    const currentSettings = await getStoreSettings()
    
    if (currentSettings) {
      // Update existing settings
      const { data, error } = await supabase
        .from('store_settings')
        .update({
          ...settings,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentSettings.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating store settings:', error)
        return null
      }

      return data
    } else {
      // Create new settings
      const { data, error } = await supabase
        .from('store_settings')
        .insert({
          ...settings,
          is_active: true
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating store settings:', error)
        return null
      }

      return data
    }
  } catch (error) {
    console.error('Error updating store settings:', error)
    return null
  }
}

// Upload store logo
export async function uploadStoreLogo(file: File): Promise<{ url: string; path: string } | null> {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `logo-${Date.now()}.${fileExt}`
    const filePath = `logos/${fileName}`

    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from('store-logos')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Error uploading logo:', uploadError)
      return null
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('store-logos')
      .getPublicUrl(filePath)

    return {
      url: publicUrl,
      path: filePath
    }
  } catch (error) {
    console.error('Error uploading logo:', error)
    return null
  }
}

// Upload store favicon
export async function uploadStoreFavicon(file: File): Promise<{ url: string; path: string } | null> {
  try {
    const fileExt = file.name.split('.').pop()
    const fileName = `favicon-${Date.now()}.${fileExt}`
    const filePath = `favicons/${fileName}`

    // Upload file to storage
    const { error: uploadError } = await supabase.storage
      .from('store-logos') // Using the same bucket as logos
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      })

    if (uploadError) {
      console.error('Error uploading favicon:', uploadError)
      return null
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('store-logos')
      .getPublicUrl(filePath)

    return {
      url: publicUrl,
      path: filePath
    }
  } catch (error) {
    console.error('Error uploading favicon:', error)
    return null
  }
}

// Delete store logo
export async function deleteStoreLogo(path: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from('store-logos')
      .remove([path])

    if (error) {
      console.error('Error deleting logo:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deleting logo:', error)
    return false
  }
}

// Delete store favicon
export async function deleteStoreFavicon(path: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from('store-logos') // Using the same bucket as logos
      .remove([path])

    if (error) {
      console.error('Error deleting favicon:', error)
      return false
    }

    return true
  } catch (error) {
    console.error('Error deleting favicon:', error)
    return false
  }
}

// Get currency symbol by currency code
export function getCurrencySymbol(currencyCode: string): string {
  const currency = CURRENCY_OPTIONS.find(c => c.value === currencyCode)
  return currency?.symbol || '$'
}

// Format price with currency
export function formatPrice(amount: number, currencyCode: string = 'USD'): string {
  const symbol = getCurrencySymbol(currencyCode)
  return `${symbol}${amount.toFixed(2)}`
}