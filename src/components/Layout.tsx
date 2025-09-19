import React, { ReactNode, useState } from 'react';
import Navigation from './Navigation';
import { appMetadata } from '../config';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [showEmergencyModal, setShowEmergencyModal] = useState(false);

  const emergencyContacts = [
    {
      country: "Global",
      services: [
        { name: "WHO Emergency Hotline", number: "+41 22 791 21 11", description: "World Health Organization" },
        { name: "UNHCR Emergency", number: "+41 22 739 8111", description: "UN Refugee Agency" }
      ]
    },
    {
      country: "United States",
      services: [
        { name: "Emergency Services", number: "911", description: "Police, Fire, Medical" },
        { name: "Crisis Text Line", number: "Text HOME to 741741", description: "24/7 Crisis Support" },
        { name: "National Suicide Prevention", number: "988", description: "Suicide & Crisis Lifeline" }
      ]
    },
    {
      country: "United Kingdom", 
      services: [
        { name: "Emergency Services", number: "999", description: "Police, Fire, Medical" },
        { name: "NHS 111", number: "111", description: "Non-emergency medical advice" },
        { name: "Samaritans", number: "116 123", description: "Free 24/7 emotional support" }
      ]
    },
    {
      country: "India",
      services: [
        { name: "Emergency Services", number: "112", description: "Police, Fire, Medical" },
        { name: "Medical Emergency", number: "108", description: "Ambulance Services" },
        { name: "Mental Health Helpline", number: "9152987821", description: "iCALL Psychosocial Helpline" }
      ]
    },
    {
      country: "Canada",
      services: [
        { name: "Emergency Services", number: "911", description: "Police, Fire, Medical" },
        { name: "Crisis Services", number: "1-833-456-4566", description: "Canada Suicide Prevention" },
        { name: "Kids Help Phone", number: "1-800-668-6868", description: "24/7 support for youth" }
      ]
    }
  ];

  const governmentHealthLinks = [
    { name: "WHO - World Health Organization", url: "https://www.who.int/emergencies", region: "Global" },
    { name: "CDC - Centers for Disease Control", url: "https://www.cdc.gov/", region: "United States" },
    { name: "NHS - National Health Service", url: "https://www.nhs.uk/", region: "United Kingdom" },
    { name: "Health Canada", url: "https://www.canada.ca/en/health-canada.html", region: "Canada" },
    { name: "Ministry of Health & Family Welfare", url: "https://www.mohfw.gov.in/", region: "India" }
  ];

  const handleEmergencyClick = () => {
    setShowEmergencyModal(true);
  };

  const handleCallNumber = (number: string) => {
    window.open(`tel:${number}`, '_self');
  };

  const handleVisitWebsite = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Professional Header */}
      <header className="bg-white border-b border-neutral-200 sticky top-0 z-40">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold text-neutral-900">
                  {appMetadata.name}
                </h1>
                <p className="text-xs text-neutral-500 hidden sm:block">
                  AI-Powered Health Support Platform
                </p>
              </div>
            </div>

            {/* Navigation */}
            <Navigation />

            {/* User Actions */}
            <div className="flex items-center space-x-3">
              {/* Mobile Menu Button */}
              <button className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 transition-colors">
                <svg className="w-6 h-6 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <div className="lg:hidden bg-white border-b border-neutral-200 w-full">
        <div className="container-custom py-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <MobileNavItem href="/ai-triage" label="AI Assessment" />
            <MobileNavItem href="/multilingual" label="Translate" />
            <MobileNavItem href="/mental-health" label="Mental Health" />
            <MobileNavItem href="/" label="Dashboard" />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1">
        <div className="container-custom section-padding">
          {children}
        </div>
      </main>

      {/* Professional Footer */}
      <footer className="bg-white border-t border-neutral-200 mt-auto">
        <div className="container-custom py-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold text-neutral-900">{appMetadata.name}</h3>
              </div>
              <p className="text-sm text-neutral-600 mb-4">
                Empowering refugee communities with AI-powered healthcare support, 
                accessible in multiple languages with cultural sensitivity.
              </p>
              <div className="text-xs text-neutral-500">
                Version {appMetadata.version} • Built with care for global communities
              </div>
            </div>
            
            <div>
              
            </div>
            
            <div>
              <h4 className="font-medium text-neutral-900 mb-3">Emergency Support</h4>
              <div className="space-y-2 text-sm text-neutral-600">
                <p>Multilingual crisis intervention</p>
                <p>Cultural sensitivity protocols</p>
                <div className="mt-4">
                  <button 
                    onClick={handleEmergencyClick}
                    className="btn-danger btn-sm w-full"
                  >
                    Access Emergency Services
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="border-t border-neutral-200 mt-8 pt-6 text-center text-xs text-neutral-500">
            <p>
              This platform provides health information and support. Always consult healthcare 
              professionals for medical decisions. Emergency services: Contact local emergency numbers.
            </p>
          </div>
        </div>
      </footer>

      {/* Emergency Services Modal */}
      {showEmergencyModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-red-600">🚨 Emergency Services</h2>
                <button
                  onClick={() => setShowEmergencyModal(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Emergency Contacts */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-red-600">📞 Emergency Helplines</h3>
                  <div className="space-y-4">
                    {emergencyContacts.map((country, idx) => (
                      <div key={idx} className="border rounded-lg p-4">
                        <h4 className="font-medium text-gray-900 mb-3">{country.country}</h4>
                        <div className="space-y-2">
                          {country.services.map((service, serviceIdx) => (
                            <div key={serviceIdx} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                              <div>
                                <div className="font-medium text-sm">{service.name}</div>
                                <div className="text-xs text-gray-600">{service.description}</div>
                              </div>
                              <button
                                onClick={() => handleCallNumber(service.number)}
                                className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                              >
                                {service.number}
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Government Health Links */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-blue-600">🏛️ Government Health Services</h3>
                  <div className="space-y-3">
                    {governmentHealthLinks.map((link, idx) => (
                      <div key={idx} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium text-gray-900">{link.name}</h4>
                            <div className="text-sm text-gray-600">{link.region}</div>
                          </div>
                          <button
                            onClick={() => handleVisitWebsite(link.url)}
                            className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors"
                          >
                            Visit Site
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>⚠️ Important:</strong> In life-threatening emergencies, call your local emergency number immediately. 
                  This platform provides supplementary support and should not replace professional emergency services.
                </p>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setShowEmergencyModal(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Mobile Navigation Item Component
const MobileNavItem: React.FC<{ href: string; label: string }> = ({ href, label }) => (
  <a
    href={href}
    className="block p-3 text-center rounded-lg border border-neutral-200 hover:bg-neutral-50 transition-colors"
  >
    <div className="text-xs font-medium text-neutral-700">{label}</div>
  </a>
);

export default Layout;