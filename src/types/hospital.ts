// Hospital/Clinic Management System Types

export interface Hospital {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'emergency_center' | 'mobile_unit';
  specialty: string[];
  coordinates: {
    lat: number;
    lng: number;
  };
  address: string;
  contactInfo: {
    phone: string;
    email: string;
    emergencyContact?: string;
  };
  capacity: {
    beds: number;
    emergencyBeds: number;
    staff: number;
  };
  services: string[];
  adminCredentials: {
    username: string;
    passwordHash: string; // In real app, use proper hashing
    lastLogin?: Date;
  };
  status: 'active' | 'inactive' | 'maintenance';
  createdAt: Date;
  updatedAt: Date;
}

export interface RefugeeTicket {
  id: string;
  refugeeInfo: {
    name: string;
    age?: number;
    gender?: 'male' | 'female' | 'other';
    ethnicGroup: string;
    familySize?: number;
    contactInfo: string;
  };
  location: {
    lat: number;
    lng: number;
    address?: string;
    camp?: string;
  };
  emergency: {
    type: 'medical' | 'epidemic' | 'malnutrition' | 'trauma' | 'mental_health' | 'general';
    severity: 'low' | 'medium' | 'high' | 'critical';
    description: string;
    symptoms?: string[];
    affectedPeople: number;
  };
  nearestHospitals: string[]; // Hospital IDs
  assignedHospital?: string;
  status: 'open' | 'assigned' | 'in_progress' | 'resolved' | 'closed';
  aiRecommendations?: {
    immediateSupplies: string[];
    medicalPriority: number;
    estimatedResponse: string;
    culturalConsiderations: string[];
  };
  createdAt: Date;
  updatedAt: Date;
  resolvedAt?: Date;
}

export interface AdminSession {
  hospitalId: string;
  username: string;
  loginTime: Date;
  isActive: boolean;
}

export interface SupplyRecommendation {
  category: 'medical' | 'food' | 'shelter' | 'sanitation' | 'psychological';
  items: string[];
  priority: 'immediate' | 'urgent' | 'moderate' | 'low';
  quantity?: string;
  notes?: string;
}

export interface EmergencyAlert {
  id: string;
  ticketId: string;
  hospitalIds: string[];
  alertType: 'epidemic' | 'mass_casualty' | 'resource_shortage';
  message: string;
  coordinates: { lat: number; lng: number };
  radius: number; // Alert radius in km
  severity: 'low' | 'medium' | 'high' | 'critical';
  sentAt: Date;
  acknowledgedBy: string[]; // Hospital IDs that acknowledged
}