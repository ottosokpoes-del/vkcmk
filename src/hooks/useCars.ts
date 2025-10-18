import { useState, useEffect } from 'react'
import { SupabaseService } from '../services/supabaseService'

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

export const useCars = (filters?: CarFilters) => {
  const [cars, setCars] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await SupabaseService.getCars(filters)
        setCars(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchCars()
  }, [filters])

  const createCar = async (carData: any) => {
    try {
      const newCar = await SupabaseService.createCar(carData)
      setCars(prev => [newCar, ...prev])
      return newCar
    } catch (err) {
      throw err
    }
  }

  const updateCar = async (id: string, carData: any) => {
    try {
      const updatedCar = await SupabaseService.updateCar(id, carData)
      setCars(prev => prev.map(car => car.id === id ? updatedCar : car))
      return updatedCar
    } catch (err) {
      throw err
    }
  }

  const deleteCar = async (id: string) => {
    try {
      await SupabaseService.deleteCar(id)
      setCars(prev => prev.filter(car => car.id !== id))
    } catch (err) {
      throw err
    }
  }

  return {
    cars,
    loading,
    error,
    createCar,
    updateCar,
    deleteCar,
    refetch: () => {
      setLoading(true)
      SupabaseService.getCars(filters)
        .then(data => {
          setCars(data)
          setError(null)
        })
        .catch(err => {
          setError(err instanceof Error ? err.message : 'An error occurred')
        })
        .finally(() => setLoading(false))
    }
  }
}

export const useCar = (id: string) => {
  const [car, setCar] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return

    const fetchCar = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await SupabaseService.getCarById(id)
        setCar(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchCar()
  }, [id])

  return { car, loading, error }
}

export const useFavorites = (userId: string) => {
  const [favorites, setFavorites] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return

    const fetchFavorites = async () => {
      try {
        setLoading(true)
        setError(null)
        const data = await SupabaseService.getFavorites(userId)
        setFavorites(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchFavorites()
  }, [userId])

  const addToFavorites = async (carId: string) => {
    try {
      const favorite = await SupabaseService.addToFavorites(userId, carId)
      setFavorites(prev => [...prev, favorite])
    } catch (err) {
      throw err
    }
  }

  const removeFromFavorites = async (carId: string) => {
    try {
      await SupabaseService.removeFromFavorites(userId, carId)
      setFavorites(prev => prev.filter(fav => fav.car_id !== carId))
    } catch (err) {
      throw err
    }
  }

  const isFavorite = async (carId: string) => {
    try {
      return await SupabaseService.isFavorite(userId, carId)
    } catch (err) {
      return false
    }
  }

  return {
    favorites,
    loading,
    error,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
  }
}


