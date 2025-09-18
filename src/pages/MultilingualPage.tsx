import { useState } from 'react';
import MultilingualInterface from '../components/MultilingualInterface';

const MultilingualPage: React.FC = () => {
  const [activeDemo, setActiveDemo] = useState<'conversation' | 'translation' | 'cultural'>('conversation');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-neutral-900">
          Advanced Multilingual AI
        </h1>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          Cutting-edge AI translation with cultural sensitivity, real-time conversation, 
          and refugee-specific language support for healthcare communication.
        </p>
      </div>

      {/* Demo Selection */}
      <div className="flex justify-center">
        <div className="bg-white rounded-lg border border-neutral-200 p-1 shadow-sm">
          <button
            onClick={() => setActiveDemo('conversation')}
            className={`px-6 py-3 rounded-md transition-colors flex items-center space-x-2 ${
              activeDemo === 'conversation'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span>AI Conversation</span>
          </button>
          <button
            onClick={() => setActiveDemo('translation')}
            className={`px-6 py-3 rounded-md transition-colors flex items-center space-x-2 ${
              activeDemo === 'translation'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            <span>Translation</span>
          </button>
          <button
            onClick={() => setActiveDemo('cultural')}
            className={`px-6 py-3 rounded-md transition-colors flex items-center space-x-2 ${
              activeDemo === 'cultural'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>Cultural AI</span>
          </button>
        </div>
      </div>

      {/* Main Interface */}
      {activeDemo === 'conversation' && <MultilingualInterface />}
      
      {activeDemo === 'translation' && (
        <div className="card">
          <div className="card-header text-center">
            <h2 className="text-2xl font-bold text-neutral-900">
              Real-time Medical Translation
            </h2>
          </div>
          <div className="card-body">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                  Translation Features
                </h3>
                <div className="space-y-4">
                  <div className="alert-success">
                    <h4 className="font-medium mb-2">
                      Context-Aware Translation
                    </h4>
                    <p className="text-sm">
                      Medical terminology translation with refugee-specific health context and emergency phrase prioritization.
                    </p>
                  </div>
                  <div className="alert-info">
                    <h4 className="font-medium mb-2">
                      Voice Integration
                    </h4>
                    <p className="text-sm">
                      Speech-to-text recognition in native languages with text-to-speech output for proper pronunciation guidance.
                    </p>
                  </div>
                  <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
                    <h4 className="font-medium text-purple-800 mb-2">
                      Bidirectional Translation
                    </h4>
                    <p className="text-sm text-purple-700">
                      Seamless translation between refugee languages and local healthcare provider languages with confidence scoring.
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 mb-4">
                  Language Coverage
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-neutral-50 rounded">
                    <span className="font-medium">Arabic (العربية)</span>
                    <span className="text-sm text-neutral-600">Syria, Iraq, Yemen</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-neutral-50 rounded">
                    <span className="font-medium">Persian (فارسی)</span>
                    <span className="text-sm text-neutral-600">Afghanistan, Iran</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-neutral-50 rounded">
                    <span className="font-medium">Somali (Soomaali)</span>
                    <span className="text-sm text-neutral-600">Somalia, Somaliland</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-neutral-50 rounded">
                    <span className="font-medium">Ukrainian (Українська)</span>
                    <span className="text-sm text-neutral-600">Ukraine</span>
                  </div>
                </div>
                <div className="mt-4 bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 rounded-lg">
                  <h4 className="font-bold mb-2 flex items-center">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                    AI Innovation
                  </h4>
                  <p className="text-sm">
                    First refugee healthcare platform with culturally-adaptive AI translation 
                    and conversation engines specifically trained on healthcare scenarios.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeDemo === 'cultural' && (
        <div className="card">
          <div className="card-header text-center">
            <h2 className="text-2xl font-bold text-neutral-900">
              Cultural Intelligence AI
            </h2>
          </div>
          
          <div className="card-body space-y-8">
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 text-white p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Communication Adaptation
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>High-context vs low-context communication</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Direct vs indirect conversation styles</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Culturally appropriate medical questioning</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Respect for hierarchical consultation</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-blue-600 to-green-600 text-white p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Family Dynamics
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Family involvement level assessment</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Collective vs individual decision making</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Gender-specific healthcare preferences</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Elder consultation protocols</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-orange-600 to-red-600 text-white p-6 rounded-lg">
                <h3 className="text-lg font-bold mb-3 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Religious Sensitivity
                </h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Halal medication requirements</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Prayer time accommodations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Modesty and gender considerations</span>
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>Religious dietary restrictions</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="bg-neutral-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-neutral-900 mb-4 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
                Cultural AI in Action
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-neutral-800 mb-2">
                    Scenario: Syrian Patient with Stomach Pain
                  </h4>
                  <div className="bg-white p-4 rounded border-l-4 border-blue-500">
                    <p className="text-sm text-neutral-700 mb-2">
                      <strong>AI Cultural Adaptation:</strong>
                    </p>
                    <ul className="text-xs text-neutral-600 space-y-1">
                      <li>• Uses indirect questioning approach</li>
                      <li>• Suggests family consultation</li>
                      <li>• Offers same-gender healthcare options</li>
                      <li>• Considers Ramadan fasting context</li>
                      <li>• Provides halal medication alternatives</li>
                    </ul>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-neutral-800 mb-2">
                    Scenario: Ukrainian Patient Seeking Mental Health
                  </h4>
                  <div className="bg-white p-4 rounded border-l-4 border-green-500">
                    <p className="text-sm text-neutral-700 mb-2">
                      <strong>AI Cultural Adaptation:</strong>
                    </p>
                    <ul className="text-xs text-neutral-600 space-y-1">
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
        </div>
      )}

      {/* Technology Showcase */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-xl p-8 text-white">
        <h2 className="text-2xl font-bold text-center mb-6">Advanced AI Technology Stack</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="font-bold mb-2">GPT-4 Integration</h3>
            <p className="text-sm opacity-90">
              Advanced conversational AI with refugee-specific medical training and cultural context awareness
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h3 className="font-bold mb-2">Computer Vision</h3>
            <p className="text-sm opacity-90">
              TensorFlow.js powered medical image analysis for skin conditions and wound assessment
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="font-bold mb-2">Cultural AI</h3>
            <p className="text-sm opacity-90">
              First-of-its-kind culturally adaptive translation with refugee population specialization
            </p>
          </div>
          <div className="text-center">
            <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-bold mb-2">Real-time Processing</h3>
            <p className="text-sm opacity-90">
              Edge AI computing with offline capabilities and progressive enhancement features
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultilingualPage;