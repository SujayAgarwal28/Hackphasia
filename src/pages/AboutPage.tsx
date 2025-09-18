import React from 'react';
import { appMetadata } from '../config';

const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        About {appMetadata.name}
      </h1>
      
      <div className="space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Our Mission
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            We built this voice-first, multilingual health assistant specifically for refugees, 
            providing trauma-informed care through innovative features like "Draw Your Pain", 
            safe route navigation, and offline-ready first aid guides.
          </p>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Key Features
          </h2>
          <ul className="space-y-2 text-gray-600 dark:text-gray-300">
            <li>• Voice-enabled symptom assessment in multiple languages</li>
            <li>• Interactive body mapping for pain visualization</li>
            <li>• Safe route navigation avoiding unsafe zones</li>
            <li>• Offline-first first aid guides with voice narration</li>
            <li>• Mental health support with audio stories</li>
            <li>• Printable triage summaries</li>
          </ul>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Team & SDGs
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Built with ❤️ for Hackphasia 2025, supporting UN Sustainable Development Goals:
          </p>
          <div className="flex space-x-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center mb-2">
                <span className="text-2xl">🏥</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">SDG 3: Good Health</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center mb-2">
                <span className="text-2xl">🤝</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">SDG 10: Reduced Inequalities</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-lg flex items-center justify-center mb-2">
                <span className="text-2xl">🌍</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300">SDG 16: Peace & Justice</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;