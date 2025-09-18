// Custom React hooks for the application

import { useState, useEffect, useCallback } from 'react';
import { storage, browserSupport } from '../utils';

/**
 * Hook for managing localStorage state
 */
export const useLocalStorage = <T>(
  key: string,
  initialValue: T
): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    return storage.get(key, initialValue);
  });

  const setValue = useCallback((value: T) => {
    setStoredValue(value);
    storage.set(key, value);
  }, [key]);

  return [storedValue, setValue];
};

/**
 * Hook for managing geolocation
 */
export const useGeolocation = () => {
  const [position, setPosition] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getCurrentPosition = useCallback(() => {
    if (!browserSupport.geolocation()) {
      setError('Geolocation is not supported');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setPosition({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  }, []);

  return { position, error, loading, getCurrentPosition };
};

/**
 * Hook for managing online/offline status
 */
export const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return isOnline;
};

/**
 * Hook for speech recognition
 */
export const useSpeechRecognition = (language: string = 'en-US') => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const startListening = useCallback(() => {
    if (!browserSupport.speechRecognition()) {
      setError('Speech recognition is not supported');
      return;
    }

    const SpeechRecognition = 
      window.SpeechRecognition || window.webkitSpeechRecognition;
    
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = language;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event) => {
      const result = event.results[event.results.length - 1];
      if (result.isFinal) {
        setTranscript(result[0].transcript);
        setIsListening(false);
      }
    };

    recognition.onerror = (event) => {
      setError(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, [language]);

  const stopListening = useCallback(() => {
    setIsListening(false);
  }, []);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setError(null);
  }, []);

  return {
    isListening,
    transcript,
    error,
    startListening,
    stopListening,
    resetTranscript,
    isSupported: browserSupport.speechRecognition(),
  };
};

/**
 * Hook for managing loading states
 */
export const useAsync = <T>(
  asyncFunction: () => Promise<T>,
  dependencies: any[] = []
) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await asyncFunction();
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, dependencies);

  useEffect(() => {
    execute();
  }, [execute]);

  return { data, loading, error, refetch: execute };
};

/**
 * Hook for managing dark mode
 */
export const useDarkMode = () => {
  const [isDarkMode, setIsDarkMode] = useLocalStorage('darkMode', false);

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(!isDarkMode);
  }, [isDarkMode, setIsDarkMode]);

  return { isDarkMode, toggleDarkMode };
};

/**
 * Hook for managing notifications
 */
export const useNotification = () => {
  const [permission, setPermission] = useState(Notification.permission);

  const requestPermission = useCallback(async () => {
    if (!browserSupport.notification()) {
      throw new Error('Notifications are not supported');
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  }, []);

  const showNotification = useCallback(
    (title: string, options?: NotificationOptions) => {
      if (permission !== 'granted') {
        console.warn('Notification permission not granted');
        return;
      }

      return new Notification(title, {
        icon: '/icon-192x192.png',
        ...options,
      });
    },
    [permission]
  );

  return {
    permission,
    requestPermission,
    showNotification,
    isSupported: browserSupport.notification(),
  };
};

// Declare global speech recognition types for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}