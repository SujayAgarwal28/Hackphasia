/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_FIREBASE_API_KEY: string
  readonly VITE_FIREBASE_AUTH_DOMAIN: string
  readonly VITE_FIREBASE_PROJECT_ID: string
  readonly VITE_FIREBASE_STORAGE_BUCKET: string
  readonly VITE_FIREBASE_MESSAGING_SENDER_ID: string
  readonly VITE_FIREBASE_APP_ID: string
  readonly VITE_DEFAULT_MAP_CENTER_LAT: string
  readonly VITE_DEFAULT_MAP_CENTER_LNG: string
  readonly VITE_DEFAULT_MAP_ZOOM: string
  readonly VITE_VOICE_API_ENABLED: string
  readonly VITE_SPEECH_RECOGNITION_LANG: string
  readonly VITE_ENABLE_OFFLINE_MODE: string
  readonly VITE_ENABLE_VOICE_INPUT: string
  readonly VITE_ENABLE_SAFE_ROUTE: string
  readonly VITE_ENABLE_PWA: string
  readonly VITE_ELEVENLABS_API_KEY: string
  readonly VITE_TRANSLATION_API_KEY: string
  readonly VITE_DEBUG_MODE: string
  readonly VITE_LOG_LEVEL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}