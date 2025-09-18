import React, { useState, useEffect } from 'react';
import { multilingualAI, LanguageSupport, ConversationalAI } from '../ai/MultilingualAIService';

const MultilingualInterface: React.FC = () => {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en');
  const [conversationSession, setConversationSession] = useState<ConversationalAI | null>(null);
  const [userMessage, setUserMessage] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [supportedLanguages, setSupportedLanguages] = useState<LanguageSupport[]>([]);

  useEffect(() => {
    setSupportedLanguages(multilingualAI.getSupportedLanguages());
  }, []);

  const startConversationSession = async (languageCode: string) => {
    try {
      const session = await multilingualAI.createConversationalSession(languageCode);
      setConversationSession(session);
      setSelectedLanguage(languageCode);
    } catch (error) {
      console.error('Failed to start conversation session:', error);
    }
  };

  const handleSendMessage = async () => {
    if (!conversationSession || !userMessage.trim()) return;

    setIsTranslating(true);
    try {
      const result = await multilingualAI.processMultilingualConversation(
        conversationSession,
        userMessage
      );

      setConversationSession(result.updatedSession);
      setUserMessage('');
    } catch (error) {
      console.error('Conversation processing error:', error);
    } finally {
      setIsTranslating(false);
    }
  };

  const selectedLanguageInfo = supportedLanguages.find(lang => lang.code === selectedLanguage);

  const quickTranslatePhrases = [
    'I need medical help',
    'Where is the nearest hospital?',
    'I have pain here',
    'Can you help me?',
    'I don\'t speak the local language',
    'Emergency, please help',
    'I need a doctor',
    'I have a fever'
  ];

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          🌍 Multilingual AI Assistant
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Real-time translation with cultural sensitivity for refugee healthcare communication
        </p>
      </div>

      {/* Language Selection */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
            🗣️ Select Your Language
          </h3>
          <div className="space-y-2">
            {supportedLanguages.map((language) => (
              <button
                key={language.code}
                onClick={() => startConversationSession(language.code)}
                className={`w-full text-left p-3 rounded-lg transition-colors ${
                  selectedLanguage === language.code
                    ? 'bg-blue-100 dark:bg-blue-900 border-2 border-blue-500'
                    : 'bg-white dark:bg-gray-600 hover:bg-gray-100 dark:hover:bg-gray-500 border border-gray-200 dark:border-gray-500'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {language.name}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-300">
                      {language.nativeName}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {language.prevalentRefugeePopulations.join(', ')}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Cultural Context Information */}
        {selectedLanguageInfo && (
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900 dark:to-blue-900 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              🏛️ Cultural Context
            </h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-200">Communication Style:</span>
                <span className="ml-2 text-gray-600 dark:text-gray-300">
                  {selectedLanguageInfo.culturalContext.communicationStyle}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-200">Family Involvement:</span>
                <span className="ml-2 text-gray-600 dark:text-gray-300">
                  {selectedLanguageInfo.culturalContext.familyInvolvement}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700 dark:text-gray-200">Health Beliefs:</span>
                <ul className="ml-4 mt-1 list-disc text-gray-600 dark:text-gray-300">
                  {selectedLanguageInfo.culturalContext.healthBeliefs.map((belief, index) => (
                    <li key={index}>{belief}</li>
                  ))}
                </ul>
              </div>
              {selectedLanguageInfo.culturalContext.religiousConsiderations.length > 0 && (
                <div>
                  <span className="font-medium text-gray-700 dark:text-gray-200">Religious Considerations:</span>
                  <ul className="ml-4 mt-1 list-disc text-gray-600 dark:text-gray-300">
                    {selectedLanguageInfo.culturalContext.religiousConsiderations.map((consideration, index) => (
                      <li key={index}>{consideration}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Quick Translation Phrases */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          ⚡ Quick Emergency Phrases
        </h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickTranslatePhrases.map((phrase, index) => (
            <button
              key={index}
              onClick={() => setUserMessage(phrase)}
              className="p-3 text-left bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 border border-red-200 dark:border-red-800 rounded-lg transition-colors"
            >
              <div className="text-sm font-medium text-red-800 dark:text-red-200">
                {phrase}
              </div>
              {selectedLanguageInfo && selectedLanguageInfo.emergencyPhrases[phrase] && (
                <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                  {selectedLanguageInfo.emergencyPhrases[phrase]}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation Interface */}
      {conversationSession && (
        <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            💬 AI Conversation ({selectedLanguageInfo?.nativeName})
          </h3>
          
          {/* Conversation History */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 h-64 overflow-y-auto mb-4">
            {conversationSession.conversationHistory.length === 0 ? (
              <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                <div className="text-2xl mb-2">👋</div>
                <p>Start a conversation in your preferred language</p>
                <p className="text-xs mt-1">AI responses will be culturally adapted and translated</p>
              </div>
            ) : (
              <div className="space-y-4">
                {conversationSession.conversationHistory.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white'
                      }`}
                    >
                      <div className="text-sm">{message.message}</div>
                      {message.translation && message.translation !== message.message && (
                        <div className="text-xs opacity-75 mt-1 italic">
                          Translation: {message.translation}
                        </div>
                      )}
                      {message.culturalContext && (
                        <div className="text-xs opacity-75 mt-1 border-t border-gray-300 dark:border-gray-500 pt-1">
                          Cultural notes: {message.culturalContext}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder={`Type your message in ${selectedLanguageInfo?.name || 'your language'}...`}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              disabled={isTranslating}
            />
            <button
              onClick={() => setIsRecording(!isRecording)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200'
              }`}
            >
              {isRecording ? '🛑' : '🎤'}
            </button>
            <button
              onClick={handleSendMessage}
              disabled={!userMessage.trim() || isTranslating}
              className="px-6 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
            >
              {isTranslating ? '⏳' : '📤'}
            </button>
          </div>
        </div>
      )}

      {/* AI Features Showcase */}
      <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-4">🤖 Advanced AI Translation Features</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl mb-2">🧠</div>
            <h4 className="font-semibold mb-1">Cultural AI</h4>
            <p className="text-sm opacity-90">
              Adapts communication style based on cultural background and preferences
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🗣️</div>
            <h4 className="font-semibold mb-1">Voice Integration</h4>
            <p className="text-sm opacity-90">
              Speech-to-text and text-to-speech in native languages with proper pronunciation
            </p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">⚡</div>
            <h4 className="font-semibold mb-1">Real-time Translation</h4>
            <p className="text-sm opacity-90">
              Instant, context-aware translation optimized for medical communication
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultilingualInterface;