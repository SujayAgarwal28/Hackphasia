// Hospital Management Database Service
// In production, this would connect to a real database like PostgreSQL/MongoDB

import { Hospital, RefugeeTicket, AdminSession } from '../types/hospital';
import { GeolocationService } from '../map/GeolocationService';

class HospitalDatabase {
  private hospitals: Map<string, Hospital> = new Map();
  private tickets: Map<string, RefugeeTicket> = new Map();
  private adminSessions: Map<string, AdminSession> = new Map();

  constructor() {
    this.initializeDefaultHospitals();
    this.initializeDefaultTickets();
  }

  // Initialize with some default hospitals for demo
  private initializeDefaultHospitals() {
    const defaultHospitals: Hospital[] = [
      {
        id: 'hosp_001',
        name: 'Manipal Hospital Bangalore',
        type: 'hospital',
        specialty: ['emergency_medicine', 'cardiology', 'neurology', 'oncology'],
        coordinates: { lat: 12.9716, lng: 77.5946 }, // Bangalore coordinates
        address: 'Old Airport Rd, HAL 2nd Stage, Kodihalli, Bengaluru, Karnataka 560008',
        contactInfo: {
          phone: '+91-80-2502-4444',
          email: 'info@manipalhospitals.com',
          emergencyContact: '+91-80-2502-4445'
        },
        capacity: { beds: 650, emergencyBeds: 80, staff: 400 },
        services: ['emergency_care', 'surgery', 'mental_health', 'vaccination', 'maternity'],
        adminCredentials: {
          username: 'admin_manipal',
          passwordHash: 'hashed_password_123'
        },
        status: 'active',
        createdAt: new Date('2024-01-15'),
        updatedAt: new Date()
      },
      {
        id: 'hosp_002',
        name: 'Fortis Hospital Bannerghatta',
        type: 'hospital',
        specialty: ['emergency_medicine', 'orthopedics', 'gastroenterology'],
        coordinates: { lat: 12.8698, lng: 77.6107 },
        address: '154/9, Bannerghatta Rd, Opposite IIM-B, Bengaluru, Karnataka 560076',
        contactInfo: {
          phone: '+91-80-6621-4444',
          email: 'bangalore@fortishealthcare.com',
          emergencyContact: '+91-80-6621-4445'
        },
        capacity: { beds: 400, emergencyBeds: 50, staff: 250 },
        services: ['emergency_care', 'surgery', 'diagnostics', 'pharmacy'],
        adminCredentials: {
          username: 'admin_fortis',
          passwordHash: 'hashed_password_456'
        },
        status: 'active',
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date()
      },
      {
        id: 'clinic_001',
        name: 'Apollo Clinic Electronic City',
        type: 'clinic',
        specialty: ['primary_care', 'vaccination', 'health_screening'],
        coordinates: { lat: 12.8456, lng: 77.6603 },
        address: 'Electronic City Phase 1, Bengaluru, Karnataka 560100',
        contactInfo: {
          phone: '+91-80-4455-5555',
          email: 'electroniccity@apolloclinic.in'
        },
        capacity: { beds: 20, emergencyBeds: 5, staff: 15 },
        services: ['primary_care', 'vaccination', 'health_screening', 'telemedicine'],
        adminCredentials: {
          username: 'admin_apollo_ec',
          passwordHash: 'hashed_password_789'
        },
        status: 'active',
        createdAt: new Date('2024-02-01'),
        updatedAt: new Date()
      }
    ];

    defaultHospitals.forEach(hospital => {
      this.hospitals.set(hospital.id, hospital);
    });
  }

  // Initialize with some default tickets for demo
  private initializeDefaultTickets() {
    const defaultTickets: RefugeeTicket[] = [
      {
        id: 'ticket_001',
        refugeeInfo: {
          name: 'Ahmad Hassan',
          age: 28,
          gender: 'male',
          ethnicGroup: 'Syrian Arab',
          familySize: 4,
          contactInfo: '+1-555-0301'
        },
        location: {
          lat: 40.7489,
          lng: -73.9857,
          address: 'Near Times Square, NY'
        },
        emergency: {
          type: 'medical',
          severity: 'high',
          description: 'Severe chest pain and difficulty breathing',
          symptoms: ['chest_pain', 'shortness_of_breath', 'dizziness'],
          affectedPeople: 1
        },
        assignedHospital: 'hosp_001',
        nearestHospitals: ['hosp_001', 'clinic_001'],
        status: 'assigned',
        aiRecommendations: {
          immediateSupplies: ['oxygen', 'cardiac_monitor', 'emergency_medications'],
          medicalPriority: 2,
          estimatedResponse: '5 minutes',
          culturalConsiderations: ['Arabic interpreter needed', 'Halal dietary requirements']
        },
        createdAt: new Date(Date.now() - 3600000), // 1 hour ago
        updatedAt: new Date()
      },
      {
        id: 'ticket_002',
        refugeeInfo: {
          name: 'Fatima Al-Zahra',
          age: 34,
          gender: 'female',
          ethnicGroup: 'Afghan Tajik',
          familySize: 3,
          contactInfo: '+1-555-0302'
        },
        location: {
          lat: 40.7128,
          lng: -74.0060,
          address: 'Central Park Area, NY'
        },
        emergency: {
          type: 'medical',
          severity: 'critical',
          description: 'Pregnancy complications - active labor',
          symptoms: ['contractions', 'bleeding', 'severe_pain'],
          affectedPeople: 2
        },
        assignedHospital: 'hosp_001',
        nearestHospitals: ['hosp_001'],
        status: 'in_progress',
        aiRecommendations: {
          immediateSupplies: ['obstetric_kit', 'blood_units', 'emergency_surgery_kit'],
          medicalPriority: 1,
          estimatedResponse: 'Immediate',
          culturalConsiderations: ['Female healthcare provider preferred', 'Dari interpreter needed']
        },
        createdAt: new Date(Date.now() - 7200000), // 2 hours ago
        updatedAt: new Date(Date.now() - 1800000) // 30 minutes ago
      },
      {
        id: 'ticket_003',
        refugeeInfo: {
          name: 'Omar Khalil',
          age: 16,
          gender: 'male',
          ethnicGroup: 'Somali',
          familySize: 2,
          contactInfo: '+1-555-0303'
        },
        location: {
          lat: 40.7614,
          lng: -73.9776,
          address: 'Central Park West, NY'
        },
        emergency: {
          type: 'medical',
          severity: 'medium',
          description: 'High fever and persistent cough',
          symptoms: ['fever', 'cough', 'fatigue', 'body_aches'],
          affectedPeople: 1
        },
        assignedHospital: 'clinic_001',
        nearestHospitals: ['clinic_001', 'hosp_001'],
        status: 'open',
        aiRecommendations: {
          immediateSupplies: ['antibiotics', 'fever_reducers', 'respiratory_support'],
          medicalPriority: 3,
          estimatedResponse: '45 minutes',
          culturalConsiderations: ['Somali interpreter needed', 'Consider infectious disease screening']
        },
        createdAt: new Date(Date.now() - 10800000), // 3 hours ago
        updatedAt: new Date(Date.now() - 10800000)
      },
      {
        id: 'ticket_004',
        refugeeInfo: {
          name: 'Amira Nasser',
          age: 42,
          gender: 'female',
          ethnicGroup: 'Yemeni Arab',
          familySize: 5,
          contactInfo: '+1-555-0304'
        },
        location: {
          lat: 40.7505,
          lng: -73.9934,
          address: 'Herald Square, NY'
        },
        emergency: {
          type: 'mental_health',
          severity: 'high',
          description: 'Severe anxiety and panic attacks',
          symptoms: ['anxiety', 'panic_attacks', 'insomnia', 'depression'],
          affectedPeople: 1
        },
        assignedHospital: 'hosp_001',
        nearestHospitals: ['hosp_001'],
        status: 'assigned',
        aiRecommendations: {
          immediateSupplies: ['anxiety_medication', 'crisis_counseling', 'interpreter_services'],
          medicalPriority: 2,
          estimatedResponse: '20 minutes',
          culturalConsiderations: ['Female counselor preferred', 'Arabic interpreter needed', 'Cultural trauma awareness']
        },
        createdAt: new Date(Date.now() - 5400000), // 1.5 hours ago
        updatedAt: new Date(Date.now() - 900000) // 15 minutes ago
      }
    ];

    defaultTickets.forEach(ticket => {
      this.tickets.set(ticket.id, ticket);
    });
  }

  // Hospital Management
  async addHospital(hospital: Omit<Hospital, 'id' | 'createdAt' | 'updatedAt'>): Promise<Hospital> {
    const id = `hosp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newHospital: Hospital = {
      ...hospital,
      id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.hospitals.set(id, newHospital);
    return newHospital;
  }

  async getHospitalById(id: string): Promise<Hospital | null> {
    return this.hospitals.get(id) || null;
  }

  async getAllHospitals(): Promise<Hospital[]> {
    return Array.from(this.hospitals.values());
  }

  async updateHospital(id: string, updates: Partial<Hospital>): Promise<Hospital | null> {
    const hospital = this.hospitals.get(id);
    if (!hospital) return null;

    const updatedHospital = {
      ...hospital,
      ...updates,
      updatedAt: new Date()
    };
    
    this.hospitals.set(id, updatedHospital);
    return updatedHospital;
  }

  async deleteHospital(id: string): Promise<boolean> {
    return this.hospitals.delete(id);
  }

  // Admin Authentication
  async authenticateAdmin(username: string, password: string): Promise<{ hospital: Hospital; sessionId: string } | null> {
    for (const hospital of this.hospitals.values()) {
      if (hospital.adminCredentials.username === username && 
          hospital.adminCredentials.passwordHash === password) { // In real app, use bcrypt.compare
        
        const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        const session: AdminSession = {
          hospitalId: hospital.id,
          username,
          loginTime: new Date(),
          isActive: true
        };
        
        this.adminSessions.set(sessionId, session);
        
        // Update last login
        await this.updateHospital(hospital.id, {
          adminCredentials: {
            ...hospital.adminCredentials,
            lastLogin: new Date()
          }
        });
        
        return { hospital, sessionId };
      }
    }
    return null;
  }

  async validateSession(sessionId: string): Promise<AdminSession | null> {
    const session = this.adminSessions.get(sessionId);
    if (!session || !session.isActive) return null;
    
    // Check if session is still valid (24 hours)
    const now = new Date();
    const sessionAge = now.getTime() - session.loginTime.getTime();
    if (sessionAge > 24 * 60 * 60 * 1000) {
      session.isActive = false;
      return null;
    }
    
    return session;
  }

  async logout(sessionId: string): Promise<void> {
    const session = this.adminSessions.get(sessionId);
    if (session) {
      session.isActive = false;
    }
  }

  // Refugee Ticket Management
  async createTicket(ticket: Omit<RefugeeTicket, 'id' | 'createdAt' | 'updatedAt' | 'nearestHospitals' | 'aiRecommendations'>): Promise<RefugeeTicket> {
    const id = `ticket_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Find nearest hospitals
    const hospitals = Array.from(this.hospitals.values());
    const ticketLocation = { ...ticket.location, timestamp: Date.now() };
    
    // Transform hospitals to include lat/lng at top level for GeolocationService
    const hospitalsWithLocation = hospitals.map(h => ({
      ...h,
      lat: h.coordinates.lat,
      lng: h.coordinates.lng
    }));
    
    const nearestHospitals = GeolocationService.findNearest(
      ticketLocation,
      hospitalsWithLocation,
      5 // Get 5 nearest hospitals
    ).map(h => h.id);

    // Generate AI recommendations
    const aiRecommendations = this.generateAIRecommendations(ticket);

    // Auto-assign to best hospital based on emergency type and severity
    let assignedHospital: string | undefined;
    if (nearestHospitals.length > 0) {
      // For critical cases, assign to the nearest major hospital
      if (ticket.emergency.severity === 'critical') {
        const majorHospitals = hospitals.filter(h => h.type === 'hospital' && nearestHospitals.includes(h.id));
        assignedHospital = majorHospitals.length > 0 ? majorHospitals[0].id : nearestHospitals[0];
      } else {
        // For other cases, can be assigned to any nearest facility
        assignedHospital = nearestHospitals[0];
      }
    }

    const newTicket: RefugeeTicket = {
      ...ticket,
      id,
      nearestHospitals,
      assignedHospital,
      aiRecommendations,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.tickets.set(id, newTicket);
    
    // Notify nearest hospitals
    await this.notifyHospitals(newTicket);
    
    return newTicket;
  }

  private generateAIRecommendations(ticket: Omit<RefugeeTicket, 'id' | 'createdAt' | 'updatedAt' | 'nearestHospitals' | 'aiRecommendations'>): RefugeeTicket['aiRecommendations'] {
    const supplies: string[] = [];
    const culturalConsiderations: string[] = [];
    let medicalPriority = 3;
    let estimatedResponse = '2-4 hours';

    // Emergency type based recommendations
    switch (ticket.emergency.type) {
      case 'epidemic':
        supplies.push('PPE equipment', 'rapid test kits', 'isolation materials', 'disinfectants');
        medicalPriority = 5;
        estimatedResponse = 'Immediate (< 1 hour)';
        break;
      case 'malnutrition':
        supplies.push('therapeutic food', 'vitamin supplements', 'oral rehydration salts');
        medicalPriority = 4;
        break;
      case 'trauma':
        supplies.push('emergency surgical kits', 'blood bags', 'pain medication', 'bandages');
        medicalPriority = 5;
        estimatedResponse = 'Immediate (< 30 minutes)';
        break;
      case 'mental_health':
        supplies.push('psychological first aid materials', 'interpreters', 'child-friendly spaces');
        culturalConsiderations.push('trauma-informed care', 'gender-sensitive services');
        break;
      default:
        supplies.push('basic medical supplies', 'first aid kits');
    }

    // Ethnic group considerations
    const ethnicGroup = ticket.refugeeInfo.ethnicGroup.toLowerCase();
    if (ethnicGroup.includes('syrian')) {
      culturalConsiderations.push('Arabic language support', 'halal food requirements', 'family-centered care');
    } else if (ethnicGroup.includes('rohingya')) {
      culturalConsiderations.push('Rohingya language interpreter', 'culturally appropriate healthcare');
    } else if (ethnicGroup.includes('afghan')) {
      culturalConsiderations.push('Dari/Pashto interpreter', 'gender-separated treatment areas');
    }

    // Severity adjustments
    if (ticket.emergency.severity === 'critical') {
      medicalPriority = 5;
      estimatedResponse = 'Immediate (< 15 minutes)';
    } else if (ticket.emergency.severity === 'high') {
      medicalPriority = 4;
      estimatedResponse = '1-2 hours';
    }

    // Affected people considerations
    if (ticket.emergency.affectedPeople > 50) {
      supplies.push('mass casualty supplies', 'additional medical staff');
      medicalPriority = Math.min(5, medicalPriority + 1);
    }

    return {
      immediateSupplies: supplies,
      medicalPriority,
      estimatedResponse,
      culturalConsiderations
    };
  }

  private async notifyHospitals(ticket: RefugeeTicket): Promise<void> {
    // In a real app, this would send push notifications, emails, or SMS
    console.log(`🚨 EMERGENCY ALERT: New ticket ${ticket.id} created`);
    console.log(`📍 Location: ${ticket.location.lat}, ${ticket.location.lng}`);
    console.log(`🏥 Notifying hospitals: ${ticket.nearestHospitals.join(', ')}`);
    
    // Store notification for each hospital
    for (const hospitalId of ticket.nearestHospitals) {
      const hospital = this.hospitals.get(hospitalId);
      if (hospital) {
        console.log(`📢 Alert sent to: ${hospital.name}`);
      }
    }
  }

  async getTicketById(id: string): Promise<RefugeeTicket | null> {
    return this.tickets.get(id) || null;
  }

  async getTicketsForHospital(hospitalId: string): Promise<RefugeeTicket[]> {
    return Array.from(this.tickets.values()).filter(ticket => 
      ticket.nearestHospitals.includes(hospitalId) || ticket.assignedHospital === hospitalId
    );
  }

  async getAllTickets(): Promise<RefugeeTicket[]> {
    return Array.from(this.tickets.values());
  }

  async updateTicket(id: string, updates: Partial<RefugeeTicket>): Promise<RefugeeTicket | null> {
    const ticket = this.tickets.get(id);
    if (!ticket) return null;

    const updatedTicket = {
      ...ticket,
      ...updates,
      updatedAt: new Date()
    };
    
    this.tickets.set(id, updatedTicket);
    return updatedTicket;
  }

  async assignTicketToHospital(ticketId: string, hospitalId: string): Promise<RefugeeTicket | null> {
    return await this.updateTicket(ticketId, {
      assignedHospital: hospitalId,
      status: 'assigned'
    });
  }

  // Geographic queries
  async findNearestHospitals(location: { lat: number; lng: number }, maxDistance: number = 50): Promise<Hospital[]> {
    const hospitals = Array.from(this.hospitals.values());
    const userLocation = { ...location, timestamp: Date.now() };
    
    // Transform hospitals to include lat/lng at top level for GeolocationService
    const hospitalsWithLocation = hospitals.map(h => ({
      ...h,
      lat: h.coordinates.lat,
      lng: h.coordinates.lng
    }));
    
    const nearestWithDistance = GeolocationService.findNearest(userLocation, hospitalsWithLocation, 10);
    
    // Filter by distance and return original hospital objects
    return nearestWithDistance
      .filter(hospital => hospital.distance <= maxDistance)
      .map(hospital => {
        // Remove the added lat/lng properties and return original hospital
        const { lat, lng, distance, bearing, ...originalHospital } = hospital;
        return originalHospital as Hospital;
      });
  }

  // Statistics and Analytics
  async getHospitalStats(hospitalId: string): Promise<{
    totalTickets: number;
    activeTickets: number;
    resolvedTickets: number;
    averageResponseTime: number;
    specialtyDistribution: Record<string, number>;
  }> {
    const tickets = await this.getTicketsForHospital(hospitalId);
    
    const totalTickets = tickets.length;
    const activeTickets = tickets.filter(t => ['open', 'assigned', 'in_progress'].includes(t.status)).length;
    const resolvedTickets = tickets.filter(t => t.status === 'resolved').length;
    
    // Calculate average response time (mock calculation)
    const averageResponseTime = 2.5; // hours
    
    // Emergency type distribution
    const specialtyDistribution: Record<string, number> = {};
    tickets.forEach(ticket => {
      const type = ticket.emergency.type;
      specialtyDistribution[type] = (specialtyDistribution[type] || 0) + 1;
    });
    
    return {
      totalTickets,
      activeTickets,
      resolvedTickets,
      averageResponseTime,
      specialtyDistribution
    };
  }
}

// Singleton instance
export const hospitalDB = new HospitalDatabase();
export default hospitalDB;