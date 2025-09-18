import React from 'react';
import { Link } from 'react-router-dom';
import { appMetadata } from '../config';

const HomePage: React.FC = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-6">
        <div className="space-y-4">
          <h1 className="text-4xl sm:text-5xl font-bold text-neutral-900 leading-tight">
            Advanced AI Healthcare
            <span className="text-gradient block">for Refugee Communities</span>
          </h1>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto leading-relaxed">
            Comprehensive health support platform combining artificial intelligence, 
            computer vision, and multilingual communication to provide accessible 
            healthcare guidance for displaced populations.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/ai-triage" className="btn-primary btn-lg">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Start AI Assessment
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <FeatureCard
          title="AI-Powered Triage"
          description="Advanced conversational AI provides personalized health assessments with cultural sensitivity and trauma-informed care protocols."
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          }
          link="/ai-triage"
          badge="AI-Powered"
          badgeColor="primary"
        />
        
        <FeatureCard
          title="Maps & Clinics"
          description="Find nearby clinics and healthcare facilities using real-time location services and interactive maps for immediate medical assistance"
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          }
          link="/map"
          badge="Local Navigation"
          badgeColor="success"
        />
        
        <FeatureCard
          title="Multilingual Support"
          description="Cultural-adaptive translation services with context-aware medical terminology and emergency phrase access in multiple languages."
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
            </svg>
          }
          link="/multilingual"
          badge="Multilingual"
          badgeColor="warning"
        />
        {/*
        <FeatureCard
          title="Interactive Body Mapping"
          description="Precise pain and symptom localization with AI-powered analysis to communicate health concerns effectively with healthcare providers."
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          }
          link="/body-mapping"
          badge="Interactive"
          badgeColor="neutral"
        />
        */}
        <FeatureCard
          title="Mental Health Support"
          description="Comprehensive mental wellness resources including guided breathing exercises, cultural stories, and crisis intervention protocols."
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          }
          link="/mental-health"
          badge="Wellness"
          badgeColor="primary"
        />
      </section>
    </div>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
  badge: string;
  badgeColor: 'primary' | 'success' | 'warning' | 'neutral';
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  title, description, icon, link, badge, badgeColor 
}) => {
  const badgeClasses = {
    primary: 'badge-primary',
    success: 'badge-success', 
    warning: 'badge-warning',
    neutral: 'badge-neutral'
  };

  return (
    <Link to={link} className="card hover:shadow-lg transition-all duration-300 animate-fade-in group">
      <div className="card-body space-y-4">
        <div className="flex items-start justify-between">
          <div className="text-blue-600 group-hover:text-blue-700 transition-colors">
            {icon}
          </div>
          <span className={`${badgeClasses[badgeColor]}`}>
            {badge}
          </span>
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-neutral-900 group-hover:text-blue-700 transition-colors">
            {title}
          </h3>
          <p className="text-neutral-700 leading-relaxed">
            {description}
          </p>
        </div>
        <div className="pt-2">
          <div className="inline-flex items-center text-blue-600 font-medium group-hover:text-blue-700 transition-colors">
            Learn more
            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HomePage;