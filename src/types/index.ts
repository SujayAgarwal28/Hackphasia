// Database model types based on roadmap.md specifications

export interface Clinic {
  id: string;
  name: string;
  lat: number;
  lng: number;
  services: string[];
  address?: string;
  phone?: string;
  hours?: string;
  unsafeZones?: UnsafeZone[];
}

export interface UnsafeZone {
  id: string;
  lat: number;
  lng: number;
  radius: number;
  description?: string;
  severity: 'low' | 'medium' | 'high';
}

export interface FirstAidGuide {
  id: string;
  topic: string;
  steps: string[];
  imageUrl?: string;
  audioUrl?: string;
  category: 'bleeding' | 'breathing' | 'burns' | 'shock' | 'fractures' | 'other';
  urgency: 'low' | 'medium' | 'high';
  language: string;
}

export interface Story {
  id: string;
  language: string;
  title: string;
  audioUrl: string;
  transcript?: string;
  duration?: number;
  category: 'survival' | 'hope' | 'resilience' | 'community' | 'healing';
  tags?: string[];
}

export interface UserTriageSummary {
  id: string;
  userId: string;
  symptoms: string[];
  bodyZones: string[];
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  advice: string;
  recommendedActions: string[];
  nearestClinic?: Clinic;
  createdAt: string;
  language: string;
}

export interface TriageRule {
  id: string;
  symptoms: string[];
  bodyZones?: string[];
  urgency: 'low' | 'medium' | 'high' | 'emergency';
  advice: string;
  recommendedActions: string[];
  redFlags?: string[];
}

export interface VoiceInput {
  transcript: string;
  confidence: number;
  language: string;
  keywords: string[];
}

export interface SymptomMapping {
  [key: string]: {
    keywords: string[];
    bodyZones: string[];
    urgency: 'low' | 'medium' | 'high' | 'emergency';
    relatedSymptoms: string[];
  };
}

export interface BodyZone {
  id: string;
  name: string;
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  commonSymptoms: string[];
}

export interface AppConfig {
  firebase: {
    apiKey: string;
    authDomain: string;
    projectId: string;
    storageBucket: string;
    messagingSenderId: string;
    appId: string;
  };
  supportedLanguages: Language[];
  defaultLanguage: string;
  maps: {
    defaultCenter: [number, number];
    defaultZoom: number;
  };
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  voiceSupported: boolean;
}

export interface NavigationRoute {
  from: [number, number];
  to: [number, number];
  waypoints: [number, number][];
  avoidUnsafeZones: boolean;
  estimatedTime: number;
  distance: number;
}

export interface MoodSelection {
  mood: 'anxious' | 'sad' | 'angry' | 'confused' | 'hopeful' | 'grateful';
  intensity: 1 | 2 | 3 | 4 | 5;
  selectedAt: string;
}

export interface BreathingExercise {
  id: string;
  name: string;
  duration: number;
  instructions: string[];
  gifUrl?: string;
  audioUrl?: string;
  language: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

// Component prop types
export interface PageProps {
  title?: string;
  description?: string;
}

export interface VoiceInputProps {
  onTranscript: (input: VoiceInput) => void;
  isListening: boolean;
  language: string;
  onError: (error: string) => void;
}

export interface MapProps {
  clinics: Clinic[];
  unsafeZones: UnsafeZone[];
  userLocation?: [number, number];
  onClinicSelect: (clinic: Clinic) => void;
  showSafeRoute: boolean;
}

export interface TriageResultProps {
  summary: UserTriageSummary;
  onPrint: () => void;
  onDownload: () => void;
  onFindClinic: () => void;
}

// Utility types
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export type Theme = 'light' | 'dark' | 'auto';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  duration?: number;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

// Database collection names (for Firebase)
export const COLLECTIONS = {
  CLINICS: 'clinics',
  FIRST_AID_GUIDES: 'firstAidGuides',
  STORIES: 'stories',
  TRIAGE_SUMMARIES: 'triageSummaries',
  UNSAFE_ZONES: 'unsafeZones',
  BREATHING_EXERCISES: 'breathingExercises',
} as const;

// Constants
export const URGENCY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  EMERGENCY: 'emergency',
} as const;

export const BODY_ZONES = {
  HEAD: 'head',
  NECK: 'neck',
  CHEST: 'chest',
  ABDOMEN: 'abdomen',
  BACK: 'back',
  LEFT_ARM: 'left-arm',
  RIGHT_ARM: 'right-arm',
  LEFT_LEG: 'left-leg',
  RIGHT_LEG: 'right-leg',
} as const;

export const SUPPORTED_LANGUAGES = {
  ENGLISH: 'en',
  ARABIC: 'ar',
  UKRAINIAN: 'uk',
  SPANISH: 'es',
  FRENCH: 'fr',
} as const;