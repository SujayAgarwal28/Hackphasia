import React, { useState } from 'react';
import { RefugeeTicket } from '../types/hospital';
import { hospitalDB } from '../services/HospitalDatabase';
import { GeolocationService } from '../map/GeolocationService';
import './RefugeeTicketForm.css';

interface RefugeeTicketFormProps {
  onSubmit?: (ticket: RefugeeTicket) => void;
  onClose?: () => void;
}

export const RefugeeTicketForm: React.FC<RefugeeTicketFormProps> = ({ onSubmit, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [assignedHospitalInfo, setAssignedHospitalInfo] = useState<{
    hospitalName: string;
    hospitalType: string;
    estimatedResponse: string;
    contactInfo: string;
  } | null>(null);

  const [formData, setFormData] = useState({
    // Refugee Information
    name: '',
    age: '',
    gender: '' as 'male' | 'female' | 'other' | '',
    ethnicGroup: '',
    familySize: '',
    contactInfo: '',

    // Location
    address: '',
    camp: '',

    // Emergency Details
    emergencyType: '' as RefugeeTicket['emergency']['type'] | '',
    severity: '' as RefugeeTicket['emergency']['severity'] | '',
    description: '',
    symptoms: '',
    affectedPeople: 1
  });

  const emergencyTypes = [
    { value: 'medical', label: 'Medical Emergency' },
    { value: 'epidemic', label: 'Epidemic/Disease Outbreak' },
    { value: 'malnutrition', label: 'Malnutrition' },
    { value: 'trauma', label: 'Trauma/Injury' },
    { value: 'mental_health', label: 'Mental Health Crisis' },
    { value: 'general', label: 'General Emergency' }
  ];

  const severityLevels = [
    { value: 'low', label: 'Low - Non-urgent, can wait' },
    { value: 'medium', label: 'Medium - Needs attention today' },
    { value: 'high', label: 'High - Urgent, needs immediate care' },
    { value: 'critical', label: 'Critical - Life-threatening emergency' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Get current location
      const location = await GeolocationService.getCurrentLocation();
      
      // Create ticket data
      const ticketData: Omit<RefugeeTicket, 'id' | 'createdAt' | 'updatedAt' | 'nearestHospitals' | 'aiRecommendations'> = {
        refugeeInfo: {
          name: formData.name,
          age: formData.age ? parseInt(formData.age) : undefined,
          gender: formData.gender || undefined,
          ethnicGroup: formData.ethnicGroup,
          familySize: formData.familySize ? parseInt(formData.familySize) : undefined,
          contactInfo: formData.contactInfo
        },
        location: {
          lat: location.lat,
          lng: location.lng,
          address: formData.address || undefined,
          camp: formData.camp || undefined
        },
        emergency: {
          type: formData.emergencyType as RefugeeTicket['emergency']['type'],
          severity: formData.severity as RefugeeTicket['emergency']['severity'],
          description: formData.description,
          symptoms: formData.symptoms ? formData.symptoms.split(',').map(s => s.trim()) : undefined,
          affectedPeople: formData.affectedPeople
        },
        status: 'open'
      };

      // Submit ticket
      const createdTicket = await hospitalDB.createTicket(ticketData);
      
      // Get assigned hospital information for display
      if (createdTicket.assignedHospital) {
        const assignedHospital = await hospitalDB.getHospitalById(createdTicket.assignedHospital);
        if (assignedHospital) {
          setAssignedHospitalInfo({
            hospitalName: assignedHospital.name,
            hospitalType: assignedHospital.type === 'hospital' ? 'Hospital' : 
                         assignedHospital.type === 'clinic' ? 'Medical Clinic' :
                         assignedHospital.type === 'mobile_unit' ? 'Mobile Medical Unit' : 'Emergency Center',
            estimatedResponse: createdTicket.aiRecommendations?.estimatedResponse || 'Within 2 hours',
            contactInfo: assignedHospital.contactInfo.phone
          });
        }
      }
      
      setSuccess(true);
      onSubmit?.(createdTicket);

      // Reset form after successful submission
      setTimeout(() => {
        setFormData({
          name: '',
          age: '',
          gender: '',
          ethnicGroup: '',
          familySize: '',
          contactInfo: '',
          address: '',
          camp: '',
          emergencyType: '',
          severity: '',
          description: '',
          symptoms: '',
          affectedPeople: 1
        });
        setSuccess(false);
        setAssignedHospitalInfo(null);
      }, 3000);

    } catch (err) {
      console.error('Failed to submit ticket:', err);
      setError('Failed to submit emergency ticket. Please check your location settings and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="ticket-form">
        <div className="form-header">
          <h2>Emergency Ticket Submitted</h2>
          {onClose && (
            <button className="close-btn" onClick={onClose}>×</button>
          )}
        </div>
        
        <div className="success-message">
          <div className="success-icon">✅</div>
          <h3>Your emergency ticket has been submitted successfully!</h3>
          
          {assignedHospitalInfo && (
            <div className="hospital-assignment">
              <h4>🏥 Your case has been routed to:</h4>
              <div className="hospital-info">
                <p><strong>{assignedHospitalInfo.hospitalName}</strong></p>
                <p>Type: {assignedHospitalInfo.hospitalType}</p>
                <p>Expected Response Time: {assignedHospitalInfo.estimatedResponse}</p>
                <p>Contact: {assignedHospitalInfo.contactInfo}</p>
              </div>
            </div>
          )}
          
          <p>The assigned medical facility has been notified and will respond as soon as possible.</p>
          <p>Please keep your contact information available for hospital staff.</p>
          
          <div className="next-steps">
            <h4>What happens next:</h4>
            <ul>
              <li>The assigned hospital has been notified automatically</li>
              <li>Medical staff will contact you using the provided contact information</li>
              <li>Emergency response is being coordinated based on severity level</li>
              <li>Your location has been shared with the medical team</li>
              {assignedHospitalInfo && (
                <li>Emergency services will arrive within {assignedHospitalInfo.estimatedResponse}</li>
              )}
            </ul>
          </div>

          {onClose && (
            <button className="close-success-btn" onClick={onClose}>
              Close
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="ticket-form">
      <div className="form-header">
        <h2>Submit Emergency Ticket</h2>
        {onClose && (
          <button className="close-btn" onClick={onClose}>×</button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="emergency-form">
        <div className="form-section">
          <h3>Refugee Information</h3>
          
          <div className="form-row">
            <div className="form-group">
              <label>Full Name *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="Enter full name"
              />
            </div>

            <div className="form-group">
              <label>Age</label>
              <input
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                min="0"
                max="120"
                placeholder="Age"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
              >
                <option value="">Select gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Family Size</label>
              <input
                type="number"
                value={formData.familySize}
                onChange={(e) => setFormData({ ...formData, familySize: e.target.value })}
                min="1"
                placeholder="Number of family members"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Ethnic Group *</label>
            <input
              type="text"
              value={formData.ethnicGroup}
              onChange={(e) => setFormData({ ...formData, ethnicGroup: e.target.value })}
              required
              placeholder="e.g., Syrian, Afghan, Ukrainian, etc."
            />
          </div>

          <div className="form-group">
            <label>Contact Information *</label>
            <input
              type="text"
              value={formData.contactInfo}
              onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
              required
              placeholder="Phone number, WhatsApp, or other contact method"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Location Information</h3>
          <p className="location-note">
            Your GPS coordinates will be automatically detected. Please provide additional location details:
          </p>

          <div className="form-group">
            <label>Address or Nearest Landmark</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Street address, nearby building, or landmark"
            />
          </div>

          <div className="form-group">
            <label>Refugee Camp or Settlement</label>
            <input
              type="text"
              value={formData.camp}
              onChange={(e) => setFormData({ ...formData, camp: e.target.value })}
              placeholder="Name of camp or settlement (if applicable)"
            />
          </div>
        </div>

        <div className="form-section">
          <h3>Emergency Details</h3>

          <div className="form-row">
            <div className="form-group">
              <label>Emergency Type *</label>
              <select
                value={formData.emergencyType}
                onChange={(e) => setFormData({ ...formData, emergencyType: e.target.value as any })}
                required
              >
                <option value="">Select emergency type</option>
                {emergencyTypes.map(type => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Severity Level *</label>
              <select
                value={formData.severity}
                onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
                required
                className={`severity-select ${formData.severity}`}
              >
                <option value="">Select severity</option>
                {severityLevels.map(level => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Number of People Affected *</label>
            <input
              type="number"
              value={formData.affectedPeople}
              onChange={(e) => setFormData({ ...formData, affectedPeople: parseInt(e.target.value) || 1 })}
              min="1"
              required
            />
          </div>

          <div className="form-group">
            <label>Emergency Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={4}
              placeholder="Describe the emergency situation, medical condition, or assistance needed..."
            />
          </div>

          <div className="form-group">
            <label>Symptoms (if medical)</label>
            <input
              type="text"
              value={formData.symptoms}
              onChange={(e) => setFormData({ ...formData, symptoms: e.target.value })}
              placeholder="List symptoms separated by commas (fever, cough, pain, etc.)"
            />
          </div>
        </div>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <div className="form-actions">
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Submitting Emergency Ticket...' : 'Submit Emergency Ticket'}
          </button>
          
          {onClose && (
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
          )}
        </div>

        <div className="form-footer">
          <p><strong>Emergency?</strong> If this is a life-threatening emergency, also call local emergency services immediately.</p>
          <p><strong>Privacy:</strong> Your information will only be shared with medical professionals for emergency response.</p>
        </div>
      </form>
    </div>
  );
};

export default RefugeeTicketForm;