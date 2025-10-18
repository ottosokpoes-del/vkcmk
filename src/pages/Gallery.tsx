import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import CarCard from '../components/CarCard';
import FilterSidebar from '../components/FilterSidebar';
import { useAppStore } from '../store';

const Gallery = () => {
  const { cars, filters } = useAppStore();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  const filteredCars = useMemo(() => {
    return cars.filter(car => {
      // Search filter
      if (searchQuery && !car.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Brand filter
      if (filters.brand.length > 0 && !filters.brand.some(brand => 
        car.title.toLowerCase().includes(brand.toLowerCase())
      )) {
        return false;
      }

      // Year filter
      if (car.year < filters.year.min || car.year > filters.year.max) {
        return false;
      }

      // Price filter
      if (car.price < filters.price.min || car.price > filters.price.max) {
        return false;
      }

      // Fuel filter
      if (filters.fuel.length > 0 && !filters.fuel.includes(car.fuel)) {
        return false;
      }

      // Transmission filter
      if (filters.transmission.length > 0 && !filters.transmission.includes(car.transmission)) {
        return false;
      }

      // Location filter
      if (filters.location.length > 0 && !filters.location.includes(car.location)) {
        return false;
      }

      return true;
    });
  }, [cars, filters, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex gap-8">
        {/* Sidebar */}
        <div className="hidden md:block w-80 flex-shrink-0">
          <FilterSidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Premium Araçlar
            </h1>
            <p className="text-gray-600">
              {searchQuery ? `"${searchQuery}" için ` : ''}{filteredCars.length} araç bulundu
            </p>
          </div>

          {/* Cars Grid */}
          {filteredCars.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCars.map(car => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.75a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aradığınız kriterlere uygun araç bulunamadı
              </h3>
              <p className="text-gray-600">
                Filtreleri değiştirerek tekrar deneyin
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Gallery;
