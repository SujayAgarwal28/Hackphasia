import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import config, { isFirebaseConfigValid } from '../config';

// Firebase services - may be null if config is invalid
let app: ReturnType<typeof initializeApp> | null = null;
let auth: ReturnType<typeof getAuth> | null = null;
let db: ReturnType<typeof getFirestore> | null = null;
let storage: ReturnType<typeof getStorage> | null = null;

if (isFirebaseConfigValid()) {
  try {
    // Avoid double initialization during HMR/dev
    if (!getApps().length) {
      app = initializeApp(config.app.firebase as any);
      auth = getAuth(app);
      db = getFirestore(app);
      storage = getStorage(app);
      console.info('Firebase initialized successfully');
    } else {
      console.info('Firebase already initialized');
    }
  } catch (err) {
    console.warn('Failed to initialize Firebase:', err);
  }
} else {
  console.info('Firebase config not present - skipping initialization');
}

export { app, auth, db, storage };

export default {
  app,
  auth,
  db,
  storage,
};
