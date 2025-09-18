// Data module - Handles Firebase/database connections and mock data fallbacks
// This module supports all team members by providing shared data access

export * from './FirebaseService';
export * from './MockDataService';
export * from './DataProviders';
export * from './CacheService';

// Placeholder exports for integration planning
export { default as FirebaseService } from './FirebaseService';
export { default as MockDataService } from './MockDataService';
export { default as DataProvider } from './DataProviders';
export { default as CacheService } from './CacheService';