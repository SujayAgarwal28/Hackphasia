import React from 'react';
import { Link } from 'react-router-dom';
import { appMetadata } from '../config';

const HomePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Welcome to {appMetadata.name}
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          Voice-enabled health support, clinic navigation, and first aid guidance for refugees
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <FeatureCard
          title="Health Assessment"
          description="Voice-enabled symptom checker with multilingual support"
          icon="🩺"
          link="/triage"
          color="bg-blue-500"
        />
        
        <FeatureCard
          title="Find Clinics"
          description="Interactive map with safe route navigation"
          icon="🗺️"
          link="/map"
          color="bg-green-500"
        />
        
        <FeatureCard
          title="First Aid"
          description="Offline-ready guides with voice narration"
          icon="🚑"
          link="/first-aid"
          color="bg-red-500"
        />
        
        <FeatureCard
          title="Mental Health"
          description="Audio stories and breathing exercises"
          icon="💙"
          link="/mental-health"
          color="bg-purple-500"
        />
        
        <FeatureCard
          title="Draw Your Pain"
          description="Interactive body mapping for pain visualization"
          icon="👤"
          link="/body-mapping"
          color="bg-orange-500"
        />
        
        <FeatureCard
          title="Safe Routes"
          description="Navigation avoiding unsafe areas"
          icon="🛡️"
          link="/map?safe-route=true"
          color="bg-indigo-500"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          Quick Start
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Get immediate help by starting a voice-enabled health assessment
        </p>
        <Link
          to="/triage"
          className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg transition-colors"
        >
          <span className="mr-2">🎤</span>
          Start Health Check
        </Link>
      </div>
    </div>
  );
};

interface FeatureCardProps {
  title: string;
  description: string;
  icon: string;
  link: string;
  color: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, link, color }) => {
  return (
    <Link
      to={link}
      className="block bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6"
    >
      <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mb-4`}>
        <span className="text-2xl">{icon}</span>
      </div>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm">
        {description}
      </p>
    </Link>
  );
};

export default HomePage;