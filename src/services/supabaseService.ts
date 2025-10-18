import { supabase, Database } from '../config/supabase'

type Car = Database['public']['Tables']['cars']['Row']
type CarInsert = Database['public']['Tables']['cars']['Insert']
type CarUpdate = Database['public']['Tables']['cars']['Update']
type Favorite = Database['public']['Tables']['favorites']['Row']
type FavoriteInsert = Database['public']['Tables']['favorites']['Insert']

export interface CarFilters {
  brand?: string
  minPrice?: number
  maxPrice?: number
  fuelType?: string
  transmission?: string
  minYear?: number
  maxYear?: number
  isFeatured?: boolean
  isSold?: boolean
}

export class SupabaseService {
  // Car methods
  static async getCars(filters?: CarFilters): Promise<Car[]> {
    let query = supabase
      .from('cars')
      .select('*')
      .order('created_at', { ascending: false })

    if (filters) {
      if (filters.brand) {
        query = query.eq('brand', filters.brand)
      }
      if (filters.minPrice !== undefined) {
        query = query.gte('price', filters.minPrice)
      }
      if (filters.maxPrice !== undefined) {
        query = query.lte('price', filters.maxPrice)
      }
      if (filters.fuelType) {
        query = query.eq('fuel_type', filters.fuelType)
      }
      if (filters.transmission) {
        query = query.eq('transmission', filters.transmission)
      }
      if (filters.minYear !== undefined) {
        query = query.gte('year', filters.minYear)
      }
      if (filters.maxYear !== undefined) {
        query = query.lte('year', filters.maxYear)
      }
      if (filters.isFeatured !== undefined) {
        query = query.eq('is_featured', filters.isFeatured)
      }
      if (filters.isSold !== undefined) {
        query = query.eq('is_sold', filters.isSold)
      }
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to fetch cars: ${error.message}`)
    }

    return data || []
  }

  static async getCarById(id: string): Promise<Car | null> {
    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('id', id)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null // Car not found
      }
      throw new Error(`Failed to fetch car: ${error.message}`)
    }

    return data
  }

  static async createCar(carData: CarInsert): Promise<Car> {
    const { data, error } = await supabase
      .from('cars')
      .insert(carData)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create car: ${error.message}`)
    }

    return data
  }

  static async updateCar(id: string, carData: CarUpdate): Promise<Car> {
    const { data, error } = await supabase
      .from('cars')
      .update({ ...carData, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update car: ${error.message}`)
    }

    return data
  }

  static async deleteCar(id: string): Promise<void> {
    const { error } = await supabase
      .from('cars')
      .delete()
      .eq('id', id)

    if (error) {
      throw new Error(`Failed to delete car: ${error.message}`)
    }
  }

  // Favorite methods
  static async getFavorites(userId: string): Promise<Favorite[]> {
    const { data, error } = await supabase
      .from('favorites')
      .select(`
        *,
        cars (*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      throw new Error(`Failed to fetch favorites: ${error.message}`)
    }

    return data || []
  }

  static async addToFavorites(userId: string, carId: string): Promise<Favorite> {
    const { data, error } = await supabase
      .from('favorites')
      .insert({ user_id: userId, car_id: carId })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to add to favorites: ${error.message}`)
    }

    return data
  }

  static async removeFromFavorites(userId: string, carId: string): Promise<void> {
    const { error } = await supabase
      .from('favorites')
      .delete()
      .eq('user_id', userId)
      .eq('car_id', carId)

    if (error) {
      throw new Error(`Failed to remove from favorites: ${error.message}`)
    }
  }

  static async isFavorite(userId: string, carId: string): Promise<boolean> {
    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('car_id', carId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return false // Not found, so not favorite
      }
      throw new Error(`Failed to check favorite status: ${error.message}`)
    }

    return !!data
  }

  // User methods
  static async getUser(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) {
      throw new Error(`Failed to fetch user: ${error.message}`)
    }

    return data
  }

  static async updateUser(userId: string, userData: any) {
    const { data, error } = await supabase
      .from('users')
      .update({ ...userData, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update user: ${error.message}`)
    }

    return data
  }

  static async updateUserProfile(userId: string, userData: any) {
    // First try to update in users table
    try {
      const { data, error } = await supabase
        .from('users')
        .update({ ...userData, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single()

      if (error) {
        // If users table doesn't exist or user not found, create profile
        const { data: newProfile, error: createError } = await supabase
          .from('users')
          .insert({
            id: userId,
            ...userData,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .select()
          .single()

        if (createError) {
          throw new Error(`Failed to create user profile: ${createError.message}`)
        }

        return newProfile
      }

      return data
    } catch (error) {
      // Fallback: update auth user metadata
      const { data: { user }, error: authError } = await supabase.auth.updateUser({
        data: userData
      })

      if (authError) {
        throw new Error(`Failed to update user profile: ${authError.message}`)
      }

      return {
        id: user?.id,
        email: user?.email,
        ...userData,
        created_at: user?.created_at,
        updated_at: new Date().toISOString()
      }
    }
  }

  // Auth methods
  static async signUp(email: string, password: string, userData: any) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })

    if (error) {
      throw new Error(`Failed to sign up: ${error.message}`)
    }

    return data
  }

  static async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      throw new Error(`Failed to sign in: ${error.message}`)
    }

    return data
  }

  static async signOut() {
    const { error } = await supabase.auth.signOut()

    if (error) {
      throw new Error(`Failed to sign out: ${error.message}`)
    }
  }

  static async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
      throw new Error(`Failed to get current user: ${error.message}`)
    }

    return user
  }

  static async getCurrentUserProfile() {
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error) {
      throw new Error(`Failed to get current user: ${error.message}`)
    }

    if (!user) {
      return null
    }

    // Try to get user profile from users table
    try {
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profileError) {
        // If profile doesn't exist, return basic user info
        return {
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name || '',
          phone: user.user_metadata?.phone || '',
          avatar_url: user.user_metadata?.avatar_url || null,
          is_admin: user.user_metadata?.is_admin || false,
          created_at: user.created_at,
          updated_at: user.updated_at
        }
      }

      return profile
    } catch (error) {
      // Fallback to basic user info if profile fetch fails
      return {
        id: user.id,
        email: user.email,
        full_name: user.user_metadata?.full_name || '',
        phone: user.user_metadata?.phone || '',
        avatar_url: user.user_metadata?.avatar_url || null,
        is_admin: user.user_metadata?.is_admin || false,
        created_at: user.created_at,
        updated_at: user.updated_at
      }
    }
  }

  static async resetPassword(email: string) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    })

    if (error) {
      throw new Error(`Failed to reset password: ${error.message}`)
    }
  }
}
