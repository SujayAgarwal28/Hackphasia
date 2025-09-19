import React, { useState, useEffect } from 'react';
import { Hospital, RefugeeTicket } from '../types/hospital';
import { hospitalDB } from '../services/HospitalDatabase';
import { HospitalMap } from './HospitalMap';
import { RefugeeHealthcareAI } from '../services/RefugeeHealthcareAI';
import { RefugeeAnalyticsCharts } from './RefugeeAnalyticsCharts';
import './HospitalAdminPanel.css';

interface HospitalAdminPanelProps {
  onClose?: () => void;
}

interface AIInsights {
  criticalCases: number;
  resourceAllocation: string[];
  capacityRecommendation: string;
  refugeePopulationTrends: string[];
  culturalConsiderations: string[];
}

export const HospitalAdminPanel: React.FC<HospitalAdminPanelProps> = () => {
  const [currentView, setCurrentView] = useState<'login' | 'register' | 'dashboard'>('login');
  const [session, setSession] = useState<{ hospital: Hospital; sessionId: string } | null>(null);
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [tickets, setTickets] = useState<RefugeeTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<RefugeeTicket | null>(null);
  const [dashboardView, setDashboardView] = useState<'overview' | 'tickets' | 'analytics' | 'map'>('overview');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Login form state
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });

  // Registration form state
  const [registerForm, setRegisterForm] = useState({
    hospitalName: '',
    type: 'hospital' as Hospital['type'],
    specialty: '',
    phone: '',
    email: '',
    emergencyContact: '',
    beds: '',
    emergencyBeds: '',
    staff: '',
    services: '',
    username: '',
    password: '',
    address: ''
  });

  useEffect(() => {
    if (session) {
      loadHospitalData();
      loadTickets();
    }
  }, [session]);

  const generateAIInsights = (): AIInsights => {
    if (!hospital) {
      return {
        criticalCases: 0,
        resourceAllocation: ['No hospital data available'],
        capacityRecommendation: 'Unable to assess capacity',
        refugeePopulationTrends: ['No data available'],
        culturalConsiderations: ['No considerations available']
      };
    }

    const aiSystem = new RefugeeHealthcareAI(tickets, hospital);
    const recommendations = aiSystem.generateAIRecommendations();
    const insights = aiSystem.generateComprehensiveInsights();
    const criticalCases = tickets.filter(t => t.emergency.severity === 'critical').length;

    return {
      criticalCases,
      resourceAllocation: recommendations.immediate.actions,
      capacityRecommendation: recommendations.immediate.priority,
      refugeePopulationTrends: [
        `Ethnic groups: ${Object.keys(insights.populationTrends.ethnicDistribution).join(', ')}`,
        `Health patterns: ${Object.keys(insights.healthPatterns.emergencyTypes).join(', ')}`,
        `Response time: ${recommendations.qualityMetrics.responseTime} minutes`,
        `Cultural competency: ${recommendations.qualityMetrics.culturalCompetencyRating}%`
      ],
      culturalConsiderations: insights.culturalConsiderations.religiousRequirements.concat(
        insights.culturalConsiderations.languageBarriers
      )
    };
  };

  const loadHospitalData = async () => {
    if (!session) return;
    
    try {
      setLoading(true);
      // Hospital data is already in session
      setHospital(session.hospital);
    } catch (err) {
      setError('Failed to load hospital data');
    } finally {
      setLoading(false);
    }
  };

  const loadTickets = async () => {
    if (!session) return;
    
    try {
      const allTickets = await hospitalDB.getAllTickets();
      const hospitalTickets = allTickets.filter(t => 
        t.assignedHospital === session.hospital.id || t.nearestHospitals.includes(session.hospital.id)
      );
      setTickets(hospitalTickets);
    } catch (err) {
      setError('Failed to load tickets');
    }
  };

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const loginSession = await hospitalDB.authenticateAdmin(loginForm.username, loginForm.password);
      setSession(loginSession);
      setCurrentView('dashboard');
    } catch (err) {
      setError('Invalid username or password');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    try {
      setLoading(true);
      setError(null);

      // For demo, we'll just set the hospital in state directly
      // In real app, you'd save to database first
      setHospital({
        id: 'temp_' + Date.now(),
        name: registerForm.hospitalName,
        type: registerForm.type,
        specialty: registerForm.specialty.split(',').map(s => s.trim()),
        coordinates: { lat: 40.7589, lng: -73.9851 },
        address: registerForm.address,
        contactInfo: {
          phone: registerForm.phone,
          email: registerForm.email,
          emergencyContact: registerForm.emergencyContact
        },
        capacity: {
          beds: parseInt(registerForm.beds),
          emergencyBeds: parseInt(registerForm.emergencyBeds),
          staff: parseInt(registerForm.staff)
        },
        services: registerForm.services.split(',').map(s => s.trim()),
        adminCredentials: {
          username: registerForm.username,
          passwordHash: registerForm.password
        },
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      const loginSession = await hospitalDB.authenticateAdmin(registerForm.username, registerForm.password);
      setSession(loginSession);
      setCurrentView('dashboard');
    } catch (err) {
      setError('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleTicketAction = async (ticketId: string, action: 'accept' | 'start_treatment' | 'resolve') => {
    try {
      let newStatus: RefugeeTicket['status'];
      switch (action) {
        case 'accept':
          newStatus = 'assigned';
          break;
        case 'start_treatment':
          newStatus = 'in_progress';
          break;
        case 'resolve':
          newStatus = 'resolved';
          break;
      }
      
      await hospitalDB.updateTicket(ticketId, { status: newStatus });
      await loadTickets();
    } catch (err) {
      setError('Failed to update ticket');
    }
  };

  const renderLogin = () => (
    <div className="admin-container">
      <div className="admin-card">
        <div className="card-header">
          <h2>Hospital Admin Login</h2>
          <p>Access your hospital's emergency coordination system</p>
        </div>
        
        <div className="form-container">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={loginForm.username}
              onChange={(e) => setLoginForm({...loginForm, username: e.target.value})}
              placeholder="admin_central"
            />
          </div>
          
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
              placeholder="hashed_password_123"
            />
          </div>
          
          <div className="form-actions">
            <button 
              onClick={handleLogin} 
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
            
            <button 
              onClick={() => setCurrentView('register')}
              className="btn-secondary"
            >
              Register New Hospital
            </button>
          </div>
          
          <div className="demo-info">
            <p><strong>Demo Credentials:</strong></p>
            <p>Username: admin_central</p>
            <p>Password: hashed_password_123</p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRegister = () => (
    <div className="admin-container">
      <div className="admin-card large">
        <div className="card-header">
          <h2>Register New Hospital</h2>
          <p>Join the refugee emergency response network</p>
        </div>
        
        <div className="form-container">
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-grid">
            <div className="form-group">
              <label>Hospital Name</label>
              <input
                type="text"
                value={registerForm.hospitalName}
                onChange={(e) => setRegisterForm({...registerForm, hospitalName: e.target.value})}
                placeholder="Central Medical Center"
              />
            </div>
            
            <div className="form-group">
              <label>Type</label>
              <select
                value={registerForm.type}
                onChange={(e) => setRegisterForm({...registerForm, type: e.target.value as Hospital['type']})}
              >
                <option value="hospital">Hospital</option>
                <option value="clinic">Clinic</option>
                <option value="emergency_center">Emergency Center</option>
                <option value="mobile_unit">Mobile Unit</option>
              </select>
            </div>
            
            <div className="form-group full-width">
              <label>Specialties (comma-separated)</label>
              <input
                type="text"
                value={registerForm.specialty}
                onChange={(e) => setRegisterForm({...registerForm, specialty: e.target.value})}
                placeholder="Emergency medicine, Pediatrics, Mental health"
              />
            </div>
            
            <div className="form-group">
              <label>Phone</label>
              <input
                type="tel"
                value={registerForm.phone}
                onChange={(e) => setRegisterForm({...registerForm, phone: e.target.value})}
                placeholder="+1-555-0123"
              />
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                placeholder="admin@hospital.org"
              />
            </div>
            
            <div className="form-group">
              <label>Total Beds</label>
              <input
                type="number"
                value={registerForm.beds}
                onChange={(e) => setRegisterForm({...registerForm, beds: e.target.value})}
                placeholder="200"
              />
            </div>
            
            <div className="form-group">
              <label>Emergency Beds</label>
              <input
                type="number"
                value={registerForm.emergencyBeds}
                onChange={(e) => setRegisterForm({...registerForm, emergencyBeds: e.target.value})}
                placeholder="50"
              />
            </div>
            
            <div className="form-group">
              <label>Staff Count</label>
              <input
                type="number"
                value={registerForm.staff}
                onChange={(e) => setRegisterForm({...registerForm, staff: e.target.value})}
                placeholder="150"
              />
            </div>
            
            <div className="form-group full-width">
              <label>Services (comma-separated)</label>
              <input
                type="text"
                value={registerForm.services}
                onChange={(e) => setRegisterForm({...registerForm, services: e.target.value})}
                placeholder="Emergency care, Surgery, Laboratory, Pharmacy"
              />
            </div>
            
            <div className="form-group">
              <label>Admin Username</label>
              <input
                type="text"
                value={registerForm.username}
                onChange={(e) => setRegisterForm({...registerForm, username: e.target.value})}
                placeholder="admin_username"
              />
            </div>
            
            <div className="form-group">
              <label>Admin Password</label>
              <input
                type="password"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                placeholder="secure_password"
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button 
              onClick={handleRegister} 
              disabled={loading}
              className="btn-primary"
            >
              {loading ? 'Registering...' : 'Register Hospital'}
            </button>
            
            <button 
              onClick={() => setCurrentView('login')}
              className="btn-secondary"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderOverview = () => {
    const aiInsights = generateAIInsights();
    const activeEmergencies = tickets.filter(t => t.status !== 'resolved' && t.status !== 'closed').length;
    const capacityUtilization = hospital ? 
      Math.round((activeEmergencies / hospital.capacity.emergencyBeds) * 100) : 0;

    return (
      <div className="dashboard-content">
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-value">{tickets.length}</div>
            <div className="metric-label">Total Cases</div>
            <div className="metric-trend">+12% from last week</div>
          </div>
          
          <div className="metric-card critical">
            <div className="metric-value">{aiInsights.criticalCases}</div>
            <div className="metric-label">Critical Cases</div>
            <div className="metric-trend">Requires immediate attention</div>
          </div>
          
          <div className="metric-card">
            <div className="metric-value">{capacityUtilization}%</div>
            <div className="metric-label">Capacity Utilization</div>
            <div className="metric-trend">{capacityUtilization > 80 ? 'High load' : 'Normal'}</div>
          </div>
          
          <div className="metric-card">
            <div className="metric-value">{hospital?.capacity.emergencyBeds}</div>
            <div className="metric-label">Emergency Beds</div>
            <div className="metric-trend">{hospital?.capacity.emergencyBeds! - activeEmergencies} available</div>
          </div>
        </div>

        <div className="insights-section">
          <div className="ai-insights">
            <h3>AI-Powered Insights</h3>
            
            <div className="insight-card">
              <h4>Resource Allocation</h4>
              <ul>
                {aiInsights.resourceAllocation.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
            
            <div className="insight-card">
              <h4>Capacity Recommendation</h4>
              <p>{aiInsights.capacityRecommendation}</p>
            </div>
            
            <div className="insight-card">
              <h4>Refugee Population Trends</h4>
              <ul>
                {aiInsights.refugeePopulationTrends.map((trend, index) => (
                  <li key={index}>{trend}</li>
                ))}
              </ul>
            </div>
            
            <div className="insight-card">
              <h4>Cultural Considerations</h4>
              <ul>
                {aiInsights.culturalConsiderations.map((consideration, index) => (
                  <li key={index}>{consideration}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderTickets = () => (
    <div className="dashboard-content">
      <div className="tickets-header">
        <h3>Emergency Tickets</h3>
        <div className="filter-controls">
          <select defaultValue="all">
            <option value="all">All Status</option>
            <option value="open">Open</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
          
          <select defaultValue="all">
            <option value="all">All Severity</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>
      
      <div className="tickets-list">
        {tickets.map(ticket => (
          <div key={ticket.id} className={`ticket-card ${ticket.emergency.severity}`}>
            <div className="ticket-header">
              <div className="ticket-info">
                <h4>{ticket.refugeeInfo.name}</h4>
                <div className="ticket-meta">
                  <span className={`severity ${ticket.emergency.severity}`}>
                    {ticket.emergency.severity.toUpperCase()}
                  </span>
                  <span className={`status ${ticket.status}`}>
                    {ticket.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className="timestamp">
                    {new Date(ticket.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              
              <div className="ticket-actions">
                {ticket.status === 'open' && (
                  <button 
                    onClick={() => handleTicketAction(ticket.id, 'accept')}
                    className="btn-accept"
                  >
                    Accept
                  </button>
                )}
                {ticket.status === 'assigned' && (
                  <button 
                    onClick={() => handleTicketAction(ticket.id, 'start_treatment')}
                    className="btn-start"
                  >
                    Start Treatment
                  </button>
                )}
                {ticket.status === 'in_progress' && (
                  <button 
                    onClick={() => handleTicketAction(ticket.id, 'resolve')}
                    className="btn-resolve"
                  >
                    Mark Resolved
                  </button>
                )}
              </div>
            </div>
            
            <div className="ticket-details">
              <div className="detail-section">
                <h5>Emergency Details</h5>
                <p><strong>Type:</strong> {ticket.emergency.type}</p>
                <p><strong>Description:</strong> {ticket.emergency.description}</p>
                <p><strong>Affected People:</strong> {ticket.emergency.affectedPeople}</p>
              </div>
              
              <div className="detail-section">
                <h5>Location</h5>
                <p>{ticket.location.address || 'Address not provided'}</p>
                <p>Coordinates: {ticket.location.lat.toFixed(4)}, {ticket.location.lng.toFixed(4)}</p>
              </div>
              
              {ticket.aiRecommendations && (
                <div className="detail-section">
                  <h5>AI Recommendations</h5>
                  <p><strong>Priority Score:</strong> {ticket.aiRecommendations.medicalPriority}/10</p>
                  <p><strong>Supplies:</strong> {ticket.aiRecommendations.immediateSupplies.join(', ')}</p>
                  <p><strong>Cultural Notes:</strong> {ticket.aiRecommendations.culturalConsiderations.join(', ')}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAnalytics = () => (
    <div className="dashboard-content">
      <RefugeeAnalyticsCharts tickets={tickets} />
    </div>
  );

  const renderMap = () => (
    <div className="dashboard-content">
      <HospitalMap 
        tickets={tickets}
        hospitals={hospital ? [hospital] : []}
        selectedTicket={selectedTicket}
        onTicketSelect={setSelectedTicket}
      />
    </div>
  );

  const renderDashboard = () => (
    <div className="admin-container">
      <div className="dashboard-layout">
        <div className="dashboard-sidebar">
          <div className="hospital-info">
            <h2>{hospital?.name}</h2>
            <p>{hospital?.type} • {hospital?.status}</p>
          </div>
          
          <nav className="dashboard-nav">
            <button 
              className={dashboardView === 'overview' ? 'active' : ''}
              onClick={() => setDashboardView('overview')}
            >
              Overview
            </button>
            <button 
              className={dashboardView === 'tickets' ? 'active' : ''}
              onClick={() => setDashboardView('tickets')}
            >
              Emergency Tickets
            </button>
            <button 
              className={dashboardView === 'map' ? 'active' : ''}
              onClick={() => setDashboardView('map')}
            >
              Geographic View
            </button>
            <button 
              className={dashboardView === 'analytics' ? 'active' : ''}
              onClick={() => setDashboardView('analytics')}
            >
              Analytics
            </button>
          </nav>
          
          <div className="sidebar-footer">
            <button 
              onClick={() => {
                setSession(null);
                setCurrentView('login');
              }}
              className="btn-logout"
            >
              Sign Out
            </button>
          </div>
        </div>
        
        <div className="dashboard-main">
          {dashboardView === 'overview' && renderOverview()}
          {dashboardView === 'tickets' && renderTickets()}
          {dashboardView === 'analytics' && renderAnalytics()}
          {dashboardView === 'map' && renderMap()}
        </div>
      </div>
    </div>
  );

  if (currentView === 'login') return renderLogin();
  if (currentView === 'register') return renderRegister();
  if (currentView === 'dashboard') return renderDashboard();
  
  return null;
};