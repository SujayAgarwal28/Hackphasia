import { useState } from 'react';
import { MoodSelection } from '../types';

interface MoodSelectorProps {
  onMoodSelect: (mood: MoodSelection) => void;
  selectedMood?: MoodSelection;
}

const moods = [
  { 
    id: 'anxious', 
    name: 'Anxious', 
    emoji: '😰', 
    color: 'bg-yellow-500',
    description: 'Feeling worried or nervous'
  },
  { 
    id: 'sad', 
    name: 'Sad', 
    emoji: '😢', 
    color: 'bg-blue-500',
    description: 'Feeling down or tearful'
  },
  { 
    id: 'angry', 
    name: 'Angry', 
    emoji: '😡', 
    color: 'bg-red-500',
    description: 'Feeling frustrated or mad'
  },
  { 
    id: 'confused', 
    name: 'Confused', 
    emoji: '😕', 
    color: 'bg-gray-500',
    description: 'Feeling lost or uncertain'
  },
  { 
    id: 'hopeful', 
    name: 'Hopeful', 
    emoji: '🌟', 
    color: 'bg-green-500',
    description: 'Feeling optimistic about the future'
  },
  { 
    id: 'grateful', 
    name: 'Grateful', 
    emoji: '🙏', 
    color: 'bg-purple-500',
    description: 'Feeling thankful and appreciative'
  }
] as const;

const intensityLabels = [
  'Very mild',
  'Mild', 
  'Moderate',
  'Strong',
  'Very strong'
];

const MoodSelector = ({ onMoodSelect, selectedMood }: MoodSelectorProps) => {
  const [selectedMoodId, setSelectedMoodId] = useState<string>(selectedMood?.mood || '');
  const [intensity, setIntensity] = useState<number>(selectedMood?.intensity || 3);

  const handleMoodClick = (moodId: string) => {
    setSelectedMoodId(moodId);
    
    const newMoodSelection: MoodSelection = {
      mood: moodId as MoodSelection['mood'],
      intensity: intensity as MoodSelection['intensity'],
      selectedAt: new Date().toISOString()
    };
    
    onMoodSelect(newMoodSelection);
  };

  const handleIntensityChange = (newIntensity: number) => {
    setIntensity(newIntensity);
    
    if (selectedMoodId) {
      const newMoodSelection: MoodSelection = {
        mood: selectedMoodId as MoodSelection['mood'],
        intensity: newIntensity as MoodSelection['intensity'],
        selectedAt: new Date().toISOString()
      };
      
      onMoodSelect(newMoodSelection);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          💭 How are you feeling right now?
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          It's okay to feel whatever you're feeling. We're here to support you.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {moods.map((mood) => (
          <button
            key={mood.id}
            onClick={() => handleMoodClick(mood.id)}
            className={`p-4 rounded-lg border-2 transition-all duration-200 ${
              selectedMoodId === mood.id
                ? `${mood.color} border-opacity-100 text-white`
                : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
            }`}
          >
            <div className="text-center">
              <div className="text-3xl mb-2">{mood.emoji}</div>
              <div className={`font-medium ${
                selectedMoodId === mood.id 
                  ? 'text-white' 
                  : 'text-gray-900 dark:text-white'
              }`}>
                {mood.name}
              </div>
              <div className={`text-sm mt-1 ${
                selectedMoodId === mood.id 
                  ? 'text-white opacity-90' 
                  : 'text-gray-600 dark:text-gray-400'
              }`}>
                {mood.description}
              </div>
            </div>
          </button>
        ))}
      </div>

      {selectedMoodId && (
        <div className="border-t border-gray-200 dark:border-gray-600 pt-6">
          <h4 className="font-medium text-gray-900 dark:text-white mb-4 text-center">
            How intense is this feeling?
          </h4>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">Mild</span>
              <input
                type="range"
                min="1"
                max="5"
                value={intensity}
                onChange={(e) => handleIntensityChange(Number(e.target.value))}
                className="flex-1 mx-4 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">Intense</span>
            </div>
            
            <div className="text-center">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {intensityLabels[intensity - 1]}
              </span>
              <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Level {intensity} of 5
              </div>
            </div>
          </div>
        </div>
      )}

      {selectedMoodId && (
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <p className="text-blue-800 dark:text-blue-200 text-sm text-center">
            Thank you for sharing. Your feelings are valid and we have resources to help you feel better.
          </p>
        </div>
      )}
    </div>
  );
};

export default MoodSelector;