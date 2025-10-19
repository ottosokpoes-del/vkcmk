import { supabase, Database } from '../config/supabase'

type Car = Database['public']['Tables']['cars']['Row']
type CarInsert = Database['public']['Tables']['cars']['Insert']
type CarUpdate = Database['public']['Tables']['cars']['Update']
type Favorite = Database['public']['Tables']['favorites']['Row']

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

import { supabase, Database } from '../config/supabase'

type Car = Database['public']['Tables']['cars']['Row']
type CarInsert = Database['public']['Tables']['cars']['Insert']
type CarUpdate = Database['public']['Tables']['cars']['Update']
type Favorite = Database['public']['Tables']['favorites']['Row']

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
  search?: string
  limit?: number
  offset?: number
}

// Cache for frequently accessed data
const cache = new Map<string, { data: any; timestamp: number; ttl: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

function getCachedData(key: string) {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < cached.ttl) {
    return cached.data
  }
  cache.delete(key)
  return null
}

function setCachedData(key: string, data: any, ttl = CACHE_TTL) {
  cache.set(key, { data, timestamp: Date.now(), ttl })
}

export class SupabaseService {
  // Car methods with optimized queries
  static async getCars(filters?: CarFilters): Promise<Car[]> {
    const cacheKey = `cars:${JSON.stringify(filters)}`
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    let query = supabase
      .from('cars')
      .select('*')
      .eq('is_sold', false) // Only show available cars by default
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
      if (filters.search) {
        query = query.or(`brand.ilike.%${filters.search}%,model.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
      }
      if (filters.limit) {
        query = query.limit(filters.limit)
      }
      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 20) - 1)
      }
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to fetch cars: ${error.message}`)
    }

    const result = data || []
    setCachedData(cacheKey, result)
    return result
  }

  static async getCarById(id: string): Promise<Car | null> {
    const cacheKey = `car:${id}`
    const cached = getCachedData(cacheKey)
    if (cached) return cached

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

    setCachedData(cacheKey, data, 10 * 60 * 1000) // Cache for 10 minutes
    return data
  }

  static async getFeaturedCars(limit = 6): Promise<Car[]> {
    const cacheKey = `featured-cars:${limit}`
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('is_featured', true)
      .eq('is_sold', false)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      throw new Error(`Failed to fetch featured cars: ${error.message}`)
    }

    const result = data || []
    setCachedData(cacheKey, result, 15 * 60 * 1000) // Cache for 15 minutes
    return result
  }

  static async getCarsByBrand(brand: string, limit = 20): Promise<Car[]> {
    const cacheKey = `cars-brand:${brand}:${limit}`
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    const { data, error } = await supabase
      .from('cars')
      .select('*')
      .eq('brand', brand)
      .eq('is_sold', false)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (error) {
      throw new Error(`Failed to fetch cars by brand: ${error.message}`)
    }

    const result = data || []
    setCachedData(cacheKey, result)
    return result
  }

  static async searchCars(searchTerm: string, filters?: Omit<CarFilters, 'search'>): Promise<Car[]> {
    const cacheKey = `search:${searchTerm}:${JSON.stringify(filters)}`
    const cached = getCachedData(cacheKey)
    if (cached) return cached

    let query = supabase
      .from('cars')
      .select('*')
      .eq('is_sold', false)
      .or(`brand.ilike.%${searchTerm}%,model.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`)
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
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to search cars: ${error.message}`)
    }

    const result = data || []
    setCachedData(cacheKey, result, 2 * 60 * 1000) // Cache for 2 minutes
    return result
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

    // Invalidate relevant caches
    this.invalidateCarCaches()
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

    // Invalidate relevant caches
    this.invalidateCarCaches()
    cache.delete(`car:${id}`)
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

    // Invalidate relevant caches
    this.invalidateCarCaches()
    cache.delete(`car:${id}`)
  }

  // Cache invalidation helper
  private static invalidateCarCaches() {
    const keysToDelete = Array.from(cache.keys()).filter(key => 
      key.startsWith('cars:') || 
      key.startsWith('featured-cars:') || 
      key.startsWith('cars-brand:') || 
      key.startsWith('search:')
    )
    keysToDelete.forEach(key => cache.delete(key))
  }

  // Favorite methods with optimized queries
  static async getFavorites(userId: string): Promise<Favorite[]> {
    const cacheKey = `favorites:${userId}`
    const cached = getCachedData(cacheKey)
    if (cached) return cached

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

    const result = data || []
    setCachedData(cacheKey, result, 3 * 60 * 1000) // Cache for 3 minutes
    return result
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

    // Invalidate favorites cache
    cache.delete(`favorites:${userId}`)
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

    // Invalidate favorites cache
    cache.delete(`favorites:${userId}`)
  }

  static async isFavorite(userId: string, carId: string): Promise<boolean> {
    const cacheKey = `favorite-check:${userId}:${carId}`
    const cached = getCachedData(cacheKey)
    if (cached !== null) return cached

    const { data, error } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', userId)
      .eq('car_id', carId)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        setCachedData(cacheKey, false, 1 * 60 * 1000) // Cache for 1 minute
        return false // Not found, so not favorite
      }
      throw new Error(`Failed to check favorite status: ${error.message}`)
    }

    const result = !!data
    setCachedData(cacheKey, result, 1 * 60 * 1000) // Cache for 1 minute
    return result
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
