import { FirestoreService } from './FirebaseService';
import { MockDataService } from './MockDataService';
import { Clinic, FirstAidGuide, Story } from '../types';

export class DataProvider {
  private static useFirestore = FirestoreService.isAvailable();

  static async getClinics(): Promise<Clinic[]> {
    if (this.useFirestore) {
      try {
        return await FirestoreService.getClinics();
      } catch (error) {
        console.warn('Firestore failed, falling back to mock data:', error);
        this.useFirestore = false;
      }
    }
    return await MockDataService.getClinics();
  }

  static async getClinic(id: string): Promise<Clinic | null> {
    if (this.useFirestore) {
      try {
        return await FirestoreService.getClinic(id);
      } catch (error) {
        console.warn('Firestore failed, falling back to mock data:', error);
        this.useFirestore = false;
      }
    }
    return await MockDataService.getClinic(id);
  }

  static async addClinic(clinic: Omit<Clinic, 'id'>): Promise<string> {
    if (this.useFirestore) {
      try {
        return await FirestoreService.addClinic(clinic);
      } catch (error) {
        console.warn('Firestore failed, falling back to mock data:', error);
        this.useFirestore = false;
      }
    }
    return await MockDataService.addClinic(clinic);
  }

  static async getFirstAidGuides(language = 'en'): Promise<FirstAidGuide[]> {
    if (this.useFirestore) {
      try {
        return await FirestoreService.getFirstAidGuides(language);
      } catch (error) {
        console.warn('Firestore failed, falling back to mock data:', error);
        this.useFirestore = false;
      }
    }
    return await MockDataService.getFirstAidGuides(language);
  }

  static async getFirstAidGuide(id: string): Promise<FirstAidGuide | null> {
    if (this.useFirestore) {
      try {
        return await FirestoreService.getFirstAidGuide(id);
      } catch (error) {
        console.warn('Firestore failed, falling back to mock data:', error);
        this.useFirestore = false;
      }
    }
    return await MockDataService.getFirstAidGuide(id);
  }

  static async addFirstAidGuide(guide: Omit<FirstAidGuide, 'id'>): Promise<string> {
    if (this.useFirestore) {
      try {
        return await FirestoreService.addFirstAidGuide(guide);
      } catch (error) {
        console.warn('Firestore failed, falling back to mock data:', error);
        this.useFirestore = false;
      }
    }
    return await MockDataService.addFirstAidGuide(guide);
  }

  static async getStories(language = 'en', category?: string): Promise<Story[]> {
    if (this.useFirestore) {
      try {
        return await FirestoreService.getStories(language, category);
      } catch (error) {
        console.warn('Firestore failed, falling back to mock data:', error);
        this.useFirestore = false;
      }
    }
    return await MockDataService.getStories(language, category);
  }

  static async getStory(id: string): Promise<Story | null> {
    if (this.useFirestore) {
      try {
        return await FirestoreService.getStory(id);
      } catch (error) {
        console.warn('Firestore failed, falling back to mock data:', error);
        this.useFirestore = false;
      }
    }
    return await MockDataService.getStory(id);
  }

  static async addStory(story: Omit<Story, 'id'>): Promise<string> {
    if (this.useFirestore) {
      try {
        return await FirestoreService.addStory(story);
      } catch (error) {
        console.warn('Firestore failed, falling back to mock data:', error);
        this.useFirestore = false;
      }
    }
    return await MockDataService.addStory(story);
  }

  static getDataSource(): 'firestore' | 'mock' {
    return this.useFirestore ? 'firestore' : 'mock';
  }

  static forceFirestore(): void {
    this.useFirestore = FirestoreService.isAvailable();
  }

  static forceMock(): void {
    this.useFirestore = false;
  }
}

export default DataProvider;