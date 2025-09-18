import { useState } from 'react';
import MultilingualInterface from '../components/MultilingualInterface';

const MultilingualPage = () => {
  const [activeDemo, setActiveDemo] = useState<'conversation' | 'translation' | 'cultural'>('conversation');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🌍 Advanced Multilingual AI
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Cutting-edge AI translation with cultural sensitivity, real-time conversation, 
            and refugee-specific language support for healthcare communication.
          </p>
        </div>

        {/* Demo Selection */}
        <div className="flex justify-center mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-1 shadow-md">
            <button
              onClick={() => setActiveDemo('conversation')}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeDemo === 'conversation'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              💬 AI Conversation
            </button>
            <button
              onClick={() => setActiveDemo('translation')}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeDemo === 'translation'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              🔄 Translation
            </button>
            <button
              onClick={() => setActiveDemo('cultural')}
              className={`px-6 py-2 rounded-md transition-colors ${
                activeDemo === 'cultural'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
            >
              🏛️ Cultural AI
            </button>
          </div>
        </div>

        {/* Main Interface */}
        {activeDemo === 'conversation' && <MultilingualInterface />}
        
        {activeDemo === 'translation' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              ⚡ Real-time Medical Translation
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  🎯 Translation Features
                </h3>
                <div className="space-y-4">
                  <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-green-800 dark:text-green-200 mb-2">
                      🧠 Context-Aware Translation
                    </h4>
                    <p className="text-sm text-green-700 dark:text-green-300">
                      Medical terminology translation with refugee-specific health context and emergency phrase prioritization.
                    </p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                      🗣️ Voice Integration
                    </h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Speech-to-text recognition in native languages with text-to-speech output for proper pronunciation guidance.
                    </p>
                  </div>
                  <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                    <h4 className="font-medium text-purple-800 dark:text-purple-200 mb-2">
                      🔄 Bidirectional Translation
                    </h4>
                    <p className="text-sm text-purple-700 dark:text-purple-300">
                      Seamless translation between refugee languages and local healthcare provider languages with confidence scoring.
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  📊 Language Coverage
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="font-medium">Arabic (العربية)</span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Syria, Iraq, Yemen</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="font-medium">Persian (فارسی)</span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Afghanistan, Iran</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="font-medium">Somali (Soomaali)</span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Somalia, Somaliland</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="font-medium">Ukrainian (Українська)</span>
                    <span className="text-sm text-gray-600 dark:text-gray-300">Ukraine</span>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg">
                  <h4 className="font-bold mb-2">🏆 AI Innovation</h4>
                  <p className="text-sm">
                    First refugee healthcare platform with culturally-adaptive AI translation 
                    and conversation engines specifically trained on healthcare scenarios.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeDemo === 'cultural' && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              🏛️ Cultural Intelligence AI
            </h2>
            
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-3">🧠 Communication Adaptation</h3>
                <ul className="space-y-2 text-sm">
                  <li>• High-context vs low-context communication</li>
                  <li>• Direct vs indirect conversation styles</li>
                  <li>• Culturally appropriate medical questioning</li>
                  <li>• Respect for hierarchical consultation</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-blue-500 to-green-500 text-white p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-3">👥 Family Dynamics</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Family involvement level assessment</li>
                  <li>• Collective vs individual decision making</li>
                  <li>• Gender-specific healthcare preferences</li>
                  <li>• Elder consultation protocols</li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-orange-500 to-red-500 text-white p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-3">🕌 Religious Sensitivity</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Halal medication requirements</li>
                  <li>• Prayer time accommodations</li>
                  <li>• Modesty and gender considerations</li>
                  <li>• Religious dietary restrictions</li>
                </ul>
              </div>
            </div>

            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                🎯 Cultural AI in Action
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Scenario: Syrian Patient with Stomach Pain
                  </h4>
                  <div className="bg-white dark:bg-gray-600 p-4 rounded border-l-4 border-blue-500">
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      <strong>AI Cultural Adaptation:</strong>
                    </p>
                    <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• Uses indirect questioning approach</li>
                      <li>• Suggests family consultation</li>
                      <li>• Offers same-gender healthcare options</li>
                      <li>• Considers Ramadan fasting context</li>
                      <li>• Provides halal medication alternatives</li>
                    </ul>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    Scenario: Ukrainian Patient Seeking Mental Health
                  </h4>
                  <div className="bg-white dark:bg-gray-600 p-4 rounded border-l-4 border-green-500">
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      <strong>AI Cultural Adaptation:</strong>
                    </p>
                    <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                      <li>• Uses direct communication style</li>
                      <li>• Acknowledges war trauma sensitivity</li>
                      <li>• Respects self-reliance values</li>
                      <li>• Offers professional medical approach</li>
                      <li>• Considers displacement stress factors</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Technology Showcase */}
        <div className="mt-12 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-lg p-8 text-white">
          <h2 className="text-2xl font-bold text-center mb-6">🚀 Hackathon-Winning AI Technology Stack</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl mb-2">🤖</div>
              <h3 className="font-bold mb-2">GPT-4 Integration</h3>
              <p className="text-sm opacity-90">
                Advanced conversational AI with refugee-specific medical training and cultural context awareness
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">👁️</div>
              <h3 className="font-bold mb-2">Computer Vision</h3>
              <p className="text-sm opacity-90">
                TensorFlow.js powered medical image analysis for skin conditions and wound assessment
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">🌍</div>
              <h3 className="font-bold mb-2">Cultural AI</h3>
              <p className="text-sm opacity-90">
                First-of-its-kind culturally adaptive translation with refugee population specialization
              </p>
            </div>
            <div className="text-center">
              <div className="text-3xl mb-2">⚡</div>
              <h3 className="font-bold mb-2">Real-time Processing</h3>
              <p className="text-sm opacity-90">
                Edge AI computing with offline capabilities and progressive enhancement features
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultilingualPage;