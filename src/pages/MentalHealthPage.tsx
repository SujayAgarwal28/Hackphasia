import { useState } from 'react';
import MoodSelector from '../mental-health/MoodSelector';
import BreathingExercises from '../mental-health/BreathingExercises';
import AudioStories from '../mental-health/AudioStories';
import { MoodSelection } from '../types';

const MentalHealthPage = () => {
  const [currentMood, setCurrentMood] = useState<MoodSelection | undefined>();
  const [completedActivities, setCompletedActivities] = useState<{
    moods: MoodSelection[];
    exercises: { id: string; duration: number; timestamp: string }[];
    stories: { id: string; duration: number; timestamp: string }[];
  }>({
    moods: [],
    exercises: [],
    stories: []
  });

  const handleMoodSelect = (mood: MoodSelection) => {
    setCurrentMood(mood);
    setCompletedActivities(prev => ({
      ...prev,
      moods: [mood, ...prev.moods.slice(0, 4)] // Keep last 5 moods
    }));
  };

  const handleExerciseComplete = (exerciseId: string, duration: number) => {
    setCompletedActivities(prev => ({
      ...prev,
      exercises: [{
        id: exerciseId,
        duration,
        timestamp: new Date().toISOString()
      }, ...prev.exercises.slice(0, 9)] // Keep last 10 exercises
    }));
  };

  const handleStoryComplete = (storyId: string, duration: number) => {
    setCompletedActivities(prev => ({
      ...prev,
      stories: [{
        id: storyId,
        duration,
        timestamp: new Date().toISOString()
      }, ...prev.stories.slice(0, 9)] // Keep last 10 stories
    }));
  };

  const getTotalWellnessTime = () => {
    const exerciseTime = completedActivities.exercises.reduce((sum, ex) => sum + ex.duration, 0);
    const storyTime = completedActivities.stories.reduce((sum, story) => sum + story.duration, 0);
    return exerciseTime + storyTime;
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            💙 Mental Health Support
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Take care of your mental wellbeing with mood tracking, breathing exercises, 
            and healing stories designed specifically for those who have experienced trauma.
          </p>
        </div>

        {/* Wellness Summary */}
        {(completedActivities.moods.length > 0 || getTotalWellnessTime() > 0) && (
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg shadow-md p-6 mb-8 text-white">
            <h2 className="text-xl font-semibold mb-4">🌟 Your Wellness Journey</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{completedActivities.moods.length}</div>
                <div className="text-sm opacity-90">Mood Check-ins</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{completedActivities.exercises.length}</div>
                <div className="text-sm opacity-90">Breathing Sessions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{formatTime(getTotalWellnessTime())}</div>
                <div className="text-sm opacity-90">Wellness Time</div>
              </div>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Mood Selector */}
            <MoodSelector 
              onMoodSelect={handleMoodSelect}
              selectedMood={currentMood}
            />

            {/* Breathing Exercises */}
            <BreathingExercises onExerciseComplete={handleExerciseComplete} />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Audio Stories */}
            <AudioStories onStoryComplete={handleStoryComplete} />

            {/* Recent Activities */}
            {(completedActivities.exercises.length > 0 || completedActivities.stories.length > 0) && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  📊 Recent Activities
                </h3>
                
                <div className="space-y-4">
                  {completedActivities.exercises.slice(0, 3).map((exercise, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">
                        🫁 Breathing Exercise
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {formatTime(exercise.duration)} • {new Date(exercise.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                  
                  {completedActivities.stories.slice(0, 3).map((story, index) => (
                    <div key={index} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-300">
                        🎧 Healing Story
                      </span>
                      <span className="text-gray-500 dark:text-gray-400">
                        {formatTime(story.duration)} • {new Date(story.timestamp).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Crisis Support */}
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-3">
                🆘 Crisis Support
              </h3>
              <p className="text-red-700 dark:text-red-300 text-sm mb-4">
                If you're having thoughts of self-harm or are in immediate danger, please reach out for help:
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <span className="font-medium text-red-800 dark:text-red-200 mr-2">Emergency:</span>
                  <span className="text-red-700 dark:text-red-300">911 (US) • 112 (EU) • Local Emergency Number</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium text-red-800 dark:text-red-200 mr-2">Crisis Text Line:</span>
                  <span className="text-red-700 dark:text-red-300">Text HOME to 741741</span>
                </div>
                <div className="flex items-center">
                  <span className="font-medium text-red-800 dark:text-red-200 mr-2">Suicide Prevention:</span>
                  <span className="text-red-700 dark:text-red-300">988 (US) • Local Hotline</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Helpful Tips */}
        <div className="mt-8 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-3">
            💡 Mental Health Tips
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="text-green-700 dark:text-green-300">
              🌅 <strong>Daily routine:</strong> Try to maintain regular sleep and meal times
            </div>
            <div className="text-green-700 dark:text-green-300">
              🚶 <strong>Movement:</strong> Even a short walk can improve your mood
            </div>
            <div className="text-green-700 dark:text-green-300">
              🤝 <strong>Connection:</strong> Reach out to friends, family, or community groups
            </div>
            <div className="text-green-700 dark:text-green-300">
              📱 <strong>Limit news:</strong> Take breaks from overwhelming news cycles
            </div>
            <div className="text-green-700 dark:text-green-300">
              📝 <strong>Express yourself:</strong> Write, draw, or talk about your feelings
            </div>
            <div className="text-green-700 dark:text-green-300">
              🎯 <strong>Small goals:</strong> Focus on one day, one hour at a time
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentalHealthPage;