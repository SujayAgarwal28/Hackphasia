import { Clinic, UnsafeZone, FirstAidGuide, Story } from '../types';

// Mock data for offline fallback
const mockClinics: Clinic[] = [
  {
    id: '1',
    name: 'Central Medical Center',
    lat: 39.9334,
    lng: 32.8597,
    services: ['General', 'Emergency', 'Mental Health'],
    address: 'Main Street 123',
    phone: '+90 312 123 4567',
    hours: '24/7'
  },
  {
    id: '2', 
    name: 'Community Health Clinic',
    lat: 39.9284,
    lng: 32.8647,
    services: ['General', 'Pediatrics'],
    address: 'Health Avenue 456',
    phone: '+90 312 234 5678',
    hours: '08:00-18:00'
  },
  {
    id: '3',
    name: 'Refugee Support Center',
    lat: 39.9384,
    lng: 32.8547,
    services: ['Mental Health', 'Translation', 'Social Services'],
    address: 'Support Road 789',
    phone: '+90 312 345 6789',
    hours: '09:00-17:00'
  }
];

const mockUnsafeZones: UnsafeZone[] = [
  {
    id: '1',
    lat: 39.9300,
    lng: 32.8500,
    radius: 500,
    description: 'Construction area - avoid during night hours',
    severity: 'medium'
  },
  {
    id: '2',
    lat: 39.9400,
    lng: 32.8600,
    radius: 200,
    description: 'Reported incidents - use alternative routes',
    severity: 'high'
  }
];

const mockFirstAidGuides: FirstAidGuide[] = [
  {
    id: '1',
    topic: 'Bleeding Control',
    steps: [
      'Apply direct pressure to the wound',
      'Elevate the injured area above heart level if possible',
      'Use clean cloth or bandage',
      'Call emergency services if bleeding is severe'
    ],
    category: 'bleeding',
    urgency: 'high',
    language: 'en'
  },
  {
    id: '2',
    topic: 'CPR',
    steps: [
      'Check responsiveness and breathing',
      'Call emergency services',
      'Place hands on center of chest',
      'Push hard and fast at least 2 inches deep',
      'Give 30 compressions then 2 rescue breaths',
      'Continue until help arrives'
    ],
    category: 'breathing',
    urgency: 'emergency',
    language: 'en'
  }
];

const mockStories: Story[] = [
  {
    id: '1',
    language: 'en',
    title: 'Finding Hope in a New Land',
    audioUrl: '/audio/story1.mp3',
    transcript: 'When I first arrived, everything seemed impossible...',
    duration: 180,
    category: 'hope',
    tags: ['adaptation', 'community', 'resilience']
  },
  {
    id: '2',
    language: 'en', 
    title: 'Building Community Together',
    audioUrl: '/audio/story2.mp3',
    transcript: 'We learned that helping each other was the key...',
    duration: 240,
    category: 'community',
    tags: ['support', 'friendship', 'unity']
  }
];

export class MockDataService {
  // Load data from external JSON file if available
  static async loadClinicsFromJSON(): Promise<Clinic[]> {
    try {
      const response = await fetch('/clinics_with_coords.json');
      const data = await response.json();
      return data.map((clinic: any, index: number) => ({
        id: String(index + 1),
        name: clinic.name,
        lat: clinic.lat,
        lng: clinic.lng,
        services: clinic.services || ['General'],
        address: clinic.address || clinic.name,
        phone: clinic.phone || 'Contact not available',
        hours: clinic.hours || '24/7'
      }));
    } catch (error) {
      console.warn('Failed to load clinics from JSON, using mock data:', error);
      return mockClinics;
    }
  }

  // Clinics
  static async getClinics(): Promise<Clinic[]> {
    // Try to load from local storage first
    const cached = localStorage.getItem('hackphasia_clinics');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (error) {
        console.warn('Failed to parse cached clinics:', error);
      }
    }
    
    const clinics = await this.loadClinicsFromJSON();
    localStorage.setItem('hackphasia_clinics', JSON.stringify(clinics));
    return clinics;
  }

  static async getClinic(id: string): Promise<Clinic | null> {
    const clinics = await this.getClinics();
    return clinics.find(clinic => clinic.id === id) || null;
  }

  static async addClinic(clinic: Omit<Clinic, 'id'>): Promise<string> {
    const clinics = await this.getClinics();
    const newClinic = {
      ...clinic,
      id: String(Date.now())
    };
    clinics.push(newClinic);
    localStorage.setItem('hackphasia_clinics', JSON.stringify(clinics));
    return newClinic.id;
  }

  // Unsafe Zones
  static async getUnsafeZones(): Promise<UnsafeZone[]> {
    const cached = localStorage.getItem('hackphasia_unsafe_zones');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (error) {
        console.warn('Failed to parse cached unsafe zones:', error);
      }
    }
    
    localStorage.setItem('hackphasia_unsafe_zones', JSON.stringify(mockUnsafeZones));
    return mockUnsafeZones;
  }

  static async addUnsafeZone(zone: Omit<UnsafeZone, 'id'>): Promise<string> {
    const zones = await this.getUnsafeZones();
    const newZone = {
      ...zone,
      id: String(Date.now())
    };
    zones.push(newZone);
    localStorage.setItem('hackphasia_unsafe_zones', JSON.stringify(zones));
    return newZone.id;
  }

  // First Aid Guides
  static async getFirstAidGuides(language = 'en'): Promise<FirstAidGuide[]> {
    const cached = localStorage.getItem(`hackphasia_first_aid_${language}`);
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (error) {
        console.warn('Failed to parse cached first aid guides:', error);
      }
    }
    
    const guides = mockFirstAidGuides.filter(guide => guide.language === language);
    localStorage.setItem(`hackphasia_first_aid_${language}`, JSON.stringify(guides));
    return guides;
  }

  static async getFirstAidGuide(id: string): Promise<FirstAidGuide | null> {
    const guides = await this.getFirstAidGuides();
    return guides.find(guide => guide.id === id) || null;
  }

  static async addFirstAidGuide(guide: Omit<FirstAidGuide, 'id'>): Promise<string> {
    const guides = await this.getFirstAidGuides(guide.language);
    const newGuide = {
      ...guide,
      id: String(Date.now())
    };
    guides.push(newGuide);
    localStorage.setItem(`hackphasia_first_aid_${guide.language}`, JSON.stringify(guides));
    return newGuide.id;
  }

  // Stories
  static async getStories(language = 'en', category?: string): Promise<Story[]> {
    const cached = localStorage.getItem(`hackphasia_stories_${language}`);
    let stories: Story[];
    
    if (cached) {
      try {
        stories = JSON.parse(cached);
      } catch (error) {
        console.warn('Failed to parse cached stories:', error);
        stories = mockStories.filter(story => story.language === language);
      }
    } else {
      stories = mockStories.filter(story => story.language === language);
      localStorage.setItem(`hackphasia_stories_${language}`, JSON.stringify(stories));
    }
    
    if (category) {
      return stories.filter(story => story.category === category);
    }
    
    return stories;
  }

  static async getStory(id: string): Promise<Story | null> {
    const stories = await this.getStories();
    return stories.find(story => story.id === id) || null;
  }

  static async addStory(story: Omit<Story, 'id'>): Promise<string> {
    const stories = await this.getStories(story.language);
    const newStory = {
      ...story,
      id: String(Date.now())
    };
    stories.push(newStory);
    localStorage.setItem(`hackphasia_stories_${story.language}`, JSON.stringify(stories));
    return newStory.id;
  }

  // Utility methods
  static clearCache(): void {
    const keys = Object.keys(localStorage).filter(key => key.startsWith('hackphasia_'));
    keys.forEach(key => localStorage.removeItem(key));
  }

  static async syncWithServer(): Promise<void> {
    // Placeholder for future server sync functionality
    console.log('Mock sync - no server configured');
  }
}

export default MockDataService;