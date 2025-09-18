import { initializeApp, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBCriQSed2c8FCwcEBKMewZba8Xdz1QqM4",
  authDomain: "hackuccino-794e2.firebaseapp.com",
  projectId: "hackuccino-794e2",
  storageBucket: "hackuccino-794e2.appspot.com",
  messagingSenderId: "872787673330",
  appId: "1:872787673330:web:f30c86fc61ea02cfa22352",
  measurementId: "G-61KH8NKHRH"
};

let firebaseApp: FirebaseApp;

try {
  firebaseApp = getApp();
} catch {
  firebaseApp = initializeApp(firebaseConfig);
}

export const db: Firestore = getFirestore(firebaseApp);
export const app = firebaseApp;
