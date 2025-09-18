// Utility functions for common operations across the app

/**
 * Format date for display
 */
export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Generate unique ID for database operations
 */
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

/**
 * Validate email format
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Calculate distance between two coordinates
 */
export const calculateDistance = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number => {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Debounce function for performance optimization
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: number;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = window.setTimeout(() => func.apply(null, args), delay);
  };
};

/**
 * Local storage utilities with error handling
 */
export const storage = {
  get: <T>(key: string, defaultValue: T): T => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.warn(`Error reading from localStorage for key "${key}":`, error);
      return defaultValue;
    }
  },
  
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Error writing to localStorage for key "${key}":`, error);
    }
  },
  
  remove: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.warn(`Error removing from localStorage for key "${key}":`, error);
    }
  },
};

/**
 * Check if the browser supports a feature
 */
export const browserSupport = {
  speechRecognition: (): boolean => {
    return !!(
      'SpeechRecognition' in window ||
      'webkitSpeechRecognition' in window
    );
  },
  
  geolocation: (): boolean => {
    return !!navigator.geolocation;
  },
  
  serviceWorker: (): boolean => {
    return 'serviceWorker' in navigator;
  },
  
  notification: (): boolean => {
    return 'Notification' in window;
  },
};

/**
 * Error handling utilities
 */
export const handleError = (error: unknown, context?: string): string => {
  const message = error instanceof Error ? error.message : 'Unknown error occurred';
  const fullMessage = context ? `${context}: ${message}` : message;
  
  console.error(fullMessage, error);
  return fullMessage;
};

/**
 * URL utilities
 */
export const urlUtils = {
  getQueryParam: (param: string): string | null => {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  },
  
  setQueryParam: (param: string, value: string): void => {
    const url = new URL(window.location.href);
    url.searchParams.set(param, value);
    window.history.pushState({}, '', url.toString());
  },
  
  removeQueryParam: (param: string): void => {
    const url = new URL(window.location.href);
    url.searchParams.delete(param);
    window.history.pushState({}, '', url.toString());
  },
};

/**
 * Async retry utility
 */
export const retry = async <T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000
): Promise<T> => {
  let attempt = 1;
  
  while (attempt <= maxAttempts) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error;
      }
      
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
      attempt++;
    }
  }
  
  throw new Error('Maximum retry attempts reached');
};