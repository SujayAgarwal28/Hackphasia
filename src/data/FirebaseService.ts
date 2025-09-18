import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  GeoPoint
} from 'firebase/firestore';
import { db } from '../firebase';
import { Clinic, UnsafeZone, FirstAidGuide, Story } from '../types';

export class FirestoreService {
  // Check if Firestore is available
  static isAvailable(): boolean {
    return db !== null;
  }

  // Clinics
  static async getClinics(): Promise<Clinic[]> {
    if (!db) throw new Error('Firestore not initialized');
    
    const querySnapshot = await getDocs(collection(db, 'clinics'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }) as Clinic);
  }

  static async getClinic(id: string): Promise<Clinic | null> {
    if (!db) throw new Error('Firestore not initialized');
    
    const docRef = doc(db, 'clinics', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Clinic;
    }
    return null;
  }

  static async addClinic(clinic: Omit<Clinic, 'id'>): Promise<string> {
    if (!db) throw new Error('Firestore not initialized');
    
    const docRef = await addDoc(collection(db, 'clinics'), {
      ...clinic,
      location: new GeoPoint(clinic.lat, clinic.lng)
    });
    return docRef.id;
  }

  // Unsafe Zones
  static async getUnsafeZones(): Promise<UnsafeZone[]> {
    if (!db) throw new Error('Firestore not initialized');
    
    const querySnapshot = await getDocs(collection(db, 'unsafeZones'));
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }) as UnsafeZone);
  }

  static async addUnsafeZone(zone: Omit<UnsafeZone, 'id'>): Promise<string> {
    if (!db) throw new Error('Firestore not initialized');
    
    const docRef = await addDoc(collection(db, 'unsafeZones'), {
      ...zone,
      location: new GeoPoint(zone.lat, zone.lng)
    });
    return docRef.id;
  }

  // First Aid Guides
  static async getFirstAidGuides(language = 'en'): Promise<FirstAidGuide[]> {
    if (!db) throw new Error('Firestore not initialized');
    
    const q = query(
      collection(db, 'firstAidGuides'),
      where('language', '==', language),
      orderBy('urgency', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }) as FirstAidGuide);
  }

  static async getFirstAidGuide(id: string): Promise<FirstAidGuide | null> {
    if (!db) throw new Error('Firestore not initialized');
    
    const docRef = doc(db, 'firstAidGuides', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as FirstAidGuide;
    }
    return null;
  }

  static async addFirstAidGuide(guide: Omit<FirstAidGuide, 'id'>): Promise<string> {
    if (!db) throw new Error('Firestore not initialized');
    
    const docRef = await addDoc(collection(db, 'firstAidGuides'), guide);
    return docRef.id;
  }

  // Stories
  static async getStories(language = 'en', category?: string): Promise<Story[]> {
    if (!db) throw new Error('Firestore not initialized');
    
    let q = query(
      collection(db, 'stories'),
      where('language', '==', language),
      orderBy('title')
    );

    if (category) {
      q = query(q, where('category', '==', category));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }) as Story);
  }

  static async getStory(id: string): Promise<Story | null> {
    if (!db) throw new Error('Firestore not initialized');
    
    const docRef = doc(db, 'stories', id);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Story;
    }
    return null;
  }

  static async addStory(story: Omit<Story, 'id'>): Promise<string> {
    if (!db) throw new Error('Firestore not initialized');
    
    const docRef = await addDoc(collection(db, 'stories'), story);
    return docRef.id;
  }

  // Generic query methods
  static async queryCollection<T>(
    collectionName: string, 
    conditions: any[] = [],
    limitCount?: number
  ): Promise<T[]> {
    if (!db) throw new Error('Firestore not initialized');
    
    let q = collection(db, collectionName);
    let finalQuery = q as any;

    if (conditions.length > 0) {
      finalQuery = query(q, ...conditions);
    }

    if (limitCount) {
      finalQuery = query(finalQuery, limit(limitCount));
    }
    
    const querySnapshot = await getDocs(finalQuery);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as any)
    }) as T);
  }
}

export default FirestoreService;