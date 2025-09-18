import { AppConfig, Language } from '../types';

// Environment variable validation and parsing
const getEnvVar = (key: string, defaultValue?: string): string => {
  const value = import.meta.env[key] || defaultValue;
  if (!value) {
    console.warn(`Environment variable ${key} is not set`);
    return '';
  }
  return value;
};

const getBooleanEnvVar = (key: string, defaultValue: boolean = false): boolean => {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  return value === 'true' || value === '1';
};

const getNumberEnvVar = (key: string, defaultValue: number): number => {
  const value = import.meta.env[key];
  if (value === undefined) return defaultValue;
  const parsed = parseFloat(value);
  return isNaN(parsed) ? defaultValue : parsed;
};

// Supported languages configuration
export const supportedLanguages: Language[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    voiceSupported: true,
  },
  {
    code: 'ar',
    name: 'Arabic',
    nativeName: 'العربية',
    voiceSupported: true,
  },
  {
    code: 'uk',
    name: 'Ukrainian',
    nativeName: 'Українська',
    voiceSupported: true,
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    voiceSupported: true,
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    voiceSupported: true,
  },
];

// Main application configuration
export const appConfig: AppConfig = {
  firebase: {
    apiKey: getEnvVar('VITE_FIREBASE_API_KEY', ''),
    authDomain: getEnvVar('VITE_FIREBASE_AUTH_DOMAIN', ''),
    projectId: getEnvVar('VITE_FIREBASE_PROJECT_ID', ''),
    storageBucket: getEnvVar('VITE_FIREBASE_STORAGE_BUCKET', ''),
    messagingSenderId: getEnvVar('VITE_FIREBASE_MESSAGING_SENDER_ID', ''),
    appId: getEnvVar('VITE_FIREBASE_APP_ID', ''),
  },
  supportedLanguages,
  defaultLanguage: 'en',
  maps: {
    defaultCenter: [
      getNumberEnvVar('VITE_DEFAULT_MAP_CENTER_LAT', 39.9334),
      getNumberEnvVar('VITE_DEFAULT_MAP_CENTER_LNG', 32.8597),
    ],
    defaultZoom: getNumberEnvVar('VITE_DEFAULT_MAP_ZOOM', 10),
  },
};

// Feature flags
export const featureFlags = {
  enableOfflineMode: getBooleanEnvVar('VITE_ENABLE_OFFLINE_MODE', true),
  enableVoiceInput: getBooleanEnvVar('VITE_ENABLE_VOICE_INPUT', true),
  enableSafeRoute: getBooleanEnvVar('VITE_ENABLE_SAFE_ROUTE', true),
  enablePWA: getBooleanEnvVar('VITE_ENABLE_PWA', true),
  voiceApiEnabled: getBooleanEnvVar('VITE_VOICE_API_ENABLED', true),
};

// Debug configuration
export const debugConfig = {
  isDebugMode: getBooleanEnvVar('VITE_DEBUG_MODE', false),
  logLevel: getEnvVar('VITE_LOG_LEVEL', 'info') as 'debug' | 'info' | 'warn' | 'error',
};

// App metadata
export const appMetadata = {
  name: getEnvVar('VITE_APP_NAME', 'Refugee Health Assistant'),
  version: getEnvVar('VITE_APP_VERSION', '0.1.0'),
  description: 'AI Virtual Health Assistant for Refugees - Voice-enabled health support, clinic navigation, and first aid guidance',
};

// Voice configuration
export const voiceConfig = {
  defaultLanguage: getEnvVar('VITE_SPEECH_RECOGNITION_LANG', 'en-US'),
  interimResults: true,
  maxAlternatives: 1,
  continuous: false,
};

// API endpoints (if using external services)
export const apiConfig = {
  elevenLabsApiKey: getEnvVar('VITE_ELEVENLABS_API_KEY', ''),
  translationApiKey: getEnvVar('VITE_TRANSLATION_API_KEY', ''),
};

// Validation function to check if Firebase config is complete
export const isFirebaseConfigValid = (): boolean => {
  const { firebase } = appConfig;
  return !!(
    firebase.apiKey &&
    firebase.authDomain &&
    firebase.projectId &&
    firebase.storageBucket &&
    firebase.messagingSenderId &&
    firebase.appId
  );
};

// Fallback configuration for development/demo
export const fallbackConfig = {
  useMockData: !isFirebaseConfigValid(),
  mockDataPath: '/src/data/mock',
};

// Export default configuration
export default {
  app: appConfig,
  features: featureFlags,
  debug: debugConfig,
  metadata: appMetadata,
  voice: voiceConfig,
  api: apiConfig,
  fallback: fallbackConfig,
};