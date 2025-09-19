import React, { useState } from 'react';
import { Hospital, RefugeeTicket, AdminSession } from '../types/hospital';
import { hospitalDB } from '../services/HospitalDatabase';
import { HospitalMap } from './HospitalMap';
import './HospitalAdminPanel.css';

interface HospitalAdminPanelProps {
  onClose?: () => void;
}

export const HospitalAdminPanel: React.FC<HospitalAdminPanelProps> = ({ onClose }) => {
  const [currentView, setCurrentView] = useState<'login' | 'register' | 'dashboard'>('login');
  const [session, setSession] = useState<AdminSession | null>(null);
  const [hospital, setHospital] = useState<Hospital | null>(null);
  const [tickets, setTickets] = useState<RefugeeTicket[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Login form state
  const [loginForm, setLoginForm] = useState({
    username: '',
    password: ''
  });

  // Registration form state
  const [registerForm, setRegisterForm] = useState({
    name: '',
    type: 'clinic' as Hospital['type'],
    specialty: '',
    address: '',
    phone: '',
    email: '',
    beds: 10,
    emergencyBeds: 2,
    staff: 5,
    username: '',
    password: ''
  });

  // Handle login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const authResult = await hospitalDB.authenticateAdmin(loginForm.username, loginForm.password);
      if (authResult) {
        const adminSession: AdminSession = {
          hospitalId: authResult.hospital.id,
          username: loginForm.username,
          loginTime: new Date(),
          isActive: true
        };
        setSession(adminSession);
        setHospital(authResult.hospital);
        setCurrentView('dashboard');
        await loadTickets(authResult.hospital.id);
      } else {
        setError('Invalid credentials');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle registration
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get current location for registration
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });

      const newHospital = await hospitalDB.addHospital({
        name: registerForm.name,
        type: registerForm.type,
        specialty: registerForm.specialty.split(',').map((s: string) => s.trim()),
        coordinates: {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        },
        address: registerForm.address,
        contactInfo: {
          phone: registerForm.phone,
          email: registerForm.email
        },
        capacity: {
          beds: registerForm.beds,
          emergencyBeds: registerForm.emergencyBeds,
          staff: registerForm.staff
        },
        services: ['emergency_care', 'primary_care'],
        adminCredentials: {
          username: registerForm.username,
          passwordHash: registerForm.password // In real app, hash this
        },
        status: 'active'
      });

      // Auto-login after registration
      const authResult = await hospitalDB.authenticateAdmin(registerForm.username, registerForm.password);
      if (authResult) {
        const adminSession: AdminSession = {
          hospitalId: authResult.hospital.id,
          username: registerForm.username,
          loginTime: new Date(),
          isActive: true
        };
        setSession(adminSession);
        setHospital(newHospital);
        setCurrentView('dashboard');
        await loadTickets(newHospital.id);
      }
    } catch (err) {
      setError('Registration failed. Please check your location settings and try again.');
    } finally {
      setLoading(false);
    }
  };

  // Load tickets for hospital
  const loadTickets = async (hospitalId: string) => {
    try {
      const hospitalTickets = await hospitalDB.getTicketsForHospital(hospitalId);
      setTickets(hospitalTickets);
    } catch (err) {
      console.error('Failed to load tickets:', err);
    }
  };

  // Handle ticket assignment
  const handleAssignTicket = async (ticketId: string) => {
    if (!hospital) return;

    try {
      await hospitalDB.assignTicketToHospital(ticketId, hospital.id);
      await loadTickets(hospital.id);
    } catch (err) {
      setError('Failed to assign ticket');
    }
  };

  // Handle ticket status update
  const handleUpdateTicketStatus = async (ticketId: string, status: RefugeeTicket['status']) => {
    try {
      await hospitalDB.updateTicket(ticketId, { status });
      await loadTickets(hospital?.id || '');
    } catch (err) {
      setError('Failed to update ticket status');
    }
  };

  // Logout
  const handleLogout = () => {
    setSession(null);
    setHospital(null);
    setTickets([]);
    setCurrentView('login');
    setLoginForm({ username: '', password: '' });
  };

  // Login View
  if (currentView === 'login') {
    return (
      <div className="admin-panel">
        <div className="admin-header">
          <h2>🏥 Hospital Admin Login</h2>
          {onClose && (
            <button className="close-btn" onClick={onClose}>×</button>
          )}
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              value={loginForm.username}
              onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
              required
            />
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
              required
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="auth-actions">
            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <button type="button" onClick={() => setCurrentView('register')}>
              Register New Hospital
            </button>
          </div>
        </form>

        <div className="demo-credentials">
          <h4>Demo Credentials:</h4>
          <p><strong>Username:</strong> admin_central</p>
          <p><strong>Password:</strong> hashed_password_123</p>
        </div>
      </div>
    );
  }

  // Registration View
  if (currentView === 'register') {
    return (
      <div className="admin-panel">
        <div className="admin-header">
          <h2>🏥 Register New Hospital</h2>
          {onClose && (
            <button className="close-btn" onClick={onClose}>×</button>
          )}
        </div>

        <form onSubmit={handleRegister} className="auth-form">
          <div className="form-row">
            <div className="form-group">
              <label>Hospital Name:</label>
              <input
                type="text"
                value={registerForm.name}
                onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Type:</label>
              <select
                value={registerForm.type}
                onChange={(e) => setRegisterForm({ ...registerForm, type: e.target.value as Hospital['type'] })}
              >
                <option value="clinic">Clinic</option>
                <option value="hospital">Hospital</option>
                <option value="emergency_center">Emergency Center</option>
                <option value="mobile_unit">Mobile Unit</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Specialties (comma-separated):</label>
            <input
              type="text"
              value={registerForm.specialty}
              onChange={(e) => setRegisterForm({ ...registerForm, specialty: e.target.value })}
              placeholder="emergency_medicine, pediatrics, mental_health"
            />
          </div>

          <div className="form-group">
            <label>Address:</label>
            <input
              type="text"
              value={registerForm.address}
              onChange={(e) => setRegisterForm({ ...registerForm, address: e.target.value })}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Phone:</label>
              <input
                type="tel"
                value={registerForm.phone}
                onChange={(e) => setRegisterForm({ ...registerForm, phone: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Email:</label>
              <input
                type="email"
                value={registerForm.email}
                onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Total Beds:</label>
              <input
                type="number"
                value={registerForm.beds}
                onChange={(e) => setRegisterForm({ ...registerForm, beds: parseInt(e.target.value) })}
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label>Emergency Beds:</label>
              <input
                type="number"
                value={registerForm.emergencyBeds}
                onChange={(e) => setRegisterForm({ ...registerForm, emergencyBeds: parseInt(e.target.value) })}
                min="1"
                required
              />
            </div>

            <div className="form-group">
              <label>Staff Count:</label>
              <input
                type="number"
                value={registerForm.staff}
                onChange={(e) => setRegisterForm({ ...registerForm, staff: parseInt(e.target.value) })}
                min="1"
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Admin Username:</label>
              <input
                type="text"
                value={registerForm.username}
                onChange={(e) => setRegisterForm({ ...registerForm, username: e.target.value })}
                required
              />
            </div>

            <div className="form-group">
              <label>Admin Password:</label>
              <input
                type="password"
                value={registerForm.password}
                onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                required
              />
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="auth-actions">
            <button type="submit" disabled={loading}>
              {loading ? 'Registering...' : 'Register Hospital'}
            </button>
            <button type="button" onClick={() => setCurrentView('login')}>
              Back to Login
            </button>
          </div>
        </form>
      </div>
    );
  }

  // Dashboard View
  return (
    <div className="admin-panel">
      <div className="admin-header">
        <div>
          <h2>🏥 {hospital?.name}</h2>
          <p className="hospital-info">
            {hospital?.type} • {hospital?.address}
          </p>
        </div>
        <div className="header-actions">
          <span className="welcome-text">Welcome, {session?.username}</span>
          <button onClick={handleLogout} className="logout-btn">Logout</button>
          {onClose && (
            <button className="close-btn" onClick={onClose}>×</button>
          )}
        </div>
      </div>

      <div className="dashboard-content">
        <div className="stats-grid">
          <div className="stat-card">
            <h3>📋 Total Tickets</h3>
            <div className="stat-value">{tickets.length}</div>
          </div>
          
          <div className="stat-card">
            <h3>🚨 Active Emergencies</h3>
            <div className="stat-value">
              {tickets.filter((t: RefugeeTicket) => ['open', 'assigned', 'in_progress'].includes(t.status)).length}
            </div>
          </div>
          
          <div className="stat-card">
            <h3>🛏️ Bed Capacity</h3>
            <div className="stat-value">{hospital?.capacity.beds}</div>
          </div>
          
          <div className="stat-card">
            <h3>⚡ Emergency Beds</h3>
            <div className="stat-value">{hospital?.capacity.emergencyBeds}</div>
          </div>
        </div>

        <div className="tickets-section">
          <h3>🎫 Refugee Emergency Tickets</h3>
          
          {tickets.length === 0 ? (
            <div className="no-tickets">
              <p>No emergency tickets assigned to your hospital yet.</p>
            </div>
          ) : (
            <div className="tickets-list">
              {tickets.map((ticket: RefugeeTicket) => (
                <div key={ticket.id} className={`ticket-card ${ticket.emergency.severity}`}>
                  <div className="ticket-header">
                    <div className="ticket-id">#{ticket.id}</div>
                    <div className={`severity-badge ${ticket.emergency.severity}`}>
                      {ticket.emergency.severity.toUpperCase()}
                    </div>
                    <div className={`status-badge ${ticket.status}`}>
                      {ticket.status.replace('_', ' ').toUpperCase()}
                    </div>
                  </div>

                  <div className="ticket-content">
                    <div className="refugee-info">
                      <h4>👤 {ticket.refugeeInfo.name}</h4>
                      <p>Age: {ticket.refugeeInfo.age || 'Unknown'} • Gender: {ticket.refugeeInfo.gender || 'Unknown'}</p>
                      <p>Ethnic Group: {ticket.refugeeInfo.ethnicGroup}</p>
                      {ticket.refugeeInfo.familySize && (
                        <p>Family Size: {ticket.refugeeInfo.familySize}</p>
                      )}
                    </div>

                    <div className="emergency-info">
                      <h4>🚨 Emergency Details</h4>
                      <p><strong>Type:</strong> {ticket.emergency.type.replace('_', ' ')}</p>
                      <p><strong>Description:</strong> {ticket.emergency.description}</p>
                      <p><strong>Affected People:</strong> {ticket.emergency.affectedPeople}</p>
                      {ticket.emergency.symptoms && (
                        <p><strong>Symptoms:</strong> {ticket.emergency.symptoms.join(', ')}</p>
                      )}
                    </div>

                    <div className="location-info">
                      <h4>📍 Location</h4>
                      <p>Coordinates: {ticket.location.lat.toFixed(4)}, {ticket.location.lng.toFixed(4)}</p>
                      {ticket.location.address && <p>Address: {ticket.location.address}</p>}
                      {ticket.location.camp && <p>Camp: {ticket.location.camp}</p>}
                    </div>

                    {ticket.aiRecommendations && (
                      <div className="ai-recommendations">
                        <h4>🤖 AI Recommendations</h4>
                        <div className="recommendation-grid">
                          <div>
                            <strong>Immediate Supplies:</strong>
                            <ul>
                              {ticket.aiRecommendations.immediateSupplies.map((supply: string, index: number) => (
                                <li key={index}>{supply}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <strong>Priority:</strong> {ticket.aiRecommendations.medicalPriority}/10
                          </div>
                          <div>
                            <strong>Response Time:</strong> {ticket.aiRecommendations.estimatedResponse}
                          </div>
                          {ticket.aiRecommendations.culturalConsiderations.length > 0 && (
                            <div>
                              <strong>Cultural Considerations:</strong>
                              <ul>
                                {ticket.aiRecommendations.culturalConsiderations.map((consideration: string, index: number) => (
                                  <li key={index}>{consideration}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="ticket-actions">
                    {ticket.status === 'open' && (
                      <button 
                        onClick={() => handleAssignTicket(ticket.id)}
                        className="assign-btn"
                      >
                        Accept Ticket
                      </button>
                    )}
                    
                    {ticket.assignedHospital === hospital?.id && (
                      <div className="status-actions">
                        {ticket.status === 'assigned' && (
                          <button 
                            onClick={() => handleUpdateTicketStatus(ticket.id, 'in_progress')}
                            className="progress-btn"
                          >
                            Start Treatment
                          </button>
                        )}
                        
                        {ticket.status === 'in_progress' && (
                          <button 
                            onClick={() => handleUpdateTicketStatus(ticket.id, 'resolved')}
                            className="resolve-btn"
                          >
                            Mark Resolved
                          </button>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="ticket-timestamp">
                    Created: {new Date(ticket.createdAt).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HospitalAdminPanel;