// Google Tag Manager tracking utility
// Handles Google Analytics and Google Ads tracking events

import { supabase } from './supabase'

// Google Analytics 4 event types
export type GAEventType = 
  | 'page_view'
  | 'view_item'
  | 'add_to_cart'
  | 'remove_from_cart'
  | 'begin_checkout'
  | 'purchase'
  | 'search'
  | 'sign_up'
  | 'login'
  | 'generate_lead'
  | 'view_item_list'
  | 'select_item'

// Event parameters for Google Analytics 4
export interface GAEventParams {
  currency?: string
  value?: number
  transaction_id?: string
  item_id?: string
  item_name?: string
  item_category?: string
  item_category2?: string
  item_category3?: string
  item_category4?: string
  item_category5?: string
  item_list_id?: string
  item_list_name?: string
  item_variant?: string
  location_id?: string
  price?: number
  quantity?: number
  coupon?: string
  discount?: number
  affiliation?: string
  payment_type?: string
  shipping?: number
  tax?: number
  items?: GAItem[]
  search_term?: string
  method?: string
  content_type?: string
  item_brand?: string
  promotion_id?: string
  promotion_name?: string
  creative_name?: string
  creative_slot?: string
  [key: string]: any
}

// Item structure for enhanced ecommerce
export interface GAItem {
  item_id: string
  item_name: string
  affiliation?: string
  coupon?: string
  currency?: string
  discount?: number
  index?: number
  item_brand?: string
  item_category?: string
  item_category2?: string
  item_category3?: string
  item_category4?: string
  item_category5?: string
  item_list_id?: string
  item_list_name?: string
  item_variant?: string
  location_id?: string
  price?: number
  promotion_id?: string
  promotion_name?: string
  quantity?: number
}

// GTM settings
interface GTMSettings {
  container_id: string
  ga_measurement_id: string
  google_ads_conversion_id?: string
  google_ads_conversion_label?: string
  enabled: boolean
}

// Get GTM settings from store settings
export async function getGTMSettings(): Promise<GTMSettings | null> {
  try {
    const { data, error } = await supabase.rpc('get_store_settings')
    
    if (error || !data || data.length === 0) {
      console.warn('No store settings found for GTM tracking')
      return null
    }
    
    const settings = data[0]
    
    if (!settings.gtm_container_id || !settings.gtm_enabled) {
      console.warn('Google Tag Manager not configured or disabled')
      return null
    }
    
    return {
      container_id: settings.gtm_container_id,
      ga_measurement_id: settings.ga_measurement_id || '',
      google_ads_conversion_id: settings.google_ads_conversion_id || '',
      google_ads_conversion_label: settings.google_ads_conversion_label || '',
      enabled: settings.gtm_enabled
    }
  } catch (error) {
    console.error('Error fetching GTM settings:', error)
    return null
  }
}

// Initialize Google Tag Manager
export async function initializeGTM(): Promise<boolean> {
  try {
    const settings = await getGTMSettings()
    
    if (!settings || typeof window === 'undefined') {
      return false
    }
    
    // Check if GTM is already loaded
    if (window.dataLayer && typeof window.gtag === 'function') {
      console.log('GTM already initialized')
      return true
    }
    
    // Initialize dataLayer
    window.dataLayer = window.dataLayer || []
    
    // Define gtag function
    window.gtag = function() {
      window.dataLayer.push(Array.from(arguments))
    }
    
    // Configure gtag
    window.gtag('js', new Date())
    
    // Configure Google Analytics if measurement ID is provided
    if (settings.ga_measurement_id) {
      window.gtag('config', settings.ga_measurement_id, {
        send_page_view: false // We'll handle page views manually
      })
    }
    
    // Configure Google Ads if conversion ID is provided
    if (settings.google_ads_conversion_id) {
      window.gtag('config', settings.google_ads_conversion_id)
    }
    
    // Load GTM script
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${settings.container_id}`
    document.head.appendChild(script)
    
    console.log('GTM initialized successfully')
    return true
  } catch (error) {
    console.error('Error initializing GTM:', error)
    return false
  }
}

// Send event to Google Analytics via gtag
export function sendGAEvent(eventName: GAEventType, parameters: GAEventParams = {}): boolean {
  try {
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
      console.warn('gtag not available, skipping event:', eventName)
      return false
    }
    
    window.gtag('event', eventName, parameters)
    console.log('GA event sent:', eventName, parameters)
    return true
  } catch (error) {
    console.error('Error sending GA event:', error)
    return false
  }
}

// Send conversion event to Google Ads
export async function sendGoogleAdsConversion(
  conversionLabel?: string,
  value?: number,
  currency: string = 'USD',
  transactionId?: string
): Promise<boolean> {
  try {
    const settings = await getGTMSettings()
    
    if (!settings || !settings.google_ads_conversion_id) {
      console.warn('Google Ads conversion tracking not configured')
      return false
    }
    
    if (typeof window === 'undefined' || typeof window.gtag !== 'function') {
      console.warn('gtag not available for conversion tracking')
      return false
    }
    
    const label = conversionLabel || settings.google_ads_conversion_label
    
    if (!label) {
      console.warn('No conversion label provided for Google Ads conversion')
      return false
    }
    
    const conversionData: Record<string, unknown> = {
      send_to: `${settings.google_ads_conversion_id}/${label}`
    }
    
    if (value !== undefined) {
      conversionData.value = value
      conversionData.currency = currency
    }
    
    if (transactionId) {
      conversionData.transaction_id = transactionId
    }
    
    window.gtag('event', 'conversion', conversionData)
    console.log('Google Ads conversion sent:', conversionData)
    return true
  } catch (error) {
    console.error('Error sending Google Ads conversion:', error)
    return false
  }
}

// Track page view
export function trackPageView(pageTitle?: string, pagePath?: string): boolean {
  const parameters: GAEventParams = {}
  
  if (pageTitle) {
    parameters.page_title = pageTitle
  }
  
  if (pagePath) {
    parameters.page_location = pagePath
  }
  
  return sendGAEvent('page_view', parameters)
}

// Track product view
export function trackViewItem(
  itemId: string,
  itemName: string,
  category: string,
  value: number,
  currency: string = 'USD',
  brand?: string
): boolean {
  const item: GAItem = {
    item_id: itemId,
    item_name: itemName,
    item_category: category,
    price: value,
    quantity: 1
  }
  
  if (brand) {
    item.item_brand = brand
  }
  
  return sendGAEvent('view_item', {
    currency,
    value,
    items: [item]
  })
}

// Track add to cart
export function trackAddToCart(
  itemId: string,
  itemName: string,
  category: string,
  value: number,
  quantity: number = 1,
  currency: string = 'USD',
  brand?: string
): boolean {
  const item: GAItem = {
    item_id: itemId,
    item_name: itemName,
    item_category: category,
    price: value,
    quantity
  }
  
  if (brand) {
    item.item_brand = brand
  }
  
  return sendGAEvent('add_to_cart', {
    currency,
    value: value * quantity,
    items: [item]
  })
}

// Track remove from cart
export function trackRemoveFromCart(
  itemId: string,
  itemName: string,
  category: string,
  value: number,
  quantity: number = 1,
  currency: string = 'USD',
  brand?: string
): boolean {
  const item: GAItem = {
    item_id: itemId,
    item_name: itemName,
    item_category: category,
    price: value,
    quantity
  }
  
  if (brand) {
    item.item_brand = brand
  }
  
  return sendGAEvent('remove_from_cart', {
    currency,
    value: value * quantity,
    items: [item]
  })
}

// Track begin checkout
export function trackBeginCheckout(
  items: GAItem[],
  value: number,
  currency: string = 'USD',
  coupon?: string
): boolean {
  const parameters: GAEventParams = {
    currency,
    value,
    items
  }
  
  if (coupon) {
    parameters.coupon = coupon
  }
  
  return sendGAEvent('begin_checkout', parameters)
}

// Track purchase
export async function trackPurchase(
  transactionId: string,
  items: GAItem[],
  value: number,
  currency: string = 'USD',
  tax?: number,
  shipping?: number,
  coupon?: string,
  affiliation?: string
): Promise<boolean> {
  const parameters: GAEventParams = {
    transaction_id: transactionId,
    currency,
    value,
    items
  }
  
  if (tax !== undefined) {
    parameters.tax = tax
  }
  
  if (shipping !== undefined) {
    parameters.shipping = shipping
  }
  
  if (coupon) {
    parameters.coupon = coupon
  }
  
  if (affiliation) {
    parameters.affiliation = affiliation
  }
  
  // Send GA purchase event
  const gaSuccess = sendGAEvent('purchase', parameters)
  
  // Send Google Ads conversion
  const adsSuccess = await sendGoogleAdsConversion(undefined, value, currency, transactionId)
  
  return gaSuccess
}

// Track search
export function trackSearch(searchTerm: string): boolean {
  return sendGAEvent('search', {
    search_term: searchTerm
  })
}

// Track sign up
export function trackSignUp(method?: string): boolean {
  const parameters: GAEventParams = {}
  
  if (method) {
    parameters.method = method
  }
  
  return sendGAEvent('sign_up', parameters)
}

// Track login
export function trackLogin(method?: string): boolean {
  const parameters: GAEventParams = {}
  
  if (method) {
    parameters.method = method
  }
  
  return sendGAEvent('login', parameters)
}

// Track lead generation
export function trackGenerateLead(
  value?: number,
  currency: string = 'USD',
  contentType?: string
): boolean {
  const parameters: GAEventParams = {}
  
  if (value !== undefined) {
    parameters.value = value
    parameters.currency = currency
  }
  
  if (contentType) {
    parameters.content_type = contentType
  }
  
  return sendGAEvent('generate_lead', parameters)
}

// Track item list view
export function trackViewItemList(
  items: GAItem[],
  listId?: string,
  listName?: string
): boolean {
  const parameters: GAEventParams = {
    items
  }
  
  if (listId) {
    parameters.item_list_id = listId
  }
  
  if (listName) {
    parameters.item_list_name = listName
  }
  
  return sendGAEvent('view_item_list', parameters)
}

// Track item selection
export function trackSelectItem(
  itemId: string,
  itemName: string,
  category: string,
  listId?: string,
  listName?: string,
  index?: number
): boolean {
  const item: GAItem = {
    item_id: itemId,
    item_name: itemName,
    item_category: category
  }
  
  if (listId) {
    item.item_list_id = listId
  }
  
  if (listName) {
    item.item_list_name = listName
  }
  
  if (index !== undefined) {
    item.index = index
  }
  
  return sendGAEvent('select_item', {
    items: [item]
  })
}

// Utility function to test GTM connection
export async function testGTMConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const settings = await getGTMSettings()
    
    if (!settings) {
      return {
        success: false,
        message: 'GTM settings not configured. Please add Container ID and enable GTM.'
      }
    }
    
    if (typeof window === 'undefined') {
      return {
        success: false,
        message: 'GTM can only be tested in browser environment.'
      }
    }
    
    // Initialize GTM if not already done
    const initialized = await initializeGTM()
    
    if (!initialized) {
      return {
        success: false,
        message: 'Failed to initialize GTM. Please check your settings.'
      }
    }
    
    // Send a test event
    const testSuccess = trackPageView('Test Page', '/test')
    
    return {
      success: testSuccess,
      message: testSuccess 
        ? 'GTM connection successful! Test event sent.' 
        : 'GTM initialized but failed to send test event.'
    }
  } catch (error) {
    return {
      success: false,
      message: `GTM connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`
    }
  }
}

// Declare global gtag function for TypeScript
declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (command: string, ...args: unknown[]) => void
  }
}