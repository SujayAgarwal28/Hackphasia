import React, { useState } from 'react';
import { mockFirstAidGuides } from '../data/mockFirstAid';
import { FirstAidGuide } from '../types';

const FirstAidPage: React.FC = () => {
  const [selectedGuide, setSelectedGuide] = useState<FirstAidGuide | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredGuides = mockFirstAidGuides.filter(guide =>
    guide.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
    guide.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'bleeding': return '🩸';
      case 'breathing': return '💨';
      case 'burns': return '🔥';
      case 'shock': return '⚡';
      case 'fractures': return '🦴';
      default: return '🏥';
    }
  };

  if (selectedGuide) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <button
            onClick={() => setSelectedGuide(null)}
            className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
          >
            <span className="mr-2">←</span>
            Back to First Aid Guides
          </button>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <span className="text-4xl mr-3">{getCategoryIcon(selectedGuide.category)}</span>
                {selectedGuide.topic}
              </h1>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getUrgencyColor(selectedGuide.urgency)}`}>
                {selectedGuide.urgency.toUpperCase()}
              </span>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Step-by-Step Instructions:
              </h2>
              <ol className="space-y-3">
                {selectedGuide.steps.map((step, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-4">
                      {index + 1}
                    </span>
                    <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                      {step}
                    </p>
                  </li>
                ))}
              </ol>
            </div>

            <div className="flex flex-wrap gap-4">
              <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
                <span className="mr-2">🔊</span>
                Read Aloud
              </button>
              <button className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors">
                <span className="mr-2">📱</span>
                Call Emergency
              </button>
              <button className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                <span className="mr-2">💾</span>
                Save for Offline
              </button>
            </div>

            {selectedGuide.urgency === 'emergency' && (
              <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-red-800 dark:text-red-200 font-semibold">
                  ⚠️ EMERGENCY: This is a life-threatening situation. Call emergency services immediately while providing first aid.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          🚑 First Aid Guides
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Offline-ready first aid guides for emergency situations. Tap any guide for step-by-step instructions.
        </p>

        <div className="relative">
          <input
            type="text"
            placeholder="Search first aid guides..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-10 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute left-3 top-3.5 text-gray-400">🔍</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {filteredGuides.map((guide) => (
          <div
            key={guide.id}
            onClick={() => setSelectedGuide(guide)}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center">
                <span className="text-3xl mr-3">{getCategoryIcon(guide.category)}</span>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {guide.topic}
                </h3>
              </div>
              <span className={`px-2 py-1 rounded text-xs font-medium ${getUrgencyColor(guide.urgency)}`}>
                {guide.urgency}
              </span>
            </div>

            <p className="text-gray-600 dark:text-gray-300 mb-4">
              {guide.steps.length} steps • {guide.category.charAt(0).toUpperCase() + guide.category.slice(1)}
            </p>

            <div className="flex items-center text-blue-600 hover:text-blue-800">
              <span className="mr-2">View Instructions</span>
              <span>→</span>
            </div>
          </div>
        ))}
      </div>

      {filteredGuides.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 text-lg">
            No first aid guides found matching "{searchTerm}"
          </p>
        </div>
      )}

      <div className="mt-12 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
          ⚠️ Important Disclaimer
        </h2>
        <p className="text-yellow-700 dark:text-yellow-300">
          These guides are for informational purposes only and should not replace professional medical training. 
          In any emergency, call your local emergency number immediately.
        </p>
      </div>
    </div>
  );
};

export default FirstAidPage;