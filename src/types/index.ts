export interface Car {
  id: string;
  title: string;
  brand: string;
  model: string;
  price: number;
  year: number;
  mileage: number;
  fuel: 'Benzin' | 'Dizel' | 'Elektrik' | 'Hibrit';
  transmission: 'Manuel' | 'Otomatik' | 'Yarı Otomatik';
  location: string;
  sellerType: 'Sahibinden' | 'Galeriden';
  images: string[];
  description: string;
  technicalSpecs: {
    engine: string;
    power: string;
    torque: string;
    acceleration: string;
    topSpeed: string;
    fuelConsumption: string;
  };
  features: string[];
  safety: string[];
  isNew: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  username: string;
  role: 'user' | 'admin';
}

export interface FilterState {
  brand: string[];
  year: { min: number; max: number };
  price: { min: number; max: number };
  fuel: string[];
  transmission: string[];
  location: string[];
}

export interface AppState {
  cars: Car[];
  favorites: string[];
  user: User | null;
  filters: FilterState;
  isLoading: boolean;
}

export interface AppActions {
  setCars: (cars: Car[]) => void;
  addCar: (car: Car) => void;
  updateCar: (id: string, car: Partial<Car>) => void;
  deleteCar: (id: string) => void;
  toggleFavorite: (carId: string) => void;
  setUser: (user: User | null) => void;
  setFilters: (filters: Partial<FilterState>) => void;
  clearFilters: () => void;
  setLoading: (loading: boolean) => void;
}
