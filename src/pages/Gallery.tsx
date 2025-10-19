import { useState, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FiGrid, FiList, FiFilter, FiChevronDown, FiMapPin, FiCalendar, FiStar } from 'react-icons/fi';
import { useAppStore } from '../store';
import { SEO, SEOConfigs } from '../components/SEO';

const Gallery = () => {
  const { graders, filters, setFilters } = useAppStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const searchQuery = searchParams.get('search') || '';

  // Optimized filtering with useMemo
  const filteredGraders = useMemo(() => {
    let filtered = graders;

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(grader => 
        grader.title.toLowerCase().includes(query) ||
        grader.brand?.toLowerCase().includes(query) ||
        grader.model?.toLowerCase().includes(query)
      );
    }

    // Brand filter
    if (filters.brand.length > 0) {
      filtered = filtered.filter(grader => filters.brand.includes(grader.brand || ''));
    }

    // Price filter
    if (filters.price) {
      filtered = filtered.filter(grader => 
        grader.price >= filters.price.min && grader.price <= filters.price.max
      );
    }

    // Stock country filter
    if (filters.stockCountry.length > 0) {
      filtered = filtered.filter(grader => filters.stockCountry.includes(grader.stockCountry));
    }

    // Sale status filter
    if (filters.saleStatus.length > 0) {
      filtered = filtered.filter(grader => {
        const graderStatus = grader.isSold ? 'Satılmış' : 'Satılık';
        return filters.saleStatus.includes(graderStatus);
      });
    }

    // Sorting
    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.listingDate).getTime() - new Date(a.listingDate).getTime());
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.listingDate).getTime() - new Date(b.listingDate).getTime());
        break;
      default:
        break;
    }

    return filtered;
  }, [graders, searchQuery, filters, sortBy]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('tr-TR', {
      style: 'currency',
      currency: 'TRY',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const getCountryFlag = (countryCode: string) => {
    switch (countryCode) {
      case 'EU': return '🇪🇺';
      case 'Kenya': return '🇰🇪';
      case 'US': return '🇺🇸';
      default: return '';
    }
  };

  const brands = ['Cat', 'Komatsu'];
  const stockCountries = [
    { value: 'EU', label: '🇪🇺 Avrupa', flag: '🇪🇺' },
    { value: 'Kenya', label: '🇰🇪 Kenya', flag: '🇰🇪' },
    { value: 'US', label: '🇺🇸 ABD', flag: '🇺🇸' }
  ];

  return (
    <>
      <SEO {...SEOConfigs.gallery} />
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-orange-600 to-orange-700 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Grader Galerisi
              </h1>
              <p className="text-xl text-orange-100 mb-8 max-w-2xl mx-auto">
                Profesyonel graderlar için en kapsamlı seçenekler. 
                İhtiyacınıza uygun graderı bulun.
              </p>
              
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="text-3xl font-bold mb-2">{graders.length}</div>
                  <div className="text-orange-100">Toplam Grader</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="text-3xl font-bold mb-2">{brands.length}</div>
                  <div className="text-orange-100">Marka</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                  <div className="text-3xl font-bold mb-2">{stockCountries.length}</div>
                  <div className="text-orange-100">Stok Ülkesi</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <div className={`lg:w-80 flex-shrink-0 ${showFilters ? 'block' : 'hidden lg:block'}`}>
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Filtreler</h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="lg:hidden p-1 hover:bg-gray-100 rounded"
                  >
                    <FiFilter className="w-5 h-5" />
                  </button>
                </div>

                {/* Brand Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Marka</h4>
                  <div className="space-y-2">
                    {brands.map(brand => (
                      <label key={brand} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.brand.includes(brand)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters({ brand: [...filters.brand, brand] });
                            } else {
                              setFilters({ brand: filters.brand.filter(b => b !== brand) });
                            }
                          }}
                          className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-700">{brand}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Fiyat Aralığı</h4>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Min Fiyat</label>
                      <input
                        type="number"
                        value={filters.price.min}
                        onChange={(e) => setFilters({
                          price: { ...filters.price, min: parseInt(e.target.value) || 0 }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Max Fiyat</label>
                      <input
                        type="number"
                        value={filters.price.max}
                        onChange={(e) => setFilters({
                          price: { ...filters.price, max: parseInt(e.target.value) || 50000000 }
                        })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Stock Country Filter */}
                <div className="mb-6">
                  <h4 className="font-medium text-gray-900 mb-3">Stok Ülkesi</h4>
                  <div className="space-y-2">
                    {stockCountries.map(country => (
                      <label key={country.value} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={filters.stockCountry.includes(country.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFilters({ stockCountry: [...filters.stockCountry, country.value] });
                            } else {
                              setFilters({ stockCountry: filters.stockCountry.filter(c => c !== country.value) });
                            }
                          }}
                          className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                        />
                        <span className="text-sm text-gray-700">
                          {country.flag} {country.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Clear Filters */}
                <button
                  onClick={() => setFilters({
                    brand: [],
                    price: { min: 0, max: 50000000 },
                    category: [],
                    stockCountry: []
                  })}
                  className="w-full py-2 px-4 text-orange-600 border border-orange-600 rounded-lg hover:bg-orange-50 transition-colors"
                >
                  Filtreleri Temizle
                </button>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              {/* Mobile Filter Button */}
              <div className="lg:hidden mb-6">
                <button
                  onClick={() => setShowFilters(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                >
                  <FiFilter className="w-4 h-4" />
                  <span>Filtreler</span>
                </button>
              </div>

              {/* Results Header */}
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {searchQuery ? `"${searchQuery}" için sonuçlar` : 'Tüm Graderlar'}
                    </h2>
                    <p className="text-gray-600">
                      {filteredGraders.length} grader bulundu
                    </p>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* Sort Dropdown */}
                    <div className="relative">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                      >
                        <option value="newest">En Yeni</option>
                        <option value="oldest">En Eski</option>
                        <option value="price-low">Fiyat (Düşük-Yüksek)</option>
                        <option value="price-high">Fiyat (Yüksek-Düşük)</option>
                      </select>
                      <FiChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>

                    {/* View Mode Toggle */}
                    <div className="flex bg-gray-100 rounded-lg p-1">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded-md transition-colors ${
                          viewMode === 'grid' 
                            ? 'bg-white text-orange-600 shadow-sm' 
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <FiGrid className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded-md transition-colors ${
                          viewMode === 'list' 
                            ? 'bg-white text-orange-600 shadow-sm' 
                            : 'text-gray-600 hover:text-gray-900'
                        }`}
                      >
                        <FiList className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Graders Grid/List */}
              {filteredGraders.length > 0 ? (
                <div className={`${
                  viewMode === 'grid' 
                    ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6' 
                    : 'space-y-4'
                }`}>
                  {filteredGraders.map(grader => (
                    <div
                      key={grader.id}
                      onClick={() => navigate(`/grader/${grader.id}`)}
                      className={`bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden ${
                        viewMode === 'list' ? 'flex' : ''
                      }`}
                    >
                      {/* Image */}
                      <div className={`relative ${viewMode === 'list' ? 'w-64 h-48' : 'h-48'}`}>
                        <img
                          src={grader.images[0]}
                          alt={grader.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-semibold px-2 py-1 rounded-full">
                          {getCountryFlag(grader.stockCountry)}
                        </div>
                        <div className={`absolute top-3 left-3 px-3 py-2 rounded-lg text-sm font-bold shadow-lg ${
                          grader.isSold 
                            ? 'bg-red-500 text-white' 
                            : 'bg-green-500 text-white'
                        }`}>
                          {grader.isSold ? 'SATILDI' : 'SATIŞTA'}
                        </div>
                      </div>

                      {/* Content */}
                      <div className={`p-4 ${viewMode === 'list' ? 'flex-1' : ''}`}>
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-gray-900 text-lg line-clamp-1">
                            {grader.title}
                          </h3>
                        </div>
                        
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-sm text-gray-600">{grader.brand}</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-sm text-gray-600">{grader.model}</span>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <FiCalendar className="w-4 h-4" />
                            <span>{formatDate(grader.listingDate)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <FiMapPin className="w-4 h-4" />
                            <span>{grader.location}</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-2xl font-bold text-orange-600">
                            {formatPrice(grader.price)}
                          </div>
                          <div className="flex items-center gap-1 text-yellow-500">
                            <FiStar className="w-4 h-4 fill-current" />
                            <span className="text-sm text-gray-600">4.8</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-white rounded-xl shadow-sm">
                  <div className="text-gray-400 mb-6">
                    <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.709M15 6.75a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    Aradığınız kriterlere uygun grader bulunamadı
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Filtreleri değiştirerek veya arama terimlerinizi güncelleyerek tekrar deneyin.
                  </p>
                  <button
                    onClick={() => setShowFilters(true)}
                    className="lg:hidden inline-flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    <FiFilter className="w-4 h-4" />
                    Filtreleri Aç
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Gallery;