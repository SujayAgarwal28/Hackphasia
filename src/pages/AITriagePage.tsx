import { useState, useEffect } from 'react';
import SmartTriageEngine, { SmartTriageSession, SmartTriageQuestion } from '../ai/SmartTriageEngine';
import { AITriageResponse } from '../ai/AIHealthService';
import VoiceInputComponent from '../voice/VoiceInput';
import { VoiceInput } from '../types';

const AITriagePage = () => {
  const [triageEngine] = useState(() => new SmartTriageEngine());
  const [currentSession, setCurrentSession] = useState<SmartTriageSession | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<AITriageResponse | null>(null);
  const [followUpQuestions, setFollowUpQuestions] = useState<SmartTriageQuestion[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<Array<{
    type: 'user' | 'ai' | 'system';
    content: string;
    timestamp: Date;
  }>>([]);

  useEffect(() => {
    initializeSession();
  }, []);

  const initializeSession = async () => {
    const session = await triageEngine.startNewSession();
    setCurrentSession(session);
    addToHistory('system', 'AI Health Assistant initialized. Please describe your symptoms or health concerns.');
  };

  const addToHistory = (type: 'user' | 'ai' | 'system', content: string) => {
    setConversationHistory(prev => [...prev, {
      type,
      content,
      timestamp: new Date()
    }]);
  };

  const handleVoiceInput = async (voiceInput: VoiceInput) => {
    if (!currentSession) return;

    setIsProcessing(true);
    addToHistory('user', voiceInput.transcript);

    try {
      const result = await triageEngine.processVoiceInput(voiceInput);
      
      setAiAnalysis(result.aiAnalysis);
      setFollowUpQuestions(result.followUpQuestions);
      
      // Add AI analysis to conversation
      const aiResponse = `
**Assessment Summary:**
- **Primary Concern:** ${result.aiAnalysis.primaryDiagnosis.condition}
- **Urgency Level:** ${result.aiAnalysis.urgencyLevel.toUpperCase()}
- **Confidence:** ${Math.round(result.aiAnalysis.confidence * 100)}%

**Immediate Actions:**
${result.aiAnalysis.immediateActions.map(action => `• ${action}`).join('\n')}

**When to Seek Care:** ${result.aiAnalysis.whenToSeekCare}
      `;
      
      addToHistory('ai', aiResponse.trim());
      
    } catch (error) {
      console.error('Voice processing error:', error);
      addToHistory('ai', 'I apologize, but I encountered an error processing your input. Please try again or seek immediate medical attention if this is urgent.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQuestionAnswer = async (questionId: string, answer: any) => {
    setIsProcessing(true);
    addToHistory('user', `Answered: ${JSON.stringify(answer)}`);

    try {
      const result = await triageEngine.answerFollowUpQuestion(questionId, answer);
      
      if (result.updatedAnalysis) {
        setAiAnalysis(result.updatedAnalysis);
        addToHistory('ai', 'Based on your additional information, I\'ve updated my assessment.');
      }
      
      setFollowUpQuestions(result.nextQuestions);
      
    } catch (error) {
      console.error('Question processing error:', error);
      addToHistory('ai', 'I had trouble processing your answer. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const generateReport = async () => {
    if (!currentSession) return;

    try {
      const report = await triageEngine.generateSummaryReport();
      
      // Create downloadable report
      const reportContent = `
AI HEALTH ASSESSMENT REPORT
Generated: ${new Date().toLocaleString()}
Session ID: ${report.id}

SYMPTOMS DETECTED:
${report.symptoms.join(', ')}

URGENCY LEVEL: ${report.urgency.toUpperCase()}

ADVICE:
${report.advice}

RECOMMENDED ACTIONS:
${report.recommendedActions.map((action, i) => `${i + 1}. ${action}`).join('\n')}

AI ANALYSIS DETAILS:
${aiAnalysis ? `
Primary Diagnosis: ${aiAnalysis.primaryDiagnosis.condition}
Reasoning: ${aiAnalysis.primaryDiagnosis.reasoning}
Confidence: ${Math.round(aiAnalysis.confidence * 100)}%

Differential Diagnoses:
${aiAnalysis.differentialDiagnoses.map(dd => `- ${dd.condition} (${Math.round(dd.probability * 100)}%): ${dd.reasoning}`).join('\n')}

Red Flags to Watch For:
${aiAnalysis.redFlags.map(flag => `- ${flag}`).join('\n')}

Home Care Tips:
${aiAnalysis.homeCareTips.map(tip => `- ${tip}`).join('\n')}

Culturally Sensitive Advice:
${aiAnalysis.culturallySensitiveAdvice.map(advice => `- ${advice}`).join('\n')}
` : 'Detailed analysis not available'}

DISCLAIMER: This AI assessment is for informational purposes only and does not replace professional medical advice. Always consult with healthcare professionals for medical decisions.
      `;

      const blob = new Blob([reportContent], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-health-assessment-${Date.now()}.txt`;
      a.click();
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Report generation error:', error);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'emergency': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🤖 AI-Powered Health Assessment
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Advanced AI medical triage using GPT-4 and specialized refugee health expertise
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column: Voice Input & Controls */}
          <div className="lg:col-span-1 space-y-6">
            {/* Voice Input */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                🎤 Voice Input
              </h3>
              <VoiceInputComponent 
                onTranscript={handleVoiceInput}
              />
            </div>

            {/* Session Info */}
            {currentSession && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  📊 Session Info
                </h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Session ID:</span>
                    <span className="font-mono text-xs">{currentSession.id.slice(-8)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Started:</span>
                    <span>{currentSession.startTime.toLocaleTimeString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Voice Inputs:</span>
                    <span>{currentSession.voiceInputs.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Risk Level:</span>
                    <span className={`px-2 py-1 rounded text-xs ${getUrgencyColor(currentSession.riskAssessment.level)}`}>
                      {currentSession.riskAssessment.level.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            {aiAnalysis && (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  📋 Actions
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={generateReport}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    📄 Download AI Report
                  </button>
                  <button
                    onClick={initializeSession}
                    className="w-full bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                  >
                    🔄 New Assessment
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Middle Column: Conversation */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 h-[600px] flex flex-col">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                💬 AI Conversation
              </h3>
              
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {conversationHistory.map((entry, index) => (
                  <div key={index} className={`p-3 rounded-lg ${
                    entry.type === 'user' ? 'bg-blue-100 dark:bg-blue-900 ml-8' :
                    entry.type === 'ai' ? 'bg-green-100 dark:bg-green-900 mr-8' :
                    'bg-gray-100 dark:bg-gray-700 text-center'
                  }`}>
                    <div className={`font-medium text-sm mb-1 ${
                      entry.type === 'user' ? 'text-blue-800 dark:text-blue-200' :
                      entry.type === 'ai' ? 'text-green-800 dark:text-green-200' :
                      'text-gray-600 dark:text-gray-400'
                    }`}>
                      {entry.type === 'user' ? '👤 You' : 
                       entry.type === 'ai' ? '🤖 AI Assistant' : '💡 System'}
                    </div>
                    <div className="text-gray-800 dark:text-gray-200 text-sm whitespace-pre-line">
                      {entry.content}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {entry.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                ))}
                
                {isProcessing && (
                  <div className="bg-yellow-100 dark:bg-yellow-900 p-3 rounded-lg mr-8">
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-yellow-600 mr-2"></div>
                      <span className="text-yellow-800 dark:text-yellow-200 text-sm">
                        AI is analyzing your input...
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Follow-up Questions */}
              {followUpQuestions.length > 0 && (
                <div className="border-t border-gray-200 dark:border-gray-600 pt-4">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                    Follow-up Questions:
                  </h4>
                  <div className="space-y-3">
                    {followUpQuestions.slice(0, 2).map((question) => (
                      <div key={question.id} className="border border-gray-200 dark:border-gray-600 rounded p-3">
                        <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                          {question.question}
                        </p>
                        {question.type === 'boolean' && (
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleQuestionAnswer(question.id, true)}
                              className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded transition-colors"
                            >
                              Yes
                            </button>
                            <button
                              onClick={() => handleQuestionAnswer(question.id, false)}
                              className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors"
                            >
                              No
                            </button>
                          </div>
                        )}
                        {question.type === 'scale' && (
                          <input
                            type="range"
                            min="1"
                            max="10"
                            className="w-full"
                            onChange={(e) => handleQuestionAnswer(question.id, parseInt(e.target.value))}
                          />
                        )}
                        {question.type === 'multiple-choice' && question.options && (
                          <div className="grid grid-cols-1 gap-1">
                            {question.options.map((option, idx) => (
                              <button
                                key={idx}
                                onClick={() => handleQuestionAnswer(question.id, option)}
                                className="px-2 py-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-xs rounded transition-colors text-left"
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: AI Analysis */}
          <div className="lg:col-span-1">
            {aiAnalysis ? (
              <div className="space-y-6">
                {/* Primary Assessment */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    🔍 AI Analysis
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getUrgencyColor(aiAnalysis.urgencyLevel)}`}>
                        {aiAnalysis.urgencyLevel.toUpperCase()} PRIORITY
                      </span>
                      <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                        {Math.round(aiAnalysis.confidence * 100)}% confidence
                      </span>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white mb-2">Primary Assessment:</h4>
                      <p className="text-sm text-gray-700 dark:text-gray-300 mb-1">
                        <strong>{aiAnalysis.primaryDiagnosis.condition}</strong>
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {aiAnalysis.primaryDiagnosis.reasoning}
                      </p>
                    </div>

                    {aiAnalysis.differentialDiagnoses.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Other Possibilities:</h4>
                        {aiAnalysis.differentialDiagnoses.slice(0, 2).map((dd, index) => (
                          <div key={index} className="text-sm mb-1">
                            <span className="text-gray-700 dark:text-gray-300">
                              {dd.condition} ({Math.round(dd.probability * 100)}%)
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Immediate Actions */}
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    ⚡ Immediate Actions
                  </h3>
                  <ul className="space-y-2">
                    {aiAnalysis.immediateActions.map((action, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-red-500 mr-2">•</span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cultural Advice */}
                {aiAnalysis.culturallySensitiveAdvice.length > 0 && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-4">
                      🌍 Cultural Considerations
                    </h3>
                    <ul className="space-y-2">
                      {aiAnalysis.culturallySensitiveAdvice.map((advice, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          <span className="text-sm text-blue-700 dark:text-blue-300">{advice}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Red Flags */}
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-red-800 dark:text-red-200 mb-4">
                    🚨 Warning Signs
                  </h3>
                  <p className="text-sm text-red-700 dark:text-red-300 mb-3">
                    Seek immediate medical attention if you experience:
                  </p>
                  <ul className="space-y-1">
                    {aiAnalysis.redFlags.map((flag, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-red-500 mr-2">⚠️</span>
                        <span className="text-sm text-red-700 dark:text-red-300">{flag}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 text-center">
                <div className="text-gray-400 dark:text-gray-500 mb-4">
                  <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    🤖
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                    AI Analysis Ready
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Start by describing your symptoms using voice input. The AI will analyze your input and provide personalized medical guidance.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AITriagePage;