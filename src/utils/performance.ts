import React from 'react';

// Performance Monitoring Utilities
export interface PerformanceMetrics {
  fcp: number; // First Contentful Paint
  lcp: number; // Largest Contentful Paint
  fid: number; // First Input Delay
  cls: number; // Cumulative Layout Shift
  ttfb: number; // Time to First Byte
  loadTime: number; // Page Load Time
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: Partial<PerformanceMetrics> = {};
  private observers: PerformanceObserver[] = [];

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  init(): void {
    if (typeof window === 'undefined') return;

    // Measure Core Web Vitals
    this.measureCoreWebVitals();
    
    // Measure page load time
    this.measurePageLoadTime();
    
    // Measure resource loading
    this.measureResourceLoading();
    
    // Report metrics
    this.reportMetrics();
  }

  private measureCoreWebVitals(): void {
    // First Contentful Paint
    if ('PerformanceObserver' in window) {
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
        if (fcpEntry) {
          this.metrics.fcp = fcpEntry.startTime;
        }
      });
      fcpObserver.observe({ entryTypes: ['paint'] });
      this.observers.push(fcpObserver);
    }

    // Largest Contentful Paint
    if ('PerformanceObserver' in window) {
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          this.metrics.lcp = lastEntry.startTime;
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      this.observers.push(lcpObserver);
    }

    // First Input Delay
    if ('PerformanceObserver' in window) {
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (entry.processingStart && entry.startTime) {
            this.metrics.fid = entry.processingStart - entry.startTime;
          }
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });
      this.observers.push(fidObserver);
    }

    // Cumulative Layout Shift
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          if (!entry.hadRecentInput) {
            clsValue += (entry as any).value;
          }
        });
        this.metrics.cls = clsValue;
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
      this.observers.push(clsObserver);
    }
  }

  private measurePageLoadTime(): void {
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (navigation) {
        this.metrics.loadTime = navigation.loadEventEnd - navigation.fetchStart;
        this.metrics.ttfb = navigation.responseStart - navigation.fetchStart;
      }
    });
  }

  private measureResourceLoading(): void {
    if ('PerformanceObserver' in window) {
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          // Log slow resources
          if (entry.duration > 1000) {
            console.warn(`Slow resource: ${entry.name} took ${entry.duration}ms`);
          }
        });
      });
      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.push(resourceObserver);
    }
  }

  private reportMetrics(): void {
    // Report to analytics after page load
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.sendMetricsToAnalytics();
      }, 2000); // Wait 2 seconds for all metrics to be collected
    });
  }

  private sendMetricsToAnalytics(): void {
    const metrics = this.getMetrics();
    
    // Send to Google Analytics (if available)
    if (typeof gtag !== 'undefined') {
      gtag('event', 'web_vitals', {
        event_category: 'Performance',
        event_label: 'Core Web Vitals',
        custom_map: {
          fcp: metrics.fcp,
          lcp: metrics.lcp,
          fid: metrics.fid,
          cls: metrics.cls,
          ttfb: metrics.ttfb,
          load_time: metrics.loadTime
        }
      });
    }

    // Send to custom analytics endpoint
    this.sendToCustomEndpoint(metrics);
  }

  private sendToCustomEndpoint(metrics: PerformanceMetrics): void {
    // Send to your custom analytics endpoint
    fetch('/api/analytics/performance', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: window.location.href,
        timestamp: Date.now(),
        metrics
      })
    }).catch(error => {
      console.warn('Failed to send performance metrics:', error);
    });
  }

  getMetrics(): PerformanceMetrics {
    return {
      fcp: this.metrics.fcp || 0,
      lcp: this.metrics.lcp || 0,
      fid: this.metrics.fid || 0,
      cls: this.metrics.cls || 0,
      ttfb: this.metrics.ttfb || 0,
      loadTime: this.metrics.loadTime || 0
    };
  }

  // Performance scoring
  getPerformanceScore(): number {
    const metrics = this.getMetrics();
    let score = 100;

    // FCP scoring (0-3s is good)
    if (metrics.fcp > 3000) score -= 20;
    else if (metrics.fcp > 1800) score -= 10;

    // LCP scoring (0-2.5s is good)
    if (metrics.lcp > 4000) score -= 25;
    else if (metrics.lcp > 2500) score -= 15;

    // FID scoring (0-100ms is good)
    if (metrics.fid > 300) score -= 20;
    else if (metrics.fid > 100) score -= 10;

    // CLS scoring (0-0.1 is good)
    if (metrics.cls > 0.25) score -= 20;
    else if (metrics.cls > 0.1) score -= 10;

    return Math.max(0, score);
  }

  // Cleanup observers
  cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// React Hook for Performance Monitoring
export const usePerformanceMonitor = () => {
  const monitor = PerformanceMonitor.getInstance();

  React.useEffect(() => {
    monitor.init();
    
    return () => {
      monitor.cleanup();
    };
  }, []);

  return {
    getMetrics: () => monitor.getMetrics(),
    getScore: () => monitor.getPerformanceScore()
  };
};

// Bundle Analyzer (Development only)
export const analyzeBundleSize = () => {
  if (process.env.NODE_ENV !== 'development') return;

  const scripts = document.querySelectorAll('script[src]');
  const stylesheets = document.querySelectorAll('link[rel="stylesheet"]');
  
  console.group('Bundle Analysis');
  console.log('Scripts:', scripts.length);
  console.log('Stylesheets:', stylesheets.length);
  
  scripts.forEach(script => {
    const src = script.getAttribute('src');
    if (src) {
      console.log('Script:', src);
    }
  });
  
  stylesheets.forEach(link => {
    const href = link.getAttribute('href');
    if (href) {
      console.log('Stylesheet:', href);
    }
  });
  
  console.groupEnd();
};

// Memory Usage Monitor
export const monitorMemoryUsage = () => {
  if ('memory' in performance) {
    const memory = (performance as any).memory;
    console.log('Memory Usage:', {
      used: `${Math.round(memory.usedJSHeapSize / 1024 / 1024)} MB`,
      total: `${Math.round(memory.totalJSHeapSize / 1024 / 1024)} MB`,
      limit: `${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)} MB`
    });
  }
};

// Network Speed Monitor
export const monitorNetworkSpeed = () => {
  if ('connection' in navigator) {
    const connection = (navigator as any).connection;
    console.log('Network Info:', {
      effectiveType: connection.effectiveType,
      downlink: `${connection.downlink} Mbps`,
      rtt: `${connection.rtt} ms`,
      saveData: connection.saveData
    });
  }
};
