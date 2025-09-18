import { useState, useRef, useEffect } from 'react';
import { Story } from '../types';

interface AudioStoriesProps {
  onStoryComplete: (storyId: string, duration: number) => void;
}

// Mock stories for demo - in production these would come from Firebase
const healingStories: Story[] = [
  {
    id: 'journey-of-hope',
    language: 'en',
    title: 'A Journey of Hope',
    audioUrl: '/audio/hope-story.mp3', // Would be real audio files
    transcript: 'Sometimes the journey feels impossible, but every step forward is a victory...',
    duration: 180,
    category: 'hope',
    tags: ['resilience', 'hope', 'journey']
  },
  {
    id: 'finding-strength',
    language: 'en', 
    title: 'Finding Strength Within',
    audioUrl: '/audio/strength-story.mp3',
    transcript: 'You are stronger than you know. Your courage brought you this far...',
    duration: 240,
    category: 'resilience',
    tags: ['strength', 'courage', 'inner-power']
  },
  {
    id: 'community-support',
    language: 'en',
    title: 'We Are Not Alone',
    audioUrl: '/audio/community-story.mp3', 
    transcript: 'In times of difficulty, we find strength in each other...',
    duration: 200,
    category: 'community',
    tags: ['community', 'support', 'together']
  },
  {
    id: 'healing-waters',
    language: 'en',
    title: 'Like Waters Finding Peace',
    audioUrl: '/audio/healing-story.mp3',
    transcript: 'Healing flows like water - sometimes rushing, sometimes gentle, always moving forward...',
    duration: 300,
    category: 'healing',
    tags: ['healing', 'peace', 'growth']
  }
];

const categoryEmojis = {
  survival: '🛡️',
  hope: '🌟',
  resilience: '💪',
  community: '🤝',
  healing: '🌊'
};

const AudioStories = ({ onStoryComplete }: AudioStoriesProps) => {
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showTranscript, setShowTranscript] = useState(false);
  
  // Simulate audio functionality since we don't have real audio files
  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (simulationIntervalRef.current) {
        clearInterval(simulationIntervalRef.current);
      }
    };
  }, []);

  const playStory = (story: Story) => {
    setSelectedStory(story);
    setIsPlaying(true);
    setDuration(story.duration || 0);
    setCurrentTime(0);

    // Simulate audio playback for demo
    simulationIntervalRef.current = setInterval(() => {
      setCurrentTime(prev => {
        const newProgress = prev + 1;
        
        if (newProgress >= (story.duration || 0)) {
          stopStory();
          onStoryComplete(story.id, newProgress);
          return 0;
        }
        return newProgress;
      });
    }, 1000);
  };

  const pauseStory = () => {
    setIsPlaying(false);
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
    }
  };

  const resumeStory = () => {
    if (selectedStory) {
      setIsPlaying(true);
      simulationIntervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          const newProgress = prev + 1;
          
          if (newProgress >= (selectedStory.duration || 0)) {
            stopStory();
            onStoryComplete(selectedStory.id, newProgress);
            return 0;
          }
          return newProgress;
        });
      }, 1000);
    }
  };

  const stopStory = () => {
    setIsPlaying(false);
    setSelectedStory(null);
    setCurrentTime(0);
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    if (!selectedStory || !duration) return 0;
    return (currentTime / duration) * 100;
  };

  if (selectedStory) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <div className="text-center mb-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {categoryEmojis[selectedStory.category]} {selectedStory.title}
          </h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm">
            {selectedStory.category} • {formatTime(selectedStory.duration || 0)}
          </p>
        </div>

        {/* Audio Player */}
        <div className="space-y-6">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-1000"
                style={{ width: `${getProgressPercentage()}%` }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex justify-center space-x-4">
            <button
              onClick={stopStory}
              className="p-3 bg-gray-600 hover:bg-gray-700 text-white rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <rect x="6" y="6" width="12" height="12" />
              </svg>
            </button>
            
            <button
              onClick={isPlaying ? pauseStory : resumeStory}
              className="p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
            >
              {isPlaying ? (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <rect x="6" y="4" width="4" height="16" />
                  <rect x="14" y="4" width="4" height="16" />
                </svg>
              ) : (
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
              )}
            </button>

            <button
              onClick={() => setShowTranscript(!showTranscript)}
              className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4 6h16v2H4zm0 5h16v2H4zm0 5h16v2H4z"/>
              </svg>
            </button>
          </div>

          {/* Transcript */}
          {showTranscript && selectedStory.transcript && (
            <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h4 className="font-medium text-gray-900 dark:text-white mb-2">Transcript:</h4>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">
                {selectedStory.transcript}
              </p>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap gap-2 justify-center">
            {selectedStory.tags?.map(tag => (
              <span 
                key={tag}
                className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          🎧 Healing Stories
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Listen to stories of hope, resilience, and healing from our community
        </p>
      </div>

      <div className="space-y-4">
        {healingStories.map((story) => (
          <div
            key={story.id}
            className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="font-medium text-gray-900 dark:text-white flex items-center">
                  {categoryEmojis[story.category]} {story.title}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {story.category} • {formatTime(story.duration || 0)}
                </p>
              </div>
            </div>
            
            {story.transcript && (
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                {story.transcript.substring(0, 100)}...
              </p>
            )}
            
            <div className="flex justify-between items-center">
              <div className="flex flex-wrap gap-1">
                {story.tags?.slice(0, 2).map(tag => (
                  <span 
                    key={tag}
                    className="px-2 py-1 bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              
              <button
                onClick={() => playStory(story)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center"
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <polygon points="5,3 19,12 5,21" />
                </svg>
                Play
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <p className="text-green-800 dark:text-green-200 text-sm text-center">
          💚 These stories are created by and for our community. You are not alone in your journey.
        </p>
      </div>
    </div>
  );
};

export default AudioStories;