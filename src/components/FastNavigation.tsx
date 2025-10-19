import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface FastLinkProps {
  to: string;
  children: React.ReactNode;
  className?: string;
  preloadOnHover?: boolean;
}

export const FastLink: React.FC<FastLinkProps> = ({ 
  to, 
  children, 
  className = '', 
  preloadOnHover = true 
}) => {
  const [isPreloading, setIsPreloading] = useState(false);
  const location = useLocation();
  const isActive = location.pathname === to;

  // Preload page on hover
  const handleMouseEnter = () => {
    if (preloadOnHover && !isPreloading) {
      setIsPreloading(true);
      // Preload the page component
      preloadPageComponent(to);
    }
  };

  const preloadPageComponent = (path: string) => {
    // Map paths to their corresponding components
    const pathToComponent: Record<string, () => Promise<any>> = {
      '/gallery': () => import('../pages/Gallery'),
      '/parts': () => import('../pages/Parts'),
      '/about': () => import('../pages/About'),
      '/contact': () => import('../pages/Contact'),
      '/faq': () => import('../pages/FAQ'),
      '/login': () => import('../pages/Login'),
      '/register': () => import('../pages/Register'),
      '/favorites': () => import('../pages/Favorites'),
      '/admin': () => import('../pages/AdminDashboard'),
    };

    const componentLoader = pathToComponent[path];
    if (componentLoader) {
      componentLoader().catch(() => {
        // Ignore preload errors
      });
    }
  };

  return (
    <Link
      to={to}
      className={`${className} ${isActive ? 'active' : ''} transition-colors duration-200`}
      onMouseEnter={handleMouseEnter}
    >
      {children}
      {isPreloading && (
        <span className="ml-1 text-xs text-blue-500">⚡</span>
      )}
    </Link>
  );
};

// Navigation component with fast links
export const FastNavigation: React.FC = () => {
  const location = useLocation();

  // Preload critical pages on mount
  useEffect(() => {
    const criticalPages = [
      '/gallery',
      '/parts',
      '/about'
    ];

    // Preload critical pages after a short delay
    const timer = setTimeout(() => {
      criticalPages.forEach(path => {
        preloadPageComponent(path);
      });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const preloadPageComponent = (path: string) => {
    const pathToComponent: Record<string, () => Promise<any>> = {
      '/gallery': () => import('../pages/Gallery'),
      '/parts': () => import('../pages/Parts'),
      '/about': () => import('../pages/About'),
      '/contact': () => import('../pages/Contact'),
      '/faq': () => import('../pages/FAQ'),
    };

    const componentLoader = pathToComponent[path];
    if (componentLoader) {
      componentLoader().catch(() => {
        // Ignore preload errors
      });
    }
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex space-x-8">
            <FastLink 
              to="/" 
              className="flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-blue-600"
            >
              Ana Sayfa
            </FastLink>
            <FastLink 
              to="/gallery" 
              className="flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-blue-600"
            >
              Galeri
            </FastLink>
            <FastLink 
              to="/parts" 
              className="flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-blue-600"
            >
              Yedek Parçalar
            </FastLink>
            <FastLink 
              to="/about" 
              className="flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-blue-600"
            >
              Hakkımızda
            </FastLink>
            <FastLink 
              to="/contact" 
              className="flex items-center px-1 pt-1 text-sm font-medium text-gray-900 hover:text-blue-600"
            >
              İletişim
            </FastLink>
          </div>
        </div>
      </div>
    </nav>
  );
};
