import { useState } from 'react';
import { FiFilter, FiX } from 'react-icons/fi';
import { useAppStore } from '../store';

const FilterSidebar = () => {
  const { filters, setFilters, clearFilters } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);

  const brands = ['BMW', 'Mercedes', 'Audi', 'Volkswagen', 'Toyota', 'Honda', 'Ford', 'Renault'];
  const fuelTypes = ['Benzin', 'Dizel', 'Elektrik', 'Hibrit'];
  const transmissions = ['Manuel', 'Otomatik', 'Yarı Otomatik'];
  const locations = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya'];

  const handleBrandChange = (brand: string) => {
    const newBrands = filters.brand.includes(brand)
      ? filters.brand.filter(b => b !== brand)
      : [...filters.brand, brand];
    setFilters({ brand: newBrands });
  };

  const handleFuelChange = (fuel: string) => {
    const newFuels = filters.fuel.includes(fuel)
      ? filters.fuel.filter(f => f !== fuel)
      : [...filters.fuel, fuel];
    setFilters({ fuel: newFuels });
  };

  const handleTransmissionChange = (transmission: string) => {
    const newTransmissions = filters.transmission.includes(transmission)
      ? filters.transmission.filter(t => t !== transmission)
      : [...filters.transmission, transmission];
    setFilters({ transmission: newTransmissions });
  };

  const handleLocationChange = (location: string) => {
    const newLocations = filters.location.includes(location)
      ? filters.location.filter(l => l !== location)
      : [...filters.location, location];
    setFilters({ location: newLocations });
  };

  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed bottom-6 right-6 bg-sahibinden-red text-white p-3 rounded-full shadow-lg z-40"
      >
        <FiFilter className="w-6 h-6" />
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/50 z-50"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed md:static top-0 right-0 h-full w-80 bg-white shadow-lg z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'
      }`}>
        <div className="p-6 h-full overflow-y-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Filtreler</h2>
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-full"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>

          {/* Clear Filters */}
          <button
            onClick={clearFilters}
            className="w-full mb-6 text-sahibinden-red hover:text-red-700 font-medium"
          >
            Tüm Filtreleri Temizle
          </button>

          {/* Brand Filter */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Marka</h3>
            <div className="space-y-2">
              {brands.map(brand => (
                <label key={brand} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.brand.includes(brand)}
                    onChange={() => handleBrandChange(brand)}
                    className="rounded border-gray-300 text-sahibinden-red focus:ring-sahibinden-red"
                  />
                  <span className="text-sm text-gray-700">{brand}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Year Filter */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Yıl</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Min Yıl</label>
                <input
                  type="number"
                  value={filters.year.min}
                  onChange={(e) => setFilters({ 
                    year: { ...filters.year, min: parseInt(e.target.value) || 2000 }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sahibinden-red focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Max Yıl</label>
                <input
                  type="number"
                  value={filters.year.max}
                  onChange={(e) => setFilters({ 
                    year: { ...filters.year, max: parseInt(e.target.value) || 2024 }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sahibinden-red focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Price Filter */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Fiyat</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-sm text-gray-700 mb-1">Min Fiyat</label>
                <input
                  type="number"
                  value={filters.price.min}
                  onChange={(e) => setFilters({ 
                    price: { ...filters.price, min: parseInt(e.target.value) || 0 }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sahibinden-red focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Max Fiyat</label>
                <input
                  type="number"
                  value={filters.price.max}
                  onChange={(e) => setFilters({ 
                    price: { ...filters.price, max: parseInt(e.target.value) || 10000000 }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sahibinden-red focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Fuel Filter */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Yakıt</h3>
            <div className="space-y-2">
              {fuelTypes.map(fuel => (
                <label key={fuel} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.fuel.includes(fuel)}
                    onChange={() => handleFuelChange(fuel)}
                    className="rounded border-gray-300 text-sahibinden-red focus:ring-sahibinden-red"
                  />
                  <span className="text-sm text-gray-700">{fuel}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Transmission Filter */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Vites</h3>
            <div className="space-y-2">
              {transmissions.map(transmission => (
                <label key={transmission} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.transmission.includes(transmission)}
                    onChange={() => handleTransmissionChange(transmission)}
                    className="rounded border-gray-300 text-sahibinden-red focus:ring-sahibinden-red"
                  />
                  <span className="text-sm text-gray-700">{transmission}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Location Filter */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Şehir</h3>
            <div className="space-y-2">
              {locations.map(location => (
                <label key={location} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.location.includes(location)}
                    onChange={() => handleLocationChange(location)}
                    className="rounded border-gray-300 text-sahibinden-red focus:ring-sahibinden-red"
                  />
                  <span className="text-sm text-gray-700">{location}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;

