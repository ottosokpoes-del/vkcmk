import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, AppActions, Car, FilterState } from '../types';

const defaultFilters: FilterState = {
  brand: [],
  year: { min: 2000, max: 2024 },
  price: { min: 0, max: 10000000 },
  fuel: [],
  transmission: [],
  location: [],
};

const mockCars: Car[] = [
  {
    id: '1',
    title: '2020 BMW 3 Serisi 320d',
    brand: 'BMW',
    model: '3 Serisi',
    price: 1250000,
    year: 2020,
    mileage: 45000,
    fuel: 'Dizel',
    transmission: 'Otomatik',
    location: 'İstanbul',
    sellerType: 'Sahibinden',
    images: [
      'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800',
      'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800',
      'https://images.unsplash.com/photo-1558618047-7c8c1c4a6b3c?w=800',
    ],
    description: 'Tek elden, bakımlı, kazasız BMW 3 Serisi. Tüm servis kayıtları mevcut.',
    technicalSpecs: {
      engine: '2.0L Turbo Diesel',
      power: '190 HP',
      torque: '400 Nm',
      acceleration: '7.1s (0-100 km/h)',
      topSpeed: '230 km/h',
      fuelConsumption: '5.2L/100km',
    },
    features: ['Klima', 'Elektrikli Camlar', 'Merkezi Kilit', 'ABS', 'ESP'],
    safety: ['ABS', 'ESP', 'Airbag', 'Isofix'],
    isNew: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: '2019 Mercedes C200',
    brand: 'Mercedes',
    model: 'C200',
    price: 980000,
    year: 2019,
    mileage: 62000,
    fuel: 'Benzin',
    transmission: 'Otomatik',
    location: 'Ankara',
    sellerType: 'Galeriden',
    images: [
      'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800',
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
    ],
    description: 'Mercedes-Benz C200, full paket, garantili.',
    technicalSpecs: {
      engine: '1.5L Turbo',
      power: '184 HP',
      torque: '280 Nm',
      acceleration: '7.7s (0-100 km/h)',
      topSpeed: '235 km/h',
      fuelConsumption: '6.8L/100km',
    },
    features: ['Klima', 'Elektrikli Camlar', 'Merkezi Kilit', 'ABS', 'ESP', 'Navigasyon'],
    safety: ['ABS', 'ESP', 'Airbag', 'Isofix', 'Blind Spot Assist'],
    isNew: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '3',
    title: '2021 Audi A4 2.0 TDI',
    brand: 'Audi',
    model: 'A4',
    price: 1450000,
    year: 2021,
    mileage: 28000,
    fuel: 'Dizel',
    transmission: 'Otomatik',
    location: 'İzmir',
    sellerType: 'Sahibinden',
    images: [
      'https://images.unsplash.com/photo-1606152421802-db97b9c7a11b?w=800',
      'https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?w=800',
    ],
    description: 'Audi A4, az kullanılmış, servis kayıtları tam.',
    technicalSpecs: {
      engine: '2.0L TDI',
      power: '190 HP',
      torque: '400 Nm',
      acceleration: '7.3s (0-100 km/h)',
      topSpeed: '240 km/h',
      fuelConsumption: '4.9L/100km',
    },
    features: ['Klima', 'Elektrikli Camlar', 'Merkezi Kilit', 'ABS', 'ESP', 'Navigasyon', 'Deri Döşeme'],
    safety: ['ABS', 'ESP', 'Airbag', 'Isofix', 'Lane Assist'],
    isNew: true,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

export const useAppStore = create<AppState & AppActions>()(
  persist(
    (set) => ({
      cars: mockCars,
      favorites: [],
      user: null,
      filters: defaultFilters,
      isLoading: false,

      setCars: (cars) => set({ cars }),
      
      addCar: (car) => set((state) => ({ 
        cars: [...state.cars, car] 
      })),
      
      updateCar: (id, updatedCar) => set((state) => ({
        cars: state.cars.map(car => 
          car.id === id ? { ...car, ...updatedCar } : car
        )
      })),
      
      deleteCar: (id) => set((state) => ({
        cars: state.cars.filter(car => car.id !== id),
        favorites: state.favorites.filter(favId => favId !== id)
      })),
      
      toggleFavorite: (carId) => set((state) => {
        const favorites = state.favorites.includes(carId)
          ? state.favorites.filter(id => id !== carId)
          : [...state.favorites, carId];
        return { favorites };
      }),
      
      setUser: (user) => set({ user }),
      
      setFilters: (newFilters) => set((state) => ({
        filters: { ...state.filters, ...newFilters }
      })),
      
      clearFilters: () => set({ filters: defaultFilters }),
      
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: 'car-marketplace-storage',
      partialize: (state) => ({
        cars: state.cars,
        favorites: state.favorites,
        user: state.user,
      }),
    }
  )
);
