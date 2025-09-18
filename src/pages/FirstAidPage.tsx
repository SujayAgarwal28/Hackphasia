import React from 'react';

const FirstAidPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        First Aid Guides
      </h1>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <p className="text-gray-600 dark:text-gray-300">
          Offline-ready first aid guides with voice narration will be implemented here.
        </p>
      </div>
    </div>
  );
};

export default FirstAidPage;