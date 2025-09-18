import React, { ReactNode } from 'react';
import Navigation from './Navigation';
import { appMetadata } from '../config';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
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
              
              {/* Language Selector */}
              <select className="form-select text-sm py-1.5 px-3 min-w-0 w-auto">
                <option value="en">EN</option>
                <option value="ar">AR</option>
                <option value="fa">FA</option>
                <option value="so">SO</option>
                <option value="uk">UK</option>
              </select>

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
      <div className="lg:hidden bg-white border-b border-neutral-200">
        <div className="container-custom py-3">
          <div className="grid grid-cols-3 gap-2">
            <MobileNavItem href="/ai-triage" label="AI Assessment" />
            <MobileNavItem href="/visual-health" label="Visual Scan" />
            <MobileNavItem href="/multilingual" label="Translate" />
            <MobileNavItem href="/body-mapping" label="Body Map" />
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
              <h4 className="font-medium text-neutral-900 mb-3">Quick Access</h4>
              <div className="space-y-2 text-sm">
                <a href="/ai-triage" className="link block">AI Health Assessment</a>
                <a href="/visual-health" className="link block">Visual Health Analysis</a>
                <a href="/multilingual" className="link block">Translation Services</a>
                <a href="/mental-health" className="link block">Mental Health Support</a>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-neutral-900 mb-3">Emergency Support</h4>
              <div className="space-y-2 text-sm text-neutral-600">
                <p>24/7 AI-powered health assistance</p>
                <p>Multilingual crisis intervention</p>
                <p>Cultural sensitivity protocols</p>
                <div className="mt-4">
                  <button className="btn-danger btn-sm w-full">
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