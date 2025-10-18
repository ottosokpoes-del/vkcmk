import { createClient } from '@supabase/supabase-js'

// Supabase konfigürasyonu - sabit değerler (environment variables sorunu nedeniyle)
const supabaseUrl = 'https://kmivaldjqtuzbeokzjsv.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImttaXZhbGRqcXR1emJlb2t6anN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NDUzNjMsImV4cCI6MjA3NjMyMTM2M30.b2RJt_i6DLX_YbVYkusoUY50feWEMpP-u11TNxwvyi8'

console.log('Supabase URL:', supabaseUrl)
console.log('Supabase Key:', supabaseAnonKey ? 'Present' : 'Missing')

// URL validasyonu
if (!supabaseUrl || !supabaseUrl.startsWith('http')) {
  throw new Error(`Invalid Supabase URL: ${supabaseUrl}. Must be a valid HTTP or HTTPS URL.`)
}

if (!supabaseAnonKey) {
  throw new Error('Missing Supabase anon key')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Database types (you can generate these with Supabase CLI)
export interface Database {
  public: {
    Tables: {
      cars: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          brand: string
          model: string
          year: number
          price: number
          mileage: number
          fuel_type: string
          transmission: string
          color: string
          description: string
          images: string[]
          features: string[]
          location: string
          contact_phone: string
          contact_email: string
          is_featured: boolean
          is_sold: boolean
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          brand: string
          model: string
          year: number
          price: number
          mileage: number
          fuel_type: string
          transmission: string
          color: string
          description: string
          images: string[]
          features: string[]
          location: string
          contact_phone: string
          contact_email: string
          is_featured?: boolean
          is_sold?: boolean
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          brand?: string
          model?: string
          year?: number
          price?: number
          mileage?: number
          fuel_type?: string
          transmission?: string
          color?: string
          description?: string
          images?: string[]
          features?: string[]
          location?: string
          contact_phone?: string
          contact_email?: string
          is_featured?: boolean
          is_sold?: boolean
          user_id?: string
        }
      }
      users: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          email: string
          full_name: string
          phone: string
          avatar_url: string | null
          is_admin: boolean
        }
        Insert: {
          id: string
          created_at?: string
          updated_at?: string
          email: string
          full_name: string
          phone: string
          avatar_url?: string | null
          is_admin?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          email?: string
          full_name?: string
          phone?: string
          avatar_url?: string | null
          is_admin?: boolean
        }
      }
      favorites: {
        Row: {
          id: string
          created_at: string
          user_id: string
          car_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          car_id: string
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          car_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
