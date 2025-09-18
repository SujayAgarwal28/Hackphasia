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
          AI-powered health support, computer vision analysis, and intelligent triage for refugees
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        <FeatureCard
          title="AI Health Triage"
          description="GPT-4 powered medical conversations with refugee-specific expertise"
          icon="🤖"
          link="/ai-triage"
          color="bg-purple-500"
        />
        
        <FeatureCard
          title="Visual Health AI"
          description="Computer vision for skin conditions, wounds, and health assessment"
          icon="👁️"
          link="/visual-health"
          color="bg-blue-500"
        />
        
        <FeatureCard
          title="Voice Assessment"
          description="Traditional voice-enabled symptom checker with multilingual support"
          icon="🎤"
          link="/triage"
          color="bg-green-500"
        />
        
        <FeatureCard
          title="Body Mapping"
          description="Interactive pain visualization with AI-powered analysis"
          icon="👤"
          link="/body-mapping"
          color="bg-orange-500"
        />
        
        <FeatureCard
          title="Mental Health"
          description="AI-guided mental wellness with cultural sensitivity"
          icon="💙"
          link="/mental-health"
          color="bg-indigo-500"
        />
        
        <FeatureCard
          title="Find Clinics"
          description="Interactive map with safe route navigation"
          icon="🗺️"
          link="/map"
          color="bg-red-500"
        />
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
          🚀 AI-Powered Health Platform
        </h2>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Experience cutting-edge AI technology designed specifically for refugee healthcare needs
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            to="/ai-triage"
            className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-medium rounded-lg transition-colors"
          >
            <span className="mr-2">🤖</span>
            Start AI Conversation
          </Link>
          <Link
            to="/visual-health"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <span className="mr-2">👁️</span>
            Analyze Photo
          </Link>
        </div>
      </div>

      <div className="bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg shadow-md p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">🏆 Hackathon-Grade AI Features</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">💬 Conversational AI</h3>
            <ul className="space-y-1 text-sm opacity-90">
              <li>• GPT-4 powered medical consultations</li>
              <li>• Refugee-specific cultural sensitivity</li>
              <li>• Adaptive questioning algorithms</li>
              <li>• Multi-turn conversation memory</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">👁️ Computer Vision</h3>
            <ul className="space-y-1 text-sm opacity-90">
              <li>• TensorFlow.js medical image analysis</li>
              <li>• Real-time skin condition detection</li>
              <li>• Wound assessment & healing stages</li>
              <li>• Malnutrition visual indicators</li>
            </ul>
          </div>
        </div>
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