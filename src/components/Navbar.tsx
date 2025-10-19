import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiLogOut, FiSearch, FiX, FiMenu } from 'react-icons/fi';
import { useAppStore } from '../store';

const Navbar = () => {
  const navigate = useNavigate();
  const { user, setUser, graders, parts } = useAppStore();
  const searchRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    setUser(null);
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Clean search functions
  const openSearch = () => {
    setIsSearchOpen(true);
    setTimeout(() => {
      const input = searchRef.current?.querySelector('input');
      if (input) input.focus();
    }, 100);
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    setSelectedIndex(-1);
  };

  const handleSearchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSelectedIndex(-1);

    if (query.trim()) {
      const queryLower = query.toLowerCase();
      
      // Search in both graders and parts with priority for exact matches
      const allResults = [
        ...graders.map(grader => ({ ...grader, type: 'grader' })),
        ...parts.map(part => ({ ...part, type: 'part' }))
      ].filter(item => {
        // Exact part number match gets highest priority
        if (item.type === 'part' && item.partNumber?.toLowerCase() === queryLower) {
          return true;
        }
        
        // Partial part number match
        if (item.type === 'part' && item.partNumber?.toLowerCase().includes(queryLower)) {
          return true;
        }
        
        // Title match
        if (item.title.toLowerCase().includes(queryLower)) {
          return true;
        }
        
        // Brand match
        if (item.brand?.toLowerCase().includes(queryLower)) {
          return true;
        }
        
        // Model match (for graders)
        if (item.type === 'grader' && item.model?.toLowerCase().includes(queryLower)) {
          return true;
        }
        
        // Category match (for parts)
        if (item.type === 'part' && item.category?.toLowerCase().includes(queryLower)) {
          return true;
        }
        
        // Description match
        if (item.description?.toLowerCase().includes(queryLower)) {
          return true;
        }
        
        return false;
      }).sort((a, b) => {
        // Sort by relevance: exact part number matches first, then partial matches
        const aIsExactPartNumber = a.type === 'part' && a.partNumber?.toLowerCase() === queryLower;
        const bIsExactPartNumber = b.type === 'part' && b.partNumber?.toLowerCase() === queryLower;
        
        if (aIsExactPartNumber && !bIsExactPartNumber) return -1;
        if (!aIsExactPartNumber && bIsExactPartNumber) return 1;
        
        // Then partial part number matches
        const aIsPartialPartNumber = a.type === 'part' && a.partNumber?.toLowerCase().includes(queryLower);
        const bIsPartialPartNumber = b.type === 'part' && b.partNumber?.toLowerCase().includes(queryLower);
        
        if (aIsPartialPartNumber && !bIsPartialPartNumber) return -1;
        if (!aIsPartialPartNumber && bIsPartialPartNumber) return 1;
        
        return 0;
      }).slice(0, 8);

      setSearchResults(allResults);
    } else {
      setSearchResults([]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeSearch();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => prev < searchResults.length - 1 ? prev + 1 : prev);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && searchResults[selectedIndex]) {
        const result = searchResults[selectedIndex];
        navigate(result.type === 'grader' ? `/grader/${result.id}` : `/part/${result.id}`);
        closeSearch();
      } else {
        performSearch();
      }
    }
  };

  const handleResultClick = (result: any) => {
    navigate(result.type === 'grader' ? `/grader/${result.id}` : `/part/${result.id}`);
    closeSearch();
  };

  const performSearch = () => {
    if (searchQuery.trim()) {
      navigate(`/search?search=${encodeURIComponent(searchQuery)}`);
      closeSearch();
    }
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        closeSearch();
      }
    };

    if (isSearchOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isSearchOpen]);

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <nav 
        className={`navbar-content fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
            : 'bg-white shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-orange-600 to-orange-700 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">GraderMarket</span>
            </Link>

            {/* Center Navigation Links */}
            <div className="hidden lg:flex items-center space-x-8 mx-8">
              <Link 
                to="/" 
                className="relative text-gray-700 hover:text-orange-600 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-gray-50 group"
              >
                <span>Ana Sayfa</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-600 transition-all duration-300 group-hover:w-full"></div>
              </Link>
              <Link 
                to="/gallery" 
                className="relative text-gray-700 hover:text-orange-600 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-gray-50 group"
              >
                <span>Galeri</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-600 transition-all duration-300 group-hover:w-full"></div>
              </Link>
              <Link 
                to="/parts" 
                className="relative text-gray-700 hover:text-orange-600 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-gray-50 group"
              >
                <span>Parçalar</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-600 transition-all duration-300 group-hover:w-full"></div>
              </Link>
              <Link 
                to="/about" 
                className="relative text-gray-700 hover:text-orange-600 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-gray-50 group"
              >
                <span>Hakkımızda</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-600 transition-all duration-300 group-hover:w-full"></div>
              </Link>
              <Link 
                to="/contact" 
                className="relative text-gray-700 hover:text-orange-600 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-gray-50 group"
              >
                <span>İletişim</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-orange-600 transition-all duration-300 group-hover:w-full"></div>
              </Link>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2">
              {/* Desktop Actions */}
              <div className="hidden lg:flex items-center space-x-2">
                {/* Search Button */}
                <button
                  onClick={openSearch}
                  className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-orange-600 px-4 py-2.5 rounded-xl transition-all duration-200 border border-gray-200 hover:border-orange-600/30 hover:shadow-md"
                >
                  <FiSearch className="w-4 h-4" />
                  <span className="text-sm font-medium">Ara...</span>
                </button>

                {/* User Menu */}
                {user ? (
                  <div className="relative group">
                    <button className="flex items-center space-x-2 p-2.5 text-gray-600 hover:text-orange-600 hover:bg-gray-50 rounded-lg transition-all duration-200">
                      <div className="w-8 h-8 bg-gradient-to-br from-orange-600 to-orange-700 rounded-full flex items-center justify-center">
                        <FiUser className="w-4 h-4 text-white" />
                      </div>
                      <span className="font-medium">{user.username}</span>
                    </button>
                    
                    {/* Dropdown */}
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-xl border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                      <div className="py-2">
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">{user.username}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                        {user.role === 'admin' && (
                          <Link 
                            to="/admin" 
                            className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <span className="text-blue-600 font-semibold text-xs">A</span>
                            </div>
                            <span>Admin Panel</span>
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                            <FiLogOut className="w-4 h-4 text-red-600" />
                          </div>
                          <span>Çıkış Yap</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link 
                    to="/login" 
                    className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Giriş Yap
                  </Link>
                )}
              </div>

              {/* Mobile Actions */}
              <div className="lg:hidden flex items-center space-x-2">
                {/* Mobile Search Button */}
                <button 
                  onClick={openSearch}
                  className="p-2.5 text-gray-600 hover:text-orange-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
                >
                  <FiSearch className="w-5 h-5" />
                </button>

                {/* Mobile Menu Button */}
                <button
                  onClick={toggleMobileMenu}
                  className="p-2.5 text-gray-600 hover:text-orange-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
                >
                  <FiMenu className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden">
          <div className="absolute top-16 left-0 right-0 bg-white shadow-xl border-t border-gray-200">
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Navigation Links */}
              <div className="space-y-2">
                <Link 
                  to="/" 
                  onClick={closeMobileMenu}
                  className="flex items-center px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                >
                  Ana Sayfa
                </Link>
                <Link 
                  to="/gallery" 
                  onClick={closeMobileMenu}
                  className="flex items-center px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                >
                  Galeri
                </Link>
                <Link 
                  to="/parts" 
                  onClick={closeMobileMenu}
                  className="flex items-center px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                >
                  Parçalar
                </Link>
                <Link 
                  to="/about" 
                  onClick={closeMobileMenu}
                  className="flex items-center px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                >
                  Hakkımızda
                </Link>
                <Link 
                  to="/contact" 
                  onClick={closeMobileMenu}
                  className="flex items-center px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                >
                  İletişim
                </Link>
              </div>

              {/* Mobile User Section */}
              <div className="border-t border-gray-200 pt-4">
                {user ? (
                  <div className="space-y-2">
                    <div className="px-4 py-3 bg-gray-50 rounded-lg">
                      <p className="text-sm font-medium text-gray-900">{user.username}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                    {user.role === 'admin' && (
                        <Link 
                          to="/admin" 
                          onClick={closeMobileMenu}
                          className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-lg transition-colors"
                        >
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-xs">A</span>
                          </div>
                          <span>Admin Panel</span>
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-orange-600 hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                          <FiLogOut className="w-4 h-4 text-red-600" />
                        </div>
                        <span>Çıkış Yap</span>
                      </button>
                    </div>
                  ) : (
                    <Link 
                      to="/login" 
                      onClick={closeMobileMenu}
                      className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white text-sm font-medium px-6 py-3 rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center"
                    >
                      Giriş Yap
                    </Link>
                  )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-start justify-center pt-20">
          <div 
            ref={searchRef}
            className="bg-white rounded-xl shadow-2xl w-full max-w-2xl mx-4 overflow-hidden"
          >
            {/* Search Input */}
            <div className="p-6 border-b border-gray-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Parça numarası, grader veya parça ara..."
                  value={searchQuery}
                  onChange={handleSearchInput}
                  onKeyDown={handleKeyPress}
                  className="w-full pl-12 pr-12 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-600 focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
                  autoFocus
                />
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <button
                  onClick={closeSearch}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Search Results */}
            <div className="max-h-[500px] overflow-y-auto">
              {searchQuery.length > 0 && searchResults.length > 0 ? (
                <div className="p-2">
                  {searchResults.map((result, index) => (
                    <button
                      key={result.id}
                      onClick={() => handleResultClick(result)}
                      className={`w-full text-left p-4 rounded-lg transition-colors ${
                        selectedIndex === index
                          ? 'bg-orange-600/10 border border-orange-600/20'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={result.images[0]}
                          alt={result.title}
                          className="w-12 h-8 object-cover rounded"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-gray-900">{result.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              result.type === 'grader' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {result.type === 'grader' ? 'Grader' : 'Parça'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {result.type === 'grader' 
                              ? `${result.year} • ${result.operatingHours ? result.operatingHours.toLocaleString('tr-TR') : 'N/A'} saat • ${result.fuel}`
                              : `${result.brand} • ${result.category}`
                            }
                          </p>
                          {result.type === 'part' && (
                            <p className="text-xs text-orange-600 font-medium mt-1">
                              Parça No: {result.partNumber}
                            </p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-orange-600">
                            {new Intl.NumberFormat('tr-TR', {
                              style: 'currency',
                              currency: 'TRY',
                              minimumFractionDigits: 0,
                            }).format(result.price)}
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              ) : searchQuery.length > 0 && searchResults.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <FiSearch className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">No results found</p>
                  <p className="text-sm">Try searching with different keywords</p>
                </div>
              ) : searchQuery.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <FiSearch className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium mb-2">Parça numarası ile ara</p>
                  <p className="text-sm">Parça numarası, marka, model veya herhangi bir anahtar kelime yazın</p>
                </div>
              ) : null}
            </div>

            {/* Search Actions */}
            {searchQuery.length > 0 && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={performSearch}
                  className="w-full bg-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-orange-700 transition-colors"
                >
                  "{searchQuery}" için ara
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;