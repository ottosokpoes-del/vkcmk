import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiUser, FiLogOut, FiSearch, FiX, FiMenu } from 'react-icons/fi';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useAppStore } from '../store';

gsap.registerPlugin(ScrollTrigger);

const Navbar = () => {
  const navigate = useNavigate();
  const { user, favorites, setUser, cars } = useAppStore();
  const navbarRef = useRef<HTMLElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Add a small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const ctx = gsap.context(() => {
        // Wait for the navbar to be rendered
        const navbarElement = navbarRef.current;
        if (!navbarElement) return;

        // Navbar entrance animation
        gsap.from(navbarElement, {
          y: -60,
          duration: 0.8,
          ease: "power2.out"
        });

        // Scroll-triggered navbar animation
        ScrollTrigger.create({
          trigger: document.body,
          start: "top top",
          end: "bottom top",
          onUpdate: (self) => {
            if (self.scroll() > 100) {
              setIsScrolled(true);
              gsap.to(navbarElement, {
                scale: 0.98,
                duration: 0.3,
                ease: "power2.out"
              });
            } else {
              setIsScrolled(false);
              gsap.to(navbarElement, {
                scale: 1,
                duration: 0.3,
                ease: "power2.out"
              });
            }
          }
        });
      }, navbarRef);

      return () => ctx.revert();
    }, 100);

    return () => {
      clearTimeout(timer);
    };
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

  // Search functions
  const handleSearchClick = () => {
    setIsSearchOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeSearch = () => {
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
    setSelectedIndex(-1);
    document.body.style.overflow = 'unset';
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    if (query.length > 0) {
      const results = cars.filter(car => 
        car.title.toLowerCase().includes(query.toLowerCase()) ||
        car.brand?.toLowerCase().includes(query.toLowerCase()) ||
        car.model?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 8);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
    setSelectedIndex(-1);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeSearch();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => 
        prev < searchResults.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && searchResults[selectedIndex]) {
        navigate(`/car/${searchResults[selectedIndex].id}`);
        closeSearch();
      } else if (searchQuery.trim()) {
        navigate(`/gallery?search=${encodeURIComponent(searchQuery)}`);
        closeSearch();
      }
    }
  };

  const handleResultClick = (carId: string) => {
    navigate(`/car/${carId}`);
    closeSearch();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/gallery?search=${encodeURIComponent(searchQuery)}`);
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
        ref={navbarRef}
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
              <div className="w-10 h-10 bg-gradient-to-br from-sahibinden-red to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <span className="text-xl font-bold text-gray-900 hidden sm:block">CarMarket</span>
            </Link>

            {/* Center Navigation Links */}
            <div className="hidden lg:flex items-center space-x-8 mx-8">
              <Link 
                to="/" 
                className="relative text-gray-700 hover:text-sahibinden-red transition-colors font-medium px-3 py-2 rounded-lg hover:bg-gray-50 group"
              >
                <span>Ana Sayfa</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-sahibinden-red transition-all duration-300 group-hover:w-full"></div>
              </Link>
              <Link 
                to="/gallery" 
                className="relative text-gray-700 hover:text-sahibinden-red transition-colors font-medium px-3 py-2 rounded-lg hover:bg-gray-50 group"
              >
                <span>Galeri</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-sahibinden-red transition-all duration-300 group-hover:w-full"></div>
              </Link>
              <Link 
                to="/about" 
                className="relative text-gray-700 hover:text-sahibinden-red transition-colors font-medium px-3 py-2 rounded-lg hover:bg-gray-50 group"
              >
                <span>Hakkımızda</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-sahibinden-red transition-all duration-300 group-hover:w-full"></div>
              </Link>
              <Link 
                to="/contact" 
                className="relative text-gray-700 hover:text-sahibinden-red transition-colors font-medium px-3 py-2 rounded-lg hover:bg-gray-50 group"
              >
                <span>İletişim</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-sahibinden-red transition-all duration-300 group-hover:w-full"></div>
              </Link>
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-2">
              {/* Desktop Actions */}
              <div className="hidden lg:flex items-center space-x-2">
                {/* Search Button */}
                <button
                  onClick={handleSearchClick}
                  className="flex items-center space-x-2 bg-gray-50 hover:bg-gray-100 text-gray-600 hover:text-sahibinden-red px-4 py-2.5 rounded-xl transition-all duration-200 border border-gray-200 hover:border-sahibinden-red/30 hover:shadow-md"
                >
                  <FiSearch className="w-4 h-4" />
                  <span className="text-sm font-medium">Araç Ara...</span>
                </button>

                {/* Favorites */}
                <Link 
                  to="/favorites" 
                  className="relative p-2.5 text-gray-600 hover:text-sahibinden-red hover:bg-gray-50 rounded-lg transition-all duration-200"
                >
                  <FiHeart className="w-5 h-5" />
                  {favorites.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-sahibinden-red to-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold shadow-lg">
                      {favorites.length}
                    </span>
                  )}
                </Link>

                {/* User Menu */}
                {user ? (
                  <div className="relative group">
                    <button className="flex items-center space-x-2 p-2.5 text-gray-600 hover:text-sahibinden-red hover:bg-gray-50 rounded-lg transition-all duration-200">
                      <div className="w-8 h-8 bg-gradient-to-br from-sahibinden-red to-red-600 rounded-full flex items-center justify-center">
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
                    className="bg-gradient-to-r from-sahibinden-red to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-medium px-6 py-2.5 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Giriş Yap
                  </Link>
                )}
              </div>

              {/* Mobile Actions */}
              <div className="lg:hidden flex items-center space-x-2">
                {/* Mobile Search Button */}
                <button 
                  onClick={handleSearchClick}
                  className="p-2.5 text-gray-600 hover:text-sahibinden-red hover:bg-gray-50 rounded-lg transition-all duration-200"
                >
                  <FiSearch className="w-5 h-5" />
                </button>

                {/* Mobile Favorites */}
                <Link 
                  to="/favorites" 
                  className="relative p-2.5 text-gray-600 hover:text-sahibinden-red hover:bg-gray-50 rounded-lg transition-all duration-200"
                >
                  <FiHeart className="w-5 h-5" />
                  {favorites.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-sahibinden-red to-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-semibold shadow-lg">
                      {favorites.length}
                    </span>
                  )}
                </Link>

                {/* Mobile Menu Button */}
                <button
                  onClick={toggleMobileMenu}
                  className="p-2.5 text-gray-600 hover:text-sahibinden-red hover:bg-gray-50 rounded-lg transition-all duration-200"
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
                  className="flex items-center px-4 py-3 text-gray-700 hover:text-sahibinden-red hover:bg-gray-50 rounded-lg transition-colors font-medium"
                >
                  Ana Sayfa
                </Link>
                <Link 
                  to="/gallery" 
                  onClick={closeMobileMenu}
                  className="flex items-center px-4 py-3 text-gray-700 hover:text-sahibinden-red hover:bg-gray-50 rounded-lg transition-colors font-medium"
                >
                  Galeri
                </Link>
                <Link 
                  to="/about" 
                  onClick={closeMobileMenu}
                  className="flex items-center px-4 py-3 text-gray-700 hover:text-sahibinden-red hover:bg-gray-50 rounded-lg transition-colors font-medium"
                >
                  Hakkımızda
                </Link>
                <Link 
                  to="/contact" 
                  onClick={closeMobileMenu}
                  className="flex items-center px-4 py-3 text-gray-700 hover:text-sahibinden-red hover:bg-gray-50 rounded-lg transition-colors font-medium"
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
                        className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-sahibinden-red hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-xs">A</span>
                        </div>
                        <span>Admin Panel</span>
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-3 text-gray-700 hover:text-sahibinden-red hover:bg-gray-50 rounded-lg transition-colors"
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
                    className="w-full bg-gradient-to-r from-sahibinden-red to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-medium px-6 py-3 rounded-xl transition-all duration-200 shadow-lg flex items-center justify-center"
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
                  placeholder="Search cars..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onKeyDown={handleKeyDown}
                  className="w-full pl-12 pr-12 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-sahibinden-red focus:border-transparent bg-gray-50 focus:bg-white transition-colors"
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
            <div className="max-h-96 overflow-y-auto">
              {searchQuery.length > 0 && searchResults.length > 0 ? (
                <div className="p-2">
                  {searchResults.map((car, index) => (
                    <button
                      key={car.id}
                      onClick={() => handleResultClick(car.id)}
                      className={`w-full text-left p-4 rounded-lg transition-colors ${
                        selectedIndex === index
                          ? 'bg-sahibinden-red/10 border border-sahibinden-red/20'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={car.images[0]}
                          alt={car.title}
                          className="w-12 h-8 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{car.title}</h3>
                          <p className="text-sm text-gray-600">
                            {car.year} • {car.mileage ? car.mileage.toLocaleString('tr-TR') : 'N/A'} km • {car.fuel}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-sahibinden-red">
                            {new Intl.NumberFormat('tr-TR', {
                              style: 'currency',
                              currency: 'TRY',
                              minimumFractionDigits: 0,
                            }).format(car.price)}
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
                  <p className="text-lg font-medium mb-2">Search for cars</p>
                  <p className="text-sm">Type a car brand, model, or any keyword</p>
                </div>
              ) : null}
            </div>

            {/* Search Actions */}
            {searchQuery.length > 0 && (
              <div className="p-4 border-t border-gray-200 bg-gray-50">
                <button
                  onClick={handleSearchSubmit}
                  className="w-full bg-sahibinden-red text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  Search for "{searchQuery}"
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