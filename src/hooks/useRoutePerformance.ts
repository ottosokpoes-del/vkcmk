import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export const useRoutePerformance = () => {
  const location = useLocation();
  const [routeLoadTime, setRouteLoadTime] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const startTime = performance.now();
    setIsLoading(true);

    // Simulate route loading completion
    const timer = setTimeout(() => {
      const endTime = performance.now();
      const loadTime = endTime - startTime;
      
      setRouteLoadTime(loadTime);
      setIsLoading(false);

      // Log performance in development
      if (process.env.NODE_ENV === 'development') {
        console.log(`Route ${location.pathname} loaded in ${loadTime.toFixed(2)}ms`);
      }
    }, 50); // Small delay to show loading state

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return {
    routeLoadTime,
    isLoading,
    currentPath: location.pathname
  };
};

// Hook for preloading pages
export const usePagePreloader = () => {
  const preloadPage = (path: string) => {
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
      return componentLoader();
    }
    return Promise.resolve();
  };

  const preloadCriticalPages = () => {
    const criticalPages = ['/gallery', '/parts', '/about'];
    
    criticalPages.forEach(path => {
      preloadPage(path).catch(() => {
        // Ignore preload errors
      });
    });
  };

  return {
    preloadPage,
    preloadCriticalPages
  };
};
