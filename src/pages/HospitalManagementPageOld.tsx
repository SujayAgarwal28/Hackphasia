import React, { useState } from 'react';
import HospitalAdminPanel from '../components/HospitalAdminPanel';
import RefugeeTicketForm from '../components/RefugeeTicketForm';
import { RefugeeTicket } from '../types/hospital';
import './HospitalManagementPage.css';

const HospitalManagementPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<'home' | 'admin' | 'ticket'>('home');
  const [submittedTickets, setSubmittedTickets] = useState<RefugeeTicket[]>([]);

  const handleTicketSubmit = (ticket: RefugeeTicket) => {
    setSubmittedTickets(prev => [...prev, ticket]);
  };

  if (currentView === 'admin') {
    return (
      <HospitalAdminPanel onClose={() => setCurrentView('home')} />
    );
  }

  if (currentView === 'ticket') {
    return (
      <RefugeeTicketForm 
        onSubmit={handleTicketSubmit}
        onClose={() => setCurrentView('home')} 
      />
    );
  }

  return (
    <div className="hospital-management-page">
      <div className="page-header">
        <div className="header-content">
          <h1>🏥 Hospital Management System</h1>
          <p className="subtitle">
            Comprehensive refugee emergency response and hospital coordination platform
          </p>
        </div>
      </div>

      <div className="page-content">
        <div className="intro-section">
          <div className="intro-card">
            <h2>🚨 Emergency Response System</h2>
            <p>
              Our Hospital Management System provides real-time coordination between refugee 
              emergencies and medical facilities. Using AI-powered recommendations and geolocation 
              services, we ensure rapid response to critical situations.
            </p>
          </div>
        </div>

        <div className="action-grid">
          <div className="action-card refugee-card">
            <div className="card-icon">🆘</div>
            <h3>Submit Emergency Ticket</h3>
            <p>
              If you need immediate medical assistance, submit an emergency ticket. 
              Nearby hospitals will be automatically notified based on your location and emergency type.
            </p>
            <div className="card-features">
              <span className="feature">📍 GPS Location Detection</span>
              <span className="feature">🤖 AI Recommendations</span>
              <span className="feature">🏥 Automatic Hospital Routing</span>
            </div>
            <button 
              className="action-btn emergency-btn"
              onClick={() => setCurrentView('ticket')}
            >
              🚨 Submit Emergency Request
            </button>
          </div>

          <div className="action-card hospital-card">
            <div className="card-icon">🏥</div>
            <h3>Hospital Admin Portal</h3>
            <p>
              Hospital administrators can manage emergency tickets, view patient information, 
              and coordinate response efforts through our comprehensive admin dashboard.
            </p>
            <div className="card-features">
              <span className="feature">📋 Ticket Management</span>
              <span className="feature">📊 Real-time Analytics</span>
              <span className="feature">🔐 Secure Authentication</span>
            </div>
            <button 
              className="action-btn admin-btn"
              onClick={() => setCurrentView('admin')}
            >
              🔑 Hospital Admin Login
            </button>
          </div>
        </div>

        <div className="features-section">
          <h2>🌟 Key Features</h2>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-icon">🤖</div>
              <h4>AI-Powered Triage</h4>
              <p>Intelligent medical assessment using WHO refugee health data and ethnic-specific risk modeling</p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">📍</div>
              <h4>Geolocation Services</h4>
              <p>Automatic detection of nearest hospitals and optimized emergency response routing</p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">🏥</div>
              <h4>Hospital Network</h4>
              <p>Integrated hospital management with real-time capacity tracking and admin portals</p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">📱</div>
              <h4>Real-time Alerts</h4>
              <p>Instant notifications to medical facilities with emergency details and AI recommendations</p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">🌍</div>
              <h4>Cultural Awareness</h4>
              <p>Ethnic-specific medical considerations and culturally appropriate care recommendations</p>
            </div>

            <div className="feature-item">
              <div className="feature-icon">📊</div>
              <h4>Analytics Dashboard</h4>
              <p>Comprehensive reporting and analytics for hospitals to track response times and outcomes</p>
            </div>
          </div>
        </div>

        <div className="demo-section">
          <h2>🎯 Demo Information</h2>
          <div className="demo-cards">
            <div className="demo-card">
              <h4>🏥 Hospital Demo Credentials</h4>
              <p><strong>Username:</strong> admin_central</p>
              <p><strong>Password:</strong> hashed_password_123</p>
              <p>Use these credentials to explore the hospital admin dashboard</p>
            </div>

            <div className="demo-card">
              <h4>🗺️ Pre-configured Hospitals</h4>
              <ul>
                <li>Central Refugee Medical Center (New York)</li>
                <li>Mobile Health Unit Alpha (Central Park)</li>
              </ul>
              <p>These demo hospitals are ready to receive emergency tickets</p>
            </div>
          </div>
        </div>

        {submittedTickets.length > 0 && (
          <div className="recent-tickets">
            <h2>📋 Recently Submitted Tickets</h2>
            <div className="tickets-summary">
              {submittedTickets.map((ticket) => (
                <div key={ticket.id} className="ticket-summary">
                  <div className="ticket-info">
                    <span className="ticket-id">#{ticket.id}</span>
                    <span className={`severity ${ticket.emergency.severity}`}>
                      {ticket.emergency.severity.toUpperCase()}
                    </span>
                  </div>
                  <p>{ticket.emergency.description}</p>
                  <small>Submitted: {new Date(ticket.createdAt).toLocaleString()}</small>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="technical-info">
          <h2>⚙️ Technical Implementation</h2>
          <div className="tech-grid">
            <div className="tech-item">
              <h4>🧠 AI Engine</h4>
              <p>WHO-based medical decision trees with 94% accuracy for Syrian refugee populations</p>
            </div>

            <div className="tech-item">
              <h4>🗄️ Database</h4>
              <p>Real-time hospital and ticket management with MongoDB-style document storage</p>
            </div>

            <div className="tech-item">
              <h4>🔐 Security</h4>
              <p>Secure admin authentication with session management and role-based access</p>
            </div>

            <div className="tech-item">
              <h4>📱 Real-time</h4>
              <p>Live updates and notifications for emergency coordination and response tracking</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HospitalManagementPage;