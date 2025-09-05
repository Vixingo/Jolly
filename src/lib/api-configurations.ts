import { supabase } from './supabase'

export interface ApiConfigurations {
  id?: string
  // Facebook Conversion API fields
  fb_api_version?: string
  fb_pixel_id?: string
  fb_access_token?: string
  fb_enabled?: boolean
  // Google Tag Manager and Analytics fields
  gtm_container_id?: string
  ga_measurement_id?: string
  google_ads_conversion_id?: string
  google_ads_conversion_label?: string
  gtm_enabled?: boolean
  // Pathao Courier Service fields
  pathao_client_id?: string
  pathao_client_secret?: string
  pathao_username?: string
  pathao_password?: string
  pathao_base_url?: string
  pathao_enabled?: boolean
  // RedX Courier Service fields
  redx_api_token?: string
  redx_base_url?: string
  redx_enabled?: boolean
  // Steadfast Courier Service fields
  stedfast_api_key?: string
  stedfast_secret_key?: string
  stedfast_base_url?: string
  stedfast_enabled?: boolean
  // SSLCOMMERZ Payment Gateway fields
  sslcommerz_store_id?: string
  sslcommerz_store_password?: string
  sslcommerz_sandbox_mode?: boolean
  sslcommerz_enabled?: boolean
  // bKash Payment Gateway fields
  bkash_app_key?: string
  bkash_app_secret?: string
  bkash_username?: string
  bkash_password?: string
  bkash_sandbox_mode?: boolean
  bkash_enabled?: boolean
  // Metadata
  is_active?: boolean
  created_at?: string
  updated_at?: string
}

export interface ApiConfigurationsFormData {
  // Facebook Conversion API fields
  fb_api_version: string
  fb_pixel_id: string
  fb_access_token: string
  fb_enabled: boolean
  // Google Tag Manager and Analytics fields
  gtm_container_id: string
  ga_measurement_id: string
  google_ads_conversion_id: string
  google_ads_conversion_label: string
  gtm_enabled: boolean
  // Pathao Courier Service fields
  pathao_client_id: string
  pathao_client_secret: string
  pathao_username: string
  pathao_password: string
  pathao_base_url: string
  pathao_enabled: boolean
  // RedX Courier Service fields
  redx_api_token: string
  redx_base_url: string
  redx_enabled: boolean
  // Steadfast Courier Service fields
  stedfast_api_key: string
  stedfast_secret_key: string
  stedfast_base_url: string
  stedfast_enabled: boolean
  // SSLCOMMERZ Payment Gateway fields
  sslcommerz_store_id: string
  sslcommerz_store_password: string
  sslcommerz_sandbox_mode: boolean
  sslcommerz_enabled: boolean
  // bKash Payment Gateway fields
  bkash_app_key: string
  bkash_app_secret: string
  bkash_username: string
  bkash_password: string
  bkash_sandbox_mode: boolean
  bkash_enabled: boolean
}

// Get current API configurations
export const getApiConfigurations = async (): Promise<ApiConfigurations | null> => {
  try {
    const { data, error } = await supabase.rpc('get_api_configurations')
    
    if (error) {
      console.error('Error fetching API configurations:', error)
      return null
    }
    
    return data?.[0] || null
  } catch (error) {
    console.error('Error in getApiConfigurations:', error)
    return null
  }
}

// Update API configurations
export const updateApiConfigurations = async (configurations: Partial<ApiConfigurationsFormData>): Promise<{ success: boolean; error?: string }> => {
  try {
    // First, get the current configuration to check if one exists
    const currentConfig = await getApiConfigurations()
    
    let result
    
    if (currentConfig?.id) {
      // Update existing configuration
      result = await supabase
        .from('api_configurations')
        .update({
          ...configurations,
          updated_at: new Date().toISOString()
        })
        .eq('id', currentConfig.id)
        .select()
    } else {
      // Insert new configuration
      result = await supabase
        .from('api_configurations')
        .insert({
          ...configurations,
          fb_api_version: configurations.fb_api_version || '18.0',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
    }
    
    if (result.error) {
      console.error('Error updating API configurations:', result.error)
      return { success: false, error: result.error.message }
    }
    
    return { success: true }
  } catch (error) {
    console.error('Error in updateApiConfigurations:', error)
    return { success: false, error: 'An unexpected error occurred' }
  }
}

// Get specific API configuration by service type
export const getApiConfigByService = async (service: 'facebook' | 'google' | 'pathao' | 'redx' | 'stedfast' | 'sslcommerz' | 'bkash') => {
  const config = await getApiConfigurations()
  if (!config) return null
  
  switch (service) {
    case 'facebook':
      return {
        fb_api_version: config.fb_api_version,
        fb_pixel_id: config.fb_pixel_id,
        fb_access_token: config.fb_access_token,
        fb_enabled: config.fb_enabled
      }
    case 'google':
      return {
        gtm_container_id: config.gtm_container_id,
        ga_measurement_id: config.ga_measurement_id,
        google_ads_conversion_id: config.google_ads_conversion_id,
        google_ads_conversion_label: config.google_ads_conversion_label,
        gtm_enabled: config.gtm_enabled
      }
    case 'pathao':
      return {
        pathao_client_id: config.pathao_client_id,
        pathao_client_secret: config.pathao_client_secret,
        pathao_username: config.pathao_username,
        pathao_password: config.pathao_password,
        pathao_base_url: config.pathao_base_url,
        pathao_enabled: config.pathao_enabled
      }
    case 'redx':
      return {
        redx_api_token: config.redx_api_token,
        redx_base_url: config.redx_base_url,
        redx_enabled: config.redx_enabled
      }
    case 'stedfast':
      return {
        stedfast_api_key: config.stedfast_api_key,
        stedfast_secret_key: config.stedfast_secret_key,
        stedfast_base_url: config.stedfast_base_url,
        stedfast_enabled: config.stedfast_enabled
      }
    case 'sslcommerz':
      return {
        sslcommerz_store_id: config.sslcommerz_store_id,
        sslcommerz_store_password: config.sslcommerz_store_password,
        sslcommerz_sandbox_mode: config.sslcommerz_sandbox_mode,
        sslcommerz_enabled: config.sslcommerz_enabled
      }
    case 'bkash':
      return {
        bkash_app_key: config.bkash_app_key,
        bkash_app_secret: config.bkash_app_secret,
        bkash_username: config.bkash_username,
        bkash_password: config.bkash_password,
        bkash_sandbox_mode: config.bkash_sandbox_mode,
        bkash_enabled: config.bkash_enabled
      }
    default:
      return null
  }
}

// Check if a specific service is enabled
export const isServiceEnabled = async (service: 'facebook' | 'google' | 'pathao' | 'redx' | 'stedfast' | 'sslcommerz' | 'bkash'): Promise<boolean> => {
  const config = await getApiConfigurations()
  if (!config) return false
  
  switch (service) {
    case 'facebook':
      return config.fb_enabled || false
    case 'google':
      return config.gtm_enabled || false
    case 'pathao':
      return config.pathao_enabled || false
    case 'redx':
      return config.redx_enabled || false
    case 'stedfast':
      return config.stedfast_enabled || false
    case 'sslcommerz':
      return config.sslcommerz_enabled || false
    case 'bkash':
      return config.bkash_enabled || false
    default:
      return false
  }
}

// Default values for form initialization
export const DEFAULT_API_CONFIG: ApiConfigurationsFormData = {
  // Facebook Conversion API fields
  fb_api_version: '18.0',
  fb_pixel_id: '',
  fb_access_token: '',
  fb_enabled: false,
  // Google Tag Manager and Analytics fields
  gtm_container_id: '',
  ga_measurement_id: '',
  google_ads_conversion_id: '',
  google_ads_conversion_label: '',
  gtm_enabled: false,
  // Pathao Courier Service fields
  pathao_client_id: '',
  pathao_client_secret: '',
  pathao_username: '',
  pathao_password: '',
  pathao_base_url: 'https://api-hermes.pathao.com',
  pathao_enabled: false,
  // RedX Courier Service fields
  redx_api_token: '',
  redx_base_url: 'https://openapi.redx.com.bd/v1.0.0-beta',
  redx_enabled: false,
  // Steadfast Courier Service fields
  stedfast_api_key: '',
  stedfast_secret_key: '',
  stedfast_base_url: 'https://portal.steadfast.com.bd/api/v1',
  stedfast_enabled: false,
  // SSLCOMMERZ Payment Gateway fields
  sslcommerz_store_id: '',
  sslcommerz_store_password: '',
  sslcommerz_sandbox_mode: true,
  sslcommerz_enabled: false,
  // bKash Payment Gateway fields
  bkash_app_key: '',
  bkash_app_secret: '',
  bkash_username: '',
  bkash_password: '',
  bkash_sandbox_mode: true,
  bkash_enabled: false
}