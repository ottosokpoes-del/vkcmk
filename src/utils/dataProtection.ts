import CryptoJS from 'crypto-js';

// Data protection utilities
export class DataProtection {
  private static readonly ENCRYPTION_KEY = process.env.REACT_APP_ENCRYPTION_KEY || 'default-key-change-in-production';

  // Encrypt sensitive data before storing
  static encryptSensitiveData(data: any): string {
    try {
      const jsonString = JSON.stringify(data);
      return CryptoJS.AES.encrypt(jsonString, this.ENCRYPTION_KEY).toString();
    } catch (error) {
      console.error('Encryption error:', error);
      throw new Error('Failed to encrypt data');
    }
  }

  // Decrypt sensitive data after retrieving
  static decryptSensitiveData(encryptedData: string): any {
    try {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.ENCRYPTION_KEY);
      const decryptedString = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedString);
    } catch (error) {
      console.error('Decryption error:', error);
      throw new Error('Failed to decrypt data');
    }
  }

  // Hash data for integrity checking
  static hashData(data: string): string {
    return CryptoJS.SHA256(data).toString();
  }

  // Verify data integrity
  static verifyDataIntegrity(data: string, hash: string): boolean {
    return this.hashData(data) === hash;
  }

  // Sanitize and encrypt user input
  static sanitizeAndEncrypt(input: string): string {
    // Remove potentially dangerous characters
    const sanitized = input
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .trim();
    
    return this.encryptSensitiveData(sanitized);
  }

  // Secure data storage with encryption
  static secureStore(key: string, data: any): void {
    try {
      const encryptedData = this.encryptSensitiveData(data);
      const hash = this.hashData(encryptedData);
      
      localStorage.setItem(key, encryptedData);
      localStorage.setItem(`${key}_hash`, hash);
    } catch (error) {
      console.error('Secure storage error:', error);
      throw new Error('Failed to store data securely');
    }
  }

  // Secure data retrieval with integrity check
  static secureRetrieve(key: string): any {
    try {
      const encryptedData = localStorage.getItem(key);
      const storedHash = localStorage.getItem(`${key}_hash`);
      
      if (!encryptedData || !storedHash) {
        return null;
      }

      // Verify integrity
      if (!this.verifyDataIntegrity(encryptedData, storedHash)) {
        console.warn('Data integrity check failed for key:', key);
        this.secureRemove(key);
        return null;
      }

      return this.decryptSensitiveData(encryptedData);
    } catch (error) {
      console.error('Secure retrieval error:', error);
      this.secureRemove(key);
      return null;
    }
  }

  // Secure data removal
  static secureRemove(key: string): void {
    localStorage.removeItem(key);
    localStorage.removeItem(`${key}_hash`);
  }

  // Clear all sensitive data
  static clearAllSensitiveData(): void {
    const sensitiveKeys = [
      'secure_session',
      'csrf_token',
      'user_preferences',
      'car_favorites'
    ];

    sensitiveKeys.forEach(key => {
      this.secureRemove(key);
    });
  }

  // Generate secure random data
  static generateSecureRandom(length: number = 32): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let result = '';
    const randomArray = new Uint8Array(length);
    crypto.getRandomValues(randomArray);
    
    for (let i = 0; i < length; i++) {
      result += chars[randomArray[i] % chars.length];
    }
    
    return result;
  }

  // Mask sensitive data for display
  static maskSensitiveData(data: string, visibleChars: number = 4): string {
    if (data.length <= visibleChars) {
      return '*'.repeat(data.length);
    }
    
    const visible = data.slice(-visibleChars);
    const masked = '*'.repeat(data.length - visibleChars);
    
    return masked + visible;
  }

  // Validate data format
  static validateDataFormat(data: any, expectedType: string): boolean {
    switch (expectedType) {
      case 'email':
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data);
      case 'phone':
        return /^[\+]?[1-9][\d]{0,15}$/.test(data);
      case 'url':
        try {
          new URL(data);
          return true;
        } catch {
          return false;
        }
      case 'number':
        return typeof data === 'number' && !isNaN(data);
      case 'string':
        return typeof data === 'string';
      case 'boolean':
        return typeof data === 'boolean';
      default:
        return true;
    }
  }
}

// Enhanced session management with encryption
export class SecureSessionManager {
  private static readonly SESSION_KEY = 'secure_session';
  private static readonly CSRF_KEY = 'csrf_token';
  private static readonly SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes

  // Create encrypted session
  static createSession(user: any): void {
    const sessionData = {
      user: DataProtection.encryptSensitiveData(user),
      timestamp: Date.now(),
      csrfToken: DataProtection.generateSecureRandom(32),
      sessionId: DataProtection.generateSecureRandom(16)
    };

    DataProtection.secureStore(this.SESSION_KEY, sessionData);
    localStorage.setItem(this.CSRF_KEY, sessionData.csrfToken);
  }

  // Get encrypted session
  static getSession(): any | null {
    try {
      const sessionData = DataProtection.secureRetrieve(this.SESSION_KEY);
      
      if (!sessionData) return null;

      // Check session timeout
      if (Date.now() - sessionData.timestamp > this.SESSION_TIMEOUT) {
        this.clearSession();
        return null;
      }

      return DataProtection.decryptSensitiveData(sessionData.user);
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

  // Clear session securely
  static clearSession(): void {
    DataProtection.secureRemove(this.SESSION_KEY);
    localStorage.removeItem(this.CSRF_KEY);
  }

  // Check authentication status
  static isAuthenticated(): boolean {
    return this.getSession() !== null;
  }

  // Check user role
  static hasRole(role: string): boolean {
    const session = this.getSession();
    return session && session.role === role;
  }

  // Refresh session
  static refreshSession(): void {
    const user = this.getSession();
    if (user) {
      this.createSession(user);
    }
  }
}
