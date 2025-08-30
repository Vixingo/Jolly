import { supabase } from './supabase'
import type { StoreSettings } from './store-settings'

// Payment gateway types
export interface PaymentGatewaySettings {
  sslcommerz_enabled: boolean
  sslcommerz_store_id: string
  sslcommerz_store_password: string
  sslcommerz_sandbox_mode: boolean
  bkash_enabled: boolean
  bkash_app_key: string
  bkash_app_secret: string
  bkash_username: string
  bkash_password: string
  bkash_sandbox_mode: boolean
}

export interface PaymentRequest {
  amount: number
  currency: string
  order_id: string
  customer_name: string
  customer_email?: string
  customer_phone: string
  customer_address: string
  success_url: string
  fail_url: string
  cancel_url: string
}

export interface PaymentResponse {
  success: boolean
  payment_url?: string
  transaction_id?: string
  error?: string
}

// Get payment gateway settings from store settings
export async function getPaymentGatewaySettings(): Promise<PaymentGatewaySettings | null> {
  try {
    const { data: settings, error } = await supabase
      .from('store_settings')
      .select(`
        sslcommerz_enabled,
        sslcommerz_store_id,
        sslcommerz_store_password,
        sslcommerz_sandbox_mode,
        bkash_enabled,
        bkash_app_key,
        bkash_app_secret,
        bkash_username,
        bkash_password,
        bkash_sandbox_mode
      `)
      .eq('is_active', true)
      .single()

    if (error) {
      console.error('Error fetching payment gateway settings:', error)
      return null
    }

    return settings as PaymentGatewaySettings
  } catch (error) {
    console.error('Error getting payment gateway settings:', error)
    return null
  }
}

// Check if any payment gateway is enabled
export async function isPaymentGatewayEnabled(): Promise<boolean> {
  const settings = await getPaymentGatewaySettings()
  if (!settings) return false
  
  return settings.sslcommerz_enabled || settings.bkash_enabled
}

// SSLCOMMERZ Integration
export async function initializeSSLCOMMERZ(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
  try {
    const settings = await getPaymentGatewaySettings()
    if (!settings || !settings.sslcommerz_enabled) {
      return { success: false, error: 'SSLCOMMERZ is not enabled' }
    }

    const baseUrl = settings.sslcommerz_sandbox_mode 
      ? 'https://sandbox.sslcommerz.com'
      : 'https://securepay.sslcommerz.com'

    const formData = new FormData()
    formData.append('store_id', settings.sslcommerz_store_id)
    formData.append('store_passwd', settings.sslcommerz_store_password)
    formData.append('total_amount', paymentRequest.amount.toString())
    formData.append('currency', paymentRequest.currency)
    formData.append('tran_id', paymentRequest.order_id)
    formData.append('success_url', paymentRequest.success_url)
    formData.append('fail_url', paymentRequest.fail_url)
    formData.append('cancel_url', paymentRequest.cancel_url)
    formData.append('cus_name', paymentRequest.customer_name)
    formData.append('cus_email', paymentRequest.customer_email || 'customer@example.com')
    formData.append('cus_phone', paymentRequest.customer_phone)
    formData.append('cus_add1', paymentRequest.customer_address)
    formData.append('cus_city', 'Dhaka')
    formData.append('cus_country', 'Bangladesh')
    formData.append('shipping_method', 'NO')
    formData.append('product_name', 'Order Payment')
    formData.append('product_category', 'General')
    formData.append('product_profile', 'general')

    const response = await fetch(`${baseUrl}/gwprocess/v4/api.php`, {
      method: 'POST',
      body: formData
    })

    const result = await response.json()

    if (result.status === 'SUCCESS') {
      return {
        success: true,
        payment_url: result.GatewayPageURL,
        transaction_id: result.sessionkey
      }
    } else {
      return {
        success: false,
        error: result.failedreason || 'Payment initialization failed'
      }
    }
  } catch (error) {
    console.error('SSLCOMMERZ initialization error:', error)
    return {
      success: false,
      error: 'Failed to initialize SSLCOMMERZ payment'
    }
  }
}

// bKash Integration
export async function initializeBkash(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
  try {
    const settings = await getPaymentGatewaySettings()
    if (!settings || !settings.bkash_enabled) {
      return { success: false, error: 'bKash is not enabled' }
    }

    const baseUrl = settings.bkash_sandbox_mode 
      ? 'https://tokenized.sandbox.bka.sh/v1.2.0-beta'
      : 'https://tokenized.pay.bka.sh/v1.2.0-beta'

    // First, get the access token
    const tokenResponse = await fetch(`${baseUrl}/tokenized/checkout/token/grant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'username': settings.bkash_username,
        'password': settings.bkash_password
      },
      body: JSON.stringify({
        app_key: settings.bkash_app_key,
        app_secret: settings.bkash_app_secret
      })
    })

    const tokenResult = await tokenResponse.json()
    
    if (!tokenResult.id_token) {
      return {
        success: false,
        error: 'Failed to get bKash access token'
      }
    }

    // Create payment
    const paymentResponse = await fetch(`${baseUrl}/tokenized/checkout/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'authorization': tokenResult.id_token,
        'x-app-key': settings.bkash_app_key
      },
      body: JSON.stringify({
        mode: '0011',
        payerReference: paymentRequest.customer_phone,
        callbackURL: paymentRequest.success_url,
        amount: paymentRequest.amount.toString(),
        currency: 'BDT',
        intent: 'sale',
        merchantInvoiceNumber: paymentRequest.order_id
      })
    })

    const paymentResult = await paymentResponse.json()

    if (paymentResult.paymentID) {
      return {
        success: true,
        payment_url: paymentResult.bkashURL,
        transaction_id: paymentResult.paymentID
      }
    } else {
      return {
        success: false,
        error: paymentResult.errorMessage || 'bKash payment creation failed'
      }
    }
  } catch (error) {
    console.error('bKash initialization error:', error)
    return {
      success: false,
      error: 'Failed to initialize bKash payment'
    }
  }
}

// Generic payment initialization
export async function initializePayment(
  gateway: 'sslcommerz' | 'bkash',
  paymentRequest: PaymentRequest
): Promise<PaymentResponse> {
  switch (gateway) {
    case 'sslcommerz':
      return initializeSSLCOMMERZ(paymentRequest)
    case 'bkash':
      return initializeBkash(paymentRequest)
    default:
      return {
        success: false,
        error: 'Unsupported payment gateway'
      }
  }
}

// Get available payment methods
export async function getAvailablePaymentMethods(): Promise<Array<{id: string, name: string, enabled: boolean}>> {
  const settings = await getPaymentGatewaySettings()
  if (!settings) return []

  return [
    {
      id: 'sslcommerz',
      name: 'SSLCOMMERZ',
      enabled: settings.sslcommerz_enabled
    },
    {
      id: 'bkash',
      name: 'bKash',
      enabled: settings.bkash_enabled
    }
  ].filter(method => method.enabled)
}

// Test payment gateway connection
export async function testPaymentGatewayConnection(gateway: 'sslcommerz' | 'bkash'): Promise<boolean> {
  try {
    const settings = await getPaymentGatewaySettings()
    if (!settings) return false

    if (gateway === 'sslcommerz' && settings.sslcommerz_enabled) {
      const baseUrl = settings.sslcommerz_sandbox_mode 
        ? 'https://sandbox.sslcommerz.com'
        : 'https://securepay.sslcommerz.com'
      
      const formData = new FormData()
      formData.append('store_id', settings.sslcommerz_store_id)
      formData.append('store_passwd', settings.sslcommerz_store_password)
      formData.append('val_id', 'test')
      
      const response = await fetch(`${baseUrl}/validator/api/validationserverAPI.php`, {
        method: 'POST',
        body: formData
      })
      
      return response.ok
    }

    if (gateway === 'bkash' && settings.bkash_enabled) {
      const baseUrl = settings.bkash_sandbox_mode 
        ? 'https://tokenized.sandbox.bka.sh/v1.2.0-beta'
        : 'https://tokenized.pay.bka.sh/v1.2.0-beta'
      
      const response = await fetch(`${baseUrl}/tokenized/checkout/token/grant`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'username': settings.bkash_username,
          'password': settings.bkash_password
        },
        body: JSON.stringify({
          app_key: settings.bkash_app_key,
          app_secret: settings.bkash_app_secret
        })
      })
      
      const result = await response.json()
      return !!result.id_token
    }

    return false
  } catch (error) {
    console.error(`Error testing ${gateway} connection:`, error)
    return false
  }
}