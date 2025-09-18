import React from 'react';

const TriagePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Health Assessment
      </h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <p className="text-gray-600 dark:text-gray-300">
          Voice-enabled health assessment and symptom checker module will be implemented here.
          This will include the "Draw Your Pain" feature and rule-based triage engine.
        </p>
      </div>
    </div>
  );
};

export default TriagePage;