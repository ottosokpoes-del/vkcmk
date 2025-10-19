import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { FiSearch, FiGrid, FiList, FiFilter, FiX } from 'react-icons/fi';
import { useAppStore } from '../store';
// GraderCard component removed - using inline cards for better performance
import FilterSidebar from '../components/FilterSidebar';
import Footer from '../components/Footer';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const SearchResults = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { graders, parts, filters } = useAppStore();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const searchQuery = searchParams.get('search') || '';
  const headerRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  // Filter both graders and parts based on search query AND filters
  const filteredGraders = graders.filter(grader => {
    // Search filter
    if (searchQuery && !(
      grader.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grader.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grader.model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grader.fuel.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grader.transmission.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grader.location.toLowerCase().includes(searchQuery.toLowerCase())
    )) {
      return false;
    }

    // Brand filter
    if (filters.brand.length > 0 && !filters.brand.includes(grader.brand || '')) {
      return false;
    }

    // Price filter
    if (filters.price && (grader.price < filters.price.min || grader.price > filters.price.max)) {
      return false;
    }

    // Stock country filter
    if (filters.stockCountry.length > 0 && !filters.stockCountry.includes(grader.stockCountry)) {
      return false;
    }

    // Sale status filter
    if (filters.saleStatus.length > 0) {
      const graderStatus = grader.isSold ? 'Satılmış' : 'Satılık';
      if (!filters.saleStatus.includes(graderStatus)) {
        return false;
      }
    }

    return true;
  });

  const filteredParts = parts.filter(part => {
    // Search filter
    if (searchQuery && !(
      part.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.partNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      part.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )) {
      return false;
    }

    // Brand filter
    if (filters.brand.length > 0 && !filters.brand.includes(part.brand || '')) {
      return false;
    }

    // Price filter
    if (filters.price && (part.price < filters.price.min || part.price > filters.price.max)) {
      return false;
    }

    // Category filter
    if (filters.category.length > 0 && !filters.category.includes(part.category)) {
      return false;
    }

    // Stock country filter
    if (filters.stockCountry.length > 0 && !filters.stockCountry.includes(part.stockCountry)) {
      return false;
    }

    // Sale status filter
    if (filters.saleStatus.length > 0) {
      const partStatus = part.isSold ? 'Satılmış' : 'Satılık';
      if (!filters.saleStatus.includes(partStatus)) {
        return false;
      }
    }

    return true;
  });

  const totalResults = filteredGraders.length + filteredParts.length;

  useEffect(() => {
    if (headerRef.current && statsRef.current) {
      gsap.fromTo(headerRef.current, 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
      );
      gsap.fromTo(statsRef.current, 
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.2, ease: "power2.out" }
      );
    }
  }, []);

  if (!searchQuery) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <FiSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Arama Yapın
            </h1>
            <p className="text-gray-600">
              Grader ve parça aramak için üst menüdeki arama kutusunu kullanın
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div ref={headerRef} className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Arama Sonuçları
              </h1>
              <p className="text-gray-600">
                "{searchQuery}" için {totalResults} sonuç bulundu
              </p>
            </div>
            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid'
                      ? 'bg-white text-orange-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FiGrid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list'
                      ? 'bg-white text-orange-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FiList className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Filter Button */}
              <button
                onClick={() => setShowMobileFilters(!showMobileFilters)}
                className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
              >
                <FiFilter className="w-4 h-4" />
                <span>Filtreler</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div ref={statsRef} className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-6">
              <span>
                <span className="font-semibold text-blue-600">{filteredGraders.length}</span> Grader
              </span>
              <span>
                <span className="font-semibold text-green-600">{filteredParts.length}</span> Parça
              </span>
              <span>
                <span className="font-semibold text-orange-600">{totalResults}</span> Toplam Sonuç
              </span>
            </div>
            <div className="text-gray-500">
              Ortalama Fiyat: ₺{Math.round(
                [...filteredGraders, ...filteredParts]
                  .reduce((sum, item) => sum + item.price, 0) / totalResults || 0
              ).toLocaleString()}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className={`lg:w-80 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="lg:hidden mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Filtreler</h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="p-2 text-gray-400 hover:text-gray-600"
              >
                <FiX className="w-5 h-5" />
              </button>
            </div>
            <FilterSidebar />
          </div>

          {/* Results */}
          <div className="flex-1">
            {totalResults > 0 ? (
              <div className="space-y-8">
                {/* Graders Section */}
                {filteredGraders.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-900">
                        Graderlar ({filteredGraders.length})
                      </h2>
                    </div>
                    <div className={`grid gap-6 ${
                      viewMode === 'grid' 
                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3' 
                        : 'grid-cols-1'
                    }`}>
                      {filteredGraders.map(grader => (
                        <div
                          key={grader.id}
                          onClick={() => navigate(`/grader/${grader.id}`)}
                          className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden"
                        >
                          {/* Image */}
                          <div className="relative h-48">
                            <img
                              src={grader.images[0]}
                              alt={grader.title}
                              className="w-full h-full object-cover"
                              loading="lazy"
                            />
                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-xs font-semibold px-2 py-1 rounded-full">
                              {grader.stockCountry === 'EU' ? '🇪🇺' : grader.stockCountry === 'Kenya' ? '🇰🇪' : '🇺🇸'}
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
                          <div className="p-4">
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
                                <span>{grader.year}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <span>{grader.location}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="text-2xl font-bold text-orange-600">
                                {new Intl.NumberFormat('tr-TR', {
                                  style: 'currency',
                                  currency: 'TRY',
                                  minimumFractionDigits: 0,
                                }).format(grader.price)}
                              </div>
                              <div className="flex items-center gap-1 text-yellow-500">
                                <span className="text-sm text-gray-600">4.8</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Parts Section */}
                {filteredParts.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-900">
                        Parçalar ({filteredParts.length})
                      </h2>
                    </div>
                    <div className={`grid gap-6 ${
                      viewMode === 'grid' 
                        ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' 
                        : 'grid-cols-1'
                    }`}>
                      {filteredParts.map(part => (
                        <div 
                          key={part.id} 
                          onClick={() => navigate(`/part/${part.id}`)}
                          className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                        >
                          {/* Image */}
                          <div className="aspect-[4/3] overflow-hidden">
                            <img
                              src={part.images[0]}
                              alt={part.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          
                          {/* Content */}
                          <div className="p-6 overflow-hidden">
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="text-lg font-bold text-gray-900 mb-1 break-words">
                                {part.title}
                              </h3>
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                  Parça
                                </span>
                                <span className={`text-xs px-2 py-1 rounded-lg font-bold ${
                                  part.isSold 
                                    ? 'bg-red-500 text-white' 
                                    : 'bg-green-500 text-white'
                                }`}>
                                  {part.isSold ? 'SATILDI' : 'SATIŞTA'}
                                </span>
                              </div>
                            </div>
                            
                            <p className="text-gray-600 text-sm mb-4 line-clamp-2 break-words overflow-hidden">
                              {part.description}
                            </p>
                            
                            <div className="flex items-center justify-between mb-4">
                              <div className="text-2xl font-bold text-orange-600">
                                ₺{part.price.toLocaleString()}
                              </div>
                              <div className="text-right text-sm text-gray-500">
                                <div>{part.brand}</div>
                                <div>{part.category}</div>
                              </div>
                            </div>
                            
                            <div className="flex flex-wrap gap-2 mb-4">
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                #{part.partNumber}
                              </span>
                              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                                {part.brand}
                              </span>
                            </div>
                            
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/part/${part.id}`);
                              }}
                              className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition-colors font-medium"
                            >
                              Detayları Gör
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-16">
                <FiSearch className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Sonuç Bulunamadı
                </h3>
                <p className="text-gray-600 mb-6">
                  "{searchQuery}" için grader veya parça bulunamadı
                </p>
                <div className="space-y-2 text-sm text-gray-500">
                  <p>• Farklı anahtar kelimeler deneyin</p>
                  <p>• Marka, model veya parça numarası ile arayın</p>
                  <p>• Yazım hatalarını kontrol edin</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default SearchResults;
