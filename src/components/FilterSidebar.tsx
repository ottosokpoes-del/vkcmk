import { useState } from 'react';
import { FiFilter, FiX } from 'react-icons/fi';
import { useAppStore } from '../store';

const FilterSidebar = () => {
  const { filters, setFilters, clearFilters } = useAppStore();
  const [isOpen, setIsOpen] = useState(false);

  const brands = ['Cat', 'Komatsu'];
  const categories = ['Blade Parts', 'Engine Parts', 'Hydraulic Parts', 'Electrical Parts', 'Undercarriage Parts'];
  const stockCountries = [
    { value: 'EU', label: '🇪🇺 Avrupa Stok', flag: '🇪🇺' },
    { value: 'Kenya', label: '🇰🇪 Kenya Stok', flag: '🇰🇪' },
    { value: 'US', label: '🇺🇸 ABD Stok', flag: '🇺🇸' }
  ];

  const saleStatuses = [
    { value: 'Satılık', label: '🟢 Satılık', color: 'green' },
    { value: 'Satılmış', label: '🔴 Satılmış', color: 'red' }
  ];

  const handleBrandChange = (brand: string) => {
    const newBrands = filters.brand.includes(brand)
      ? filters.brand.filter(b => b !== brand)
      : [...filters.brand, brand];
    setFilters({ brand: newBrands });
  };

  const handleCategoryChange = (category: string) => {
    const newCategories = filters.category.includes(category)
      ? filters.category.filter(c => c !== category)
      : [...filters.category, category];
    setFilters({ category: newCategories });
  };

  const handleStockCountryChange = (country: string) => {
    const newCountries = filters.stockCountry.includes(country)
      ? filters.stockCountry.filter(c => c !== country)
      : [...filters.stockCountry, country];
    setFilters({ stockCountry: newCountries });
  };

  const handleSaleStatusChange = (status: string) => {
    const newStatuses = filters.saleStatus.includes(status)
      ? filters.saleStatus.filter(s => s !== status)
      : [...filters.saleStatus, status];
    setFilters({ saleStatus: newStatuses });
  };


  return (
    <>
      {/* Mobile Filter Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden fixed bottom-6 right-6 bg-orange-600 text-white p-3 rounded-full shadow-lg z-40"
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
            className="w-full mb-6 text-orange-600 hover:text-orange-700 font-medium"
          >
            Tüm Filtreleri Temizle
          </button>

          {/* Brand Filter */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Marka</h3>
            <div className="space-y-2">
              {brands.map(brand => (
                <label key={brand} className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={filters.brand.includes(brand)}
                      onChange={() => handleBrandChange(brand)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center ${
                      filters.brand.includes(brand)
                        ? 'bg-orange-600 border-orange-600 shadow-md'
                        : 'bg-white border-gray-300 group-hover:border-orange-400'
                    }`}>
                      {filters.brand.includes(brand) && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className={`text-sm transition-colors duration-200 ${
                    filters.brand.includes(brand) ? 'text-orange-600 font-medium' : 'text-gray-700 group-hover:text-gray-900'
                  }`}>{brand}</span>
                </label>
              ))}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Max Fiyat</label>
                <input
                  type="number"
                  value={filters.price.max}
                  onChange={(e) => setFilters({ 
                    price: { ...filters.price, max: parseInt(e.target.value) || 50000000 }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Stock Country Filter */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Stok Ülkesi</h3>
            <div className="space-y-2">
              {stockCountries.map(country => (
                <label key={country.value} className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={filters.stockCountry.includes(country.value)}
                      onChange={() => handleStockCountryChange(country.value)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center ${
                      filters.stockCountry.includes(country.value)
                        ? 'bg-orange-600 border-orange-600 shadow-md'
                        : 'bg-white border-gray-300 group-hover:border-orange-400'
                    }`}>
                      {filters.stockCountry.includes(country.value) && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className={`text-sm transition-colors duration-200 ${
                    filters.stockCountry.includes(country.value) ? 'text-orange-600 font-medium' : 'text-gray-700 group-hover:text-gray-900'
                  }`}>{country.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sale Status Filter */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Satış Durumu</h3>
            <div className="space-y-2">
              {saleStatuses.map(status => (
                <label key={status.value} className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={filters.saleStatus.includes(status.value)}
                      onChange={() => handleSaleStatusChange(status.value)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center ${
                      filters.saleStatus.includes(status.value)
                        ? 'bg-orange-600 border-orange-600 shadow-md'
                        : 'bg-white border-gray-300 group-hover:border-orange-400'
                    }`}>
                      {filters.saleStatus.includes(status.value) && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className={`text-sm transition-colors duration-200 ${
                    filters.saleStatus.includes(status.value) ? 'text-orange-600 font-medium' : 'text-gray-700 group-hover:text-gray-900'
                  }`}>{status.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Kategori</h3>
            <div className="space-y-2">
              {categories.map(category => (
                <label key={category} className="flex items-center space-x-3 cursor-pointer group">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={filters.category.includes(category)}
                      onChange={() => handleCategoryChange(category)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded-md border-2 transition-all duration-200 flex items-center justify-center ${
                      filters.category.includes(category)
                        ? 'bg-orange-600 border-orange-600 shadow-md'
                        : 'bg-white border-gray-300 group-hover:border-orange-400'
                    }`}>
                      {filters.category.includes(category) && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <span className={`text-sm transition-colors duration-200 ${
                    filters.category.includes(category) ? 'text-orange-600 font-medium' : 'text-gray-700 group-hover:text-gray-900'
                  }`}>{category}</span>
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

