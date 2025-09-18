import { useState, useEffect, useCallback } from 'react';
import { VoiceInput } from '../types';

interface VoiceInputComponentProps {
  onTranscript: (input: VoiceInput) => void;
  language?: string;
  isListening?: boolean;
  onListeningChange?: (isListening: boolean) => void;
}

const VoiceInputComponent = ({
  onTranscript,
  language = 'en-US',
  isListening = false,
  onListeningChange
}: VoiceInputComponentProps) => {
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recognition, setRecognition] = useState<any>(null);

  // Check browser support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    setIsSupported(!!SpeechRecognition);
    
    if (SpeechRecognition) {
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = language;
      recognitionInstance.maxAlternatives = 1;
      
      setRecognition(recognitionInstance);
    }
  }, [language]);

  const startListening = useCallback(() => {
    if (!recognition || !isSupported) {
      setError('Speech recognition is not supported in this browser');
      return;
    }

    setError(null);
    setTranscript('');
    setInterimTranscript('');
    
    recognition.onstart = () => {
      onListeningChange?.(true);
    };

    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript;
        } else {
          interim += result[0].transcript;
        }
      }

      if (finalTranscript) {
        setTranscript(finalTranscript);
        
        // Call the callback with voice input data
        const voiceInput: VoiceInput = {
          transcript: finalTranscript,
          confidence: event.results[event.results.length - 1][0].confidence || 0.8,
          language,
          keywords: [] // Will be processed by the parent component
        };
        
        onTranscript(voiceInput);
      }
      
      setInterimTranscript(interim);
    };

    recognition.onerror = (event: any) => {
      setError(`Speech recognition error: ${event.error}`);
      onListeningChange?.(false);
    };

    recognition.onend = () => {
      onListeningChange?.(false);
    };

    try {
      recognition.start();
    } catch (err) {
      setError('Failed to start speech recognition');
      onListeningChange?.(false);
    }
  }, [recognition, isSupported, onTranscript, language, onListeningChange]);

  const stopListening = useCallback(() => {
    if (recognition) {
      recognition.stop();
    }
    onListeningChange?.(false);
  }, [recognition, onListeningChange]);

  useEffect(() => {
    if (isListening && !recognition?.started) {
      startListening();
    } else if (!isListening && recognition?.started) {
      stopListening();
    }
  }, [isListening, startListening, stopListening, recognition]);

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <div className="flex items-center">
          <span className="text-yellow-600 dark:text-yellow-400 mr-2">⚠️</span>
          <p className="text-yellow-800 dark:text-yellow-200">
            Voice input is not supported in this browser. Please use a modern browser like Chrome or Firefox.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          🎤 Voice Health Assessment
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Describe your symptoms and I'll help assess your health condition
        </p>
      </div>

      <div className="flex flex-col items-center space-y-4">
        <button
          onClick={isListening ? stopListening : startListening}
          disabled={!isSupported}
          className={`
            w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold
            transition-all duration-200 transform
            ${isListening 
              ? 'bg-red-500 hover:bg-red-600 scale-110 animate-pulse' 
              : 'bg-blue-500 hover:bg-blue-600 hover:scale-105'
            }
            ${!isSupported ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
            shadow-lg
          `}
        >
          {isListening ? '⏹️' : '🎤'}
        </button>

        <p className="text-sm text-gray-600 dark:text-gray-400">
          {isListening ? 'Listening... Click to stop' : 'Click to start speaking'}
        </p>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-3 w-full">
            <p className="text-red-800 dark:text-red-200 text-sm">
              {error}
            </p>
          </div>
        )}

        {(transcript || interimTranscript) && (
          <div className="w-full">
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                What you said:
              </h4>
              <p className="text-gray-900 dark:text-white">
                {transcript}
                <span className="text-gray-500 italic">{interimTranscript}</span>
              </p>
            </div>
          </div>
        )}

        <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
          <p>Examples: "I have a headache and fever" or "My chest hurts and I'm short of breath"</p>
        </div>
      </div>
    </div>
  );
};

// Global type declarations for speech recognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default VoiceInputComponent;