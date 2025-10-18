// Security configuration and environment validation
export const SecurityConfig = {
  // Environment validation
  validateEnvironment: () => {
    const requiredEnvVars = [
      'REACT_APP_ENCRYPTION_KEY',
      'REACT_APP_API_URL'
    ];

    const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      // Set default values for both development and production
      if (!process.env.REACT_APP_ENCRYPTION_KEY) {
        process.env.REACT_APP_ENCRYPTION_KEY = 'prod-encryption-key-32-chars-long-2024';
      }
      if (!process.env.REACT_APP_API_URL) {
        process.env.REACT_APP_API_URL = 'https://api.premiumcarmarket.com';
      }
      console.log('Using default values for missing environment variables');
    }
  },

  // Security headers configuration
  getSecurityHeaders: () => {
    const headers: Record<string, string> = {
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'X-XSS-Protection': '1; mode=block',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
      'Strict-Transport-Security': `max-age=${process.env.REACT_APP_HSTS_MAX_AGE || 31536000}; includeSubDomains`,
    };

    // Only add CSP in production
    if (process.env.NODE_ENV === 'production') {
      headers['Content-Security-Policy'] = process.env.REACT_APP_CSP_POLICY || "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data: blob:; img-src 'self' data: https: blob:; connect-src 'self' https:; frame-src 'self' https://www.google.com https://maps.google.com;";
    }

    return headers;
  },

  // API configuration
  apiConfig: {
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
    timeout: 10000,
    retries: 3,
    retryDelay: 1000
  },

  // Security settings
  settings: {
    enableHTTPS: process.env.NODE_ENV === 'production',
    enableCSP: process.env.NODE_ENV === 'production', // Only enable CSP in production
    enableHSTS: process.env.NODE_ENV === 'production',
    enableXSSProtection: true,
    enableClickjackingProtection: true,
    enableMIMESniffingProtection: true
  }
};

// Initialize security on app start
SecurityConfig.validateEnvironment();
