import React, { useState } from 'react';
import { HospitalAdminPanel } from '../components/HospitalAdminPanel';
import { RefugeeTicketForm } from '../components/RefugeeTicketForm';
import './HospitalManagementPage.css';

export const HospitalManagementPage: React.FC = () => {
  const [currentView, setCurrentView] = useState<'main' | 'admin' | 'refugee'>('main');

  if (currentView === 'admin') {
    return <HospitalAdminPanel onClose={() => setCurrentView('main')} />;
  }

  if (currentView === 'refugee') {
    return (
      <div className="page-container">
        <div className="page-header">
          <button 
            onClick={() => setCurrentView('main')}
            className="back-button"
          >
            ← Back to Overview
          </button>
        </div>
        <RefugeeTicketForm />
      </div>
    );
  }

  return (
    <div className="hospital-management-page">
      <div className="page-container">
        <header className="page-header">
          <div className="header-content">
            <h1>Hospital Emergency Coordination System</h1>
            <p className="subtitle">Connecting refugees with healthcare providers through intelligent emergency response</p>
          </div>
        </header>

        <section className="main-actions">
          <div className="action-grid">
            <div className="action-card refugee">
              <div className="card-header">
                <h2>Emergency Response</h2>
                <p>Submit urgent medical assistance requests with automatic hospital routing</p>
              </div>
              
              <div className="features-list">
                <span className="feature">GPS Location Detection</span>
                <span className="feature">AI Medical Triage</span>
                <span className="feature">Automatic Hospital Routing</span>
                <span className="feature">Multi-language Support</span>
              </div>
              
              <button 
                onClick={() => setCurrentView('refugee')}
                className="action-button primary"
              >
                Submit Emergency Request
              </button>
            </div>

            <div className="action-card hospital">
              <div className="card-header">
                <h2>Hospital Administration</h2>
                <p>Manage emergency tickets, coordinate response, and monitor hospital capacity</p>
              </div>
              
              <div className="features-list">
                <span className="feature">Emergency Ticket Management</span>
                <span className="feature">Real-time Analytics Dashboard</span>
                <span className="feature">Geographic Case Mapping</span>
                <span className="feature">AI-powered Insights</span>
              </div>
              
              <button 
                onClick={() => setCurrentView('admin')}
                className="action-button secondary"
              >
                Hospital Admin Access
              </button>
            </div>
          </div>
        </section>

        <section className="features-overview">
          <h2>Advanced Capabilities</h2>
          <div className="features-grid">
            <div className="feature-item">
              <div className="feature-header">
                <h3>Intelligent Medical Triage</h3>
              </div>
              <p>WHO-compliant assessment algorithms with refugee-specific health considerations and cultural sensitivity protocols</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-header">
                <h3>Geographic Intelligence</h3>
              </div>
              <p>Precise GPS routing to nearest qualified medical facilities with real-time capacity and specialization matching</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-header">
                <h3>Hospital Network Coordination</h3>
              </div>
              <p>Seamless communication between medical facilities for optimal patient distribution and resource allocation</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-header">
                <h3>Real-time Monitoring</h3>
              </div>
              <p>Live tracking of emergency cases, response times, and hospital capacity with predictive analytics</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-header">
                <h3>Cultural Competency</h3>
              </div>
              <p>Ethnic health pattern recognition, trauma-informed care protocols, and multilingual support systems</p>
            </div>
            
            <div className="feature-item">
              <div className="feature-header">
                <h3>Advanced Analytics</h3>
              </div>
              <p>Population health insights, resource optimization recommendations, and emergency response pattern analysis</p>
            </div>
          </div>
        </section>

        <section className="demo-section">
          <h2>System Access</h2>
          <div className="demo-grid">
            <div className="demo-card">
              <h3>Hospital Demo Access</h3>
              <div className="demo-details">
                <div className="credential-item">
                  <label>Username:</label>
                  <span>admin_central</span>
                </div>
                <div className="credential-item">
                  <label>Password:</label>
                  <span>hashed_password_123</span>
                </div>
              </div>
            </div>
            
            <div className="demo-card">
              <h3>Pre-configured Network</h3>
              <div className="hospital-list">
                <div className="hospital-item">
                  <strong>Central Refugee Medical Center</strong>
                  <span>200-bed facility • Emergency medicine, infectious diseases, pediatrics</span>
                </div>
                <div className="hospital-item">
                  <strong>Mobile Health Unit Alpha</strong>
                  <span>5-bed mobile unit • Primary care, vaccination, health screening</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="technical-specs">
          <h2>Technical Implementation</h2>
          <div className="specs-grid">
            <div className="spec-category">
              <h4>AI & Machine Learning</h4>
              <ul>
                <li>WHO-based medical decision trees</li>
                <li>Refugee population health modeling</li>
                <li>Predictive capacity management</li>
                <li>Cultural health pattern recognition</li>
              </ul>
            </div>
            
            <div className="spec-category">
              <h4>Real-time Systems</h4>
              <ul>
                <li>Live emergency ticket coordination</li>
                <li>GPS-based hospital routing</li>
                <li>Instant notification systems</li>
                <li>Dynamic capacity monitoring</li>
              </ul>
            </div>
            
            <div className="spec-category">
              <h4>Data & Analytics</h4>
              <ul>
                <li>Geographic case heat mapping</li>
                <li>Population trend analysis</li>
                <li>Resource utilization tracking</li>
                <li>Response time optimization</li>
              </ul>
            </div>
            
            <div className="spec-category">
              <h4>Security & Compliance</h4>
              <ul>
                <li>Healthcare data protection</li>
                <li>HIPAA-compliant protocols</li>
                <li>Secure session management</li>
                <li>Audit trail maintenance</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};