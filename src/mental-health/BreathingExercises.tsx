import { useState, useEffect, useRef } from 'react';
import { BreathingExercise } from '../types';

interface BreathingExercisesProps {
  onExerciseComplete: (exerciseId: string, duration: number) => void;
}

const breathingExercises: BreathingExercise[] = [
  {
    id: 'box-breathing',
    name: '4-4-4-4 Box Breathing',
    duration: 240, // 4 minutes
    instructions: [
      'Inhale slowly for 4 counts',
      'Hold your breath for 4 counts', 
      'Exhale slowly for 4 counts',
      'Hold empty for 4 counts',
      'Repeat this cycle'
    ],
    language: 'en'
  },
  {
    id: 'calm-breathing',
    name: '4-7-8 Calming Breath',
    duration: 180, // 3 minutes
    instructions: [
      'Inhale through nose for 4 counts',
      'Hold your breath for 7 counts',
      'Exhale through mouth for 8 counts',
      'This helps activate relaxation response'
    ],
    language: 'en'
  },
  {
    id: 'grounding-breath',
    name: 'Grounding Breath',
    duration: 300, // 5 minutes
    instructions: [
      'Breathe naturally and slowly',
      'Focus on the sensation of air entering',
      'Notice your breath without changing it',
      'When mind wanders, gently return to breath',
      'Feel your connection to the present moment'
    ],
    language: 'en'
  }
];

type BreathingPhase = 'inhale' | 'hold-full' | 'exhale' | 'hold-empty';

const BreathingExercises = ({ onExerciseComplete }: BreathingExercisesProps) => {
  const [selectedExercise, setSelectedExercise] = useState<BreathingExercise | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<BreathingPhase>('inhale');
  const [phaseCount, setPhaseCount] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [cycles, setCycles] = useState(0);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const phaseIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const phaseConfig = {
    'box-breathing': {
      inhale: 4,
      'hold-full': 4,
      exhale: 4,
      'hold-empty': 4
    },
    'calm-breathing': {
      inhale: 4,
      'hold-full': 7,
      exhale: 8,
      'hold-empty': 0
    },
    'grounding-breath': {
      inhale: 4,
      'hold-full': 0,
      exhale: 6,
      'hold-empty': 0
    }
  };

  const phaseInstructions = {
    inhale: 'Breathe in slowly...',
    'hold-full': 'Hold your breath...',
    exhale: 'Breathe out slowly...',
    'hold-empty': 'Hold empty...'
  };

  useEffect(() => {
    if (isActive && selectedExercise) {
      intervalRef.current = setInterval(() => {
        setTotalTime(prev => prev + 1);
      }, 1000);

      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [isActive, selectedExercise]);

  useEffect(() => {
    if (isActive && selectedExercise) {
      const config = phaseConfig[selectedExercise.id as keyof typeof phaseConfig];
      const currentPhaseDuration = config[currentPhase];
      
      if (currentPhaseDuration > 0) {
        phaseIntervalRef.current = setInterval(() => {
          setPhaseCount(prev => {
            if (prev >= currentPhaseDuration - 1) {
              // Move to next phase
              const phases: BreathingPhase[] = ['inhale', 'hold-full', 'exhale', 'hold-empty'];
              const currentIndex = phases.indexOf(currentPhase);
              const nextIndex = (currentIndex + 1) % phases.length;
              
              if (nextIndex === 0) {
                setCycles(prev => prev + 1);
              }
              
              setCurrentPhase(phases[nextIndex]);
              return 0;
            }
            return prev + 1;
          });
        }, 1000);
      } else {
        // Skip phases with 0 duration
        const phases: BreathingPhase[] = ['inhale', 'hold-full', 'exhale', 'hold-empty'];
        const currentIndex = phases.indexOf(currentPhase);
        const nextIndex = (currentIndex + 1) % phases.length;
        setCurrentPhase(phases[nextIndex]);
        setPhaseCount(0);
      }

      return () => {
        if (phaseIntervalRef.current) clearInterval(phaseIntervalRef.current);
      };
    }
  }, [currentPhase, isActive, selectedExercise]);

  const startExercise = (exercise: BreathingExercise) => {
    setSelectedExercise(exercise);
    setIsActive(true);
    setCurrentPhase('inhale');
    setPhaseCount(0);
    setTotalTime(0);
    setCycles(0);
  };

  const stopExercise = () => {
    setIsActive(false);
    if (selectedExercise) {
      onExerciseComplete(selectedExercise.id, totalTime);
    }
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (phaseIntervalRef.current) clearInterval(phaseIntervalRef.current);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getBreathingCircleSize = () => {
    if (!selectedExercise || !isActive) return 'w-32 h-32';
    
    const config = phaseConfig[selectedExercise.id as keyof typeof phaseConfig];
    const currentPhaseDuration = config[currentPhase];
    const progress = currentPhaseDuration > 0 ? phaseCount / currentPhaseDuration : 0;
    
    if (currentPhase === 'inhale') {
      return progress < 0.5 ? 'w-32 h-32' : 'w-40 h-40';
    } else if (currentPhase === 'exhale') {
      return progress < 0.5 ? 'w-40 h-40' : 'w-32 h-32';
    }
    return 'w-40 h-40';
  };

  if (selectedExercise && isActive) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
            {selectedExercise.name}
          </h3>
          
          <div className="flex flex-col items-center space-y-8">
            {/* Breathing Circle */}
            <div className="relative">
              <div className={`${getBreathingCircleSize()} rounded-full bg-gradient-to-r from-blue-400 to-purple-500 transition-all duration-1000 ease-in-out flex items-center justify-center`}>
                <div className="text-white font-medium text-lg">
                  {phaseInstructions[currentPhase]}
                </div>
              </div>
            </div>

            {/* Phase Counter */}
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {phaseConfig[selectedExercise.id as keyof typeof phaseConfig][currentPhase] - phaseCount}
              </div>
              <div className="text-gray-600 dark:text-gray-400">
                {phaseInstructions[currentPhase]}
              </div>
            </div>

            {/* Stats */}
            <div className="flex space-x-8 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">{cycles}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Cycles</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">{formatTime(totalTime)}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Time</div>
              </div>
            </div>

            {/* Controls */}
            <div className="flex space-x-4">
              <button
                onClick={stopExercise}
                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
              >
                Stop Exercise
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          🫁 Breathing Exercises
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Guided breathing exercises to help you relax and find calm
        </p>
      </div>

      <div className="space-y-4">
        {breathingExercises.map((exercise) => (
          <div
            key={exercise.id}
            className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="flex justify-between items-start mb-3">
              <h4 className="font-medium text-gray-900 dark:text-white">
                {exercise.name}
              </h4>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {Math.floor(exercise.duration / 60)} min
              </span>
            </div>
            
            <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              <ul className="space-y-1">
                {exercise.instructions.map((instruction, index) => (
                  <li key={index}>• {instruction}</li>
                ))}
              </ul>
            </div>
            
            <button
              onClick={() => startExercise(exercise)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Start Exercise
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
        <p className="text-green-800 dark:text-green-200 text-sm text-center">
          💡 Tip: Find a quiet space and practice these exercises regularly for best results.
        </p>
      </div>
    </div>
  );
};

export default BreathingExercises;