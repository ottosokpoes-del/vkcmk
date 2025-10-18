import React, { useEffect } from 'react';
import { SecurityConfig } from '../config/security';

// Security middleware component
export const SecurityProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  useEffect(() => {
    // Apply security headers
    const applySecurityHeaders = () => {
      const headers = SecurityConfig.getSecurityHeaders();
      
      // Apply meta tags for security (only in production)
      if (process.env.NODE_ENV === 'production') {
        Object.entries(headers).forEach(([key, value]) => {
          if (key === 'Content-Security-Policy') {
            const meta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
            if (meta) {
              meta.setAttribute('content', value);
            } else {
              const newMeta = document.createElement('meta');
              newMeta.setAttribute('http-equiv', 'Content-Security-Policy');
              newMeta.setAttribute('content', value);
              document.head.appendChild(newMeta);
            }
          }
        });
      }
    };

    // Disable right-click context menu in production
    const disableContextMenu = (e: MouseEvent) => {
      if (process.env.NODE_ENV === 'production') {
        e.preventDefault();
      }
    };

    // Disable F12 and other dev tools shortcuts in production
    const disableDevTools = (e: KeyboardEvent) => {
      if (process.env.NODE_ENV === 'production') {
        // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
        if (
          e.key === 'F12' ||
          (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
          (e.ctrlKey && e.key === 'U')
        ) {
          e.preventDefault();
        }
      }
    };

    // Apply security measures
    applySecurityHeaders();
    document.addEventListener('contextmenu', disableContextMenu);
    document.addEventListener('keydown', disableDevTools);

    // Cleanup
    return () => {
      document.removeEventListener('contextmenu', disableContextMenu);
      document.removeEventListener('keydown', disableDevTools);
    };
  }, []);

  return <>{children}</>;
};

// HTTPS redirect component
export const HTTPSRedirect: React.FC = () => {
  useEffect(() => {
    if (SecurityConfig.settings.enableHTTPS && window.location.protocol !== 'https:') {
      window.location.replace(`https:${window.location.href.substring(window.location.protocol.length)}`);
    }
  }, []);

  return null;
};

// Security monitoring component
export const SecurityMonitor: React.FC = () => {
  useEffect(() => {
    // Monitor for suspicious activities
    const monitorActivity = () => {
      // Check for XSS attempts
      const checkXSS = () => {
        const scripts = document.querySelectorAll('script');
        scripts.forEach(script => {
          if (script.src && !script.src.startsWith(window.location.origin)) {
            console.warn('Suspicious external script detected:', script.src);
          }
        });
      };

      // Check for unauthorized iframes
      const checkIframes = () => {
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
          if (iframe.src && !iframe.src.startsWith(window.location.origin)) {
            console.warn('Suspicious external iframe detected:', iframe.src);
          }
        });
      };

      checkXSS();
      checkIframes();
    };

    // Run monitoring periodically
    const interval = setInterval(monitorActivity, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return null;
};
