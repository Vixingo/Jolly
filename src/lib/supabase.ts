import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types
export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          offer_price?: number
          images: string[]
          category: string
          stock: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          images: string[]
          category: string
          stock: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          images?: string[]
          category?: string
          stock?: number
          created_at?: string
          updated_at?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          role: 'admin' | 'customer'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          role?: 'admin' | 'customer'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          role?: 'admin' | 'customer'
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string | null  // Make user_id nullable
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          total: number
          items: any[]
          shipping_address: any
          billing_address: any
          payment_status: 'paid' | 'unpaid' | 'refunded'
          tracking_number: string | null
          customer_phone: string | null
          customer_email: string | null
          payment_method: string
          invoice_requested: boolean
          invoice_email: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null  // Make user_id optional and nullable
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          total: number
          items: any[]
          shipping_address: any
          billing_address?: any
          payment_status?: 'paid' | 'unpaid' | 'refunded'
          tracking_number?: string | null
          customer_phone?: string | null
          customer_email?: string | null
          payment_method?: string
          invoice_requested?: boolean
          invoice_email?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null  // Make user_id optional and nullable
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          total?: number
          items?: any[]
          shipping_address?: any
          billing_address?: any
          payment_status?: 'paid' | 'unpaid' | 'refunded'
          tracking_number?: string | null
          customer_phone?: string | null
          customer_email?: string | null
          payment_method?: string
          invoice_requested?: boolean
          invoice_email?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      pixel_tracking: {
        Row: {
          id: string
          name: string
          type: 'google_analytics' | 'facebook_pixel' | 'custom'
          code: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          type: 'google_analytics' | 'facebook_pixel' | 'custom'
          code: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          type?: 'google_analytics' | 'facebook_pixel' | 'custom'
          code?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
