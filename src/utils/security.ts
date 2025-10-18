import CryptoJS from 'crypto-js';

// Security configuration
export const SECURITY_CONFIG = {
  // Password requirements
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_REQUIRE_UPPERCASE: true,
  PASSWORD_REQUIRE_LOWERCASE: true,
  PASSWORD_REQUIRE_NUMBERS: true,
  PASSWORD_REQUIRE_SYMBOLS: true,
  
  // Session configuration
  SESSION_TIMEOUT: 30 * 60 * 1000, // 30 minutes
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION: 15 * 60 * 1000, // 15 minutes
  
  // Input validation
  MAX_INPUT_LENGTH: 1000,
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  
  // Rate limiting
  RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
  RATE_LIMIT_MAX_REQUESTS: 100,
};

// Encryption utilities
export class SecurityUtils {
  private static readonly SECRET_KEY = process.env.REACT_APP_ENCRYPTION_KEY || 'default-secret-key-change-in-production';

  // Encrypt sensitive data
  static encrypt(data: string): string {
    return CryptoJS.AES.encrypt(data, this.SECRET_KEY).toString();
  }

  // Decrypt sensitive data
  static decrypt(encryptedData: string): string {
    const bytes = CryptoJS.AES.decrypt(encryptedData, this.SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  }

  // Hash password
  static hashPassword(password: string): string {
    return CryptoJS.SHA256(password + this.SECRET_KEY).toString();
  }

  // Generate secure random token
  static generateSecureToken(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Validate password strength
  static validatePasswordStrength(password: string): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (password.length < SECURITY_CONFIG.PASSWORD_MIN_LENGTH) {
      errors.push(`Password must be at least ${SECURITY_CONFIG.PASSWORD_MIN_LENGTH} characters long`);
    }

    if (SECURITY_CONFIG.PASSWORD_REQUIRE_UPPERCASE && !/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (SECURITY_CONFIG.PASSWORD_REQUIRE_LOWERCASE && !/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (SECURITY_CONFIG.PASSWORD_REQUIRE_NUMBERS && !/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (SECURITY_CONFIG.PASSWORD_REQUIRE_SYMBOLS && !/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  // Sanitize HTML input
  static sanitizeHtml(input: string): string {
    const div = document.createElement('div');
    div.textContent = input;
    return div.innerHTML;
  }

  // Validate email format
  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate URL format
  static validateUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  // Check for XSS patterns
  static detectXSS(input: string): boolean {
    const xssPatterns = [
      /<script[^>]*>.*?<\/script>/gi,
      /javascript:/gi,
      /on\w+\s*=/gi,
      /<iframe[^>]*>.*?<\/iframe>/gi,
      /<object[^>]*>.*?<\/object>/gi,
      /<embed[^>]*>.*?<\/embed>/gi,
      /<link[^>]*>.*?<\/link>/gi,
      /<meta[^>]*>.*?<\/meta>/gi,
      /<style[^>]*>.*?<\/style>/gi,
      /expression\s*\(/gi,
      /url\s*\(/gi,
      /vbscript:/gi,
      /data:text\/html/gi,
    ];

    return xssPatterns.some(pattern => pattern.test(input));
  }

  // Rate limiting helper
  static createRateLimiter() {
    const requests = new Map<string, { count: number; resetTime: number }>();

    return (identifier: string): boolean => {
      const now = Date.now();
      const userRequests = requests.get(identifier);

      if (!userRequests || now > userRequests.resetTime) {
        requests.set(identifier, {
          count: 1,
          resetTime: now + SECURITY_CONFIG.RATE_LIMIT_WINDOW
        });
        return true;
      }

      if (userRequests.count >= SECURITY_CONFIG.RATE_LIMIT_MAX_REQUESTS) {
        return false;
      }

      userRequests.count++;
      return true;
    };
  }

  // Generate CSRF token
  static generateCSRFToken(): string {
    return this.generateSecureToken(32);
  }

  // Validate CSRF token
  static validateCSRFToken(token: string, sessionToken: string): boolean {
    return token === sessionToken;
  }
}

// Input validation utilities
export class InputValidator {
  // Validate text input
  static validateText(input: string, options: {
    minLength?: number;
    maxLength?: number;
    required?: boolean;
    pattern?: RegExp;
    sanitize?: boolean;
  } = {}): { isValid: boolean; value: string; error?: string } {
    const {
      minLength = 0,
      maxLength = SECURITY_CONFIG.MAX_INPUT_LENGTH,
      required = false,
      pattern,
      sanitize = true
    } = options;

    // Check if required and empty
    if (required && (!input || input.trim().length === 0)) {
      return { isValid: false, value: '', error: 'This field is required' };
    }

    // Check minimum length
    if (input && input.length < minLength) {
      return { isValid: false, value: input, error: `Minimum length is ${minLength} characters` };
    }

    // Check maximum length
    if (input && input.length > maxLength) {
      return { isValid: false, value: input, error: `Maximum length is ${maxLength} characters` };
    }

    // Check pattern
    if (pattern && input && !pattern.test(input)) {
      return { isValid: false, value: input, error: 'Invalid format' };
    }

    // Detect XSS
    if (SecurityUtils.detectXSS(input)) {
      return { isValid: false, value: input, error: 'Invalid characters detected' };
    }

    // Sanitize if requested
    const sanitizedValue = sanitize ? SecurityUtils.sanitizeHtml(input) : input;

    return { isValid: true, value: sanitizedValue };
  }

  // Validate number input
  static validateNumber(input: string | number, options: {
    min?: number;
    max?: number;
    required?: boolean;
    integer?: boolean;
  } = {}): { isValid: boolean; value: number; error?: string } {
    const {
      min = Number.MIN_SAFE_INTEGER,
      max = Number.MAX_SAFE_INTEGER,
      required = false,
      integer = false
    } = options;

    const numValue = typeof input === 'string' ? parseFloat(input) : input;

    // Check if required and empty
    if (required && (isNaN(numValue) || input === '')) {
      return { isValid: false, value: 0, error: 'This field is required' };
    }

    // Check if valid number
    if (isNaN(numValue)) {
      return { isValid: false, value: 0, error: 'Must be a valid number' };
    }

    // Check integer requirement
    if (integer && !Number.isInteger(numValue)) {
      return { isValid: false, value: numValue, error: 'Must be a whole number' };
    }

    // Check range
    if (numValue < min) {
      return { isValid: false, value: numValue, error: `Minimum value is ${min}` };
    }

    if (numValue > max) {
      return { isValid: false, value: numValue, error: `Maximum value is ${max}` };
    }

    return { isValid: true, value: numValue };
  }

  // Validate URL input
  static validateUrl(input: string, required: boolean = false): { isValid: boolean; value: string; error?: string } {
    if (required && (!input || input.trim().length === 0)) {
      return { isValid: false, value: '', error: 'URL is required' };
    }

    if (input && !SecurityUtils.validateUrl(input)) {
      return { isValid: false, value: input, error: 'Invalid URL format' };
    }

    return { isValid: true, value: input };
  }

  // Validate email input
  static validateEmail(input: string, required: boolean = false): { isValid: boolean; value: string; error?: string } {
    if (required && (!input || input.trim().length === 0)) {
      return { isValid: false, value: '', error: 'Email is required' };
    }

    if (input && !SecurityUtils.validateEmail(input)) {
      return { isValid: false, value: input, error: 'Invalid email format' };
    }

    return { isValid: true, value: input };
  }
}

// Session management
export class SessionManager {
  private static readonly SESSION_KEY = 'secure_session';
  private static readonly CSRF_KEY = 'csrf_token';

  // Create secure session
  static createSession(user: any): void {
    const sessionData = {
      user: SecurityUtils.encrypt(JSON.stringify(user)),
      timestamp: Date.now(),
      csrfToken: SecurityUtils.generateCSRFToken()
    };

    localStorage.setItem(this.SESSION_KEY, SecurityUtils.encrypt(JSON.stringify(sessionData)));
    localStorage.setItem(this.CSRF_KEY, sessionData.csrfToken);
  }

  // Get current session
  static getSession(): any | null {
    try {
      const encryptedSession = localStorage.getItem(this.SESSION_KEY);
      if (!encryptedSession) return null;

      const sessionData = JSON.parse(SecurityUtils.decrypt(encryptedSession));
      
      // Check session timeout
      if (Date.now() - sessionData.timestamp > SECURITY_CONFIG.SESSION_TIMEOUT) {
        this.clearSession();
        return null;
      }

      return JSON.parse(SecurityUtils.decrypt(sessionData.user));
    } catch (error) {
      console.error('Session error:', error);
      this.clearSession();
      return null;
    }
  }

  // Get CSRF token
  static getCSRFToken(): string | null {
    return localStorage.getItem(this.CSRF_KEY);
  }

  // Validate CSRF token
  static validateCSRFToken(token: string): boolean {
    const sessionToken = this.getCSRFToken();
    return token === sessionToken;
  }

  // Clear session
  static clearSession(): void {
    localStorage.removeItem(this.SESSION_KEY);
    localStorage.removeItem(this.CSRF_KEY);
  }

  // Check if user is authenticated
  static isAuthenticated(): boolean {
    return this.getSession() !== null;
  }

  // Check if user has specific role
  static hasRole(role: string): boolean {
    const session = this.getSession();
    return session && session.role === role;
  }
}

// Security middleware for React components (moved to SecurityProvider.tsx)
// This function is now implemented in src/components/SecurityProvider.tsx

// Export security hooks (moved to separate hook file)
// This hook is now implemented in src/hooks/useSecurity.ts
