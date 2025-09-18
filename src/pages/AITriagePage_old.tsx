import { useState, useEffect } from 'react';

interface PatientInfo {
  age?: number;
  gender?: 'male' | 'female' | 'other';
  weight?: number;
  height?: number;
  allergies: string[];
  medications: string[];
  medicalHistory: string[];
}

interface Symptom {
  name: string;
  severity: 1 | 2 | 3 | 4 | 5;
  duration: string;
  onset: 'sudden' | 'gradual';
  description: string;
}

interface VitalSigns {
  temperature?: number;
  bloodPressure?: { systolic: number; diastolic: number };
  heartRate?: number;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  painLevel?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
}

interface Assessment {
  id: string;
  timestamp: Date;
  patientInfo: PatientInfo;
  chiefComplaint: string;
  symptoms: Symptom[];
  vitalSigns: VitalSigns;
  triageLevel: 1 | 2 | 3 | 4 | 5;
  recommendations: string[];
  differentialDiagnosis: { condition: string; probability: number; reasoning: string }[];
  redFlags: string[];
  disposition: 'emergency' | 'urgent_care' | 'primary_care' | 'self_care' | 'monitor';
}

const TRIAGE_LEVELS = {
  1: { name: 'Resuscitation', color: 'bg-red-600', description: 'Immediate life-threatening', time: 'Immediate' },
  2: { name: 'Emergency', color: 'bg-orange-500', description: 'Imminently life-threatening', time: '≤ 10 minutes' },
  3: { name: 'Urgent', color: 'bg-yellow-500', description: 'Potentially life-threatening', time: '≤ 30 minutes' },
  4: { name: 'Semi-urgent', color: 'bg-green-500', description: 'Potentially serious', time: '≤ 60 minutes' },
  5: { name: 'Non-urgent', color: 'bg-blue-500', description: 'Less urgent', time: '≤ 120 minutes' }
};

const AITriagePage: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'intake' | 'symptoms' | 'vitals' | 'assessment' | 'results'>('intake');
  const [patientInfo, setPatientInfo] = useState<PatientInfo>({
    allergies: [],
    medications: [],
    medicalHistory: []
  });
  const [chiefComplaint, setChiefComplaint] = useState('');
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [vitalSigns, setVitalSigns] = useState<VitalSigns>({});
  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const steps = [
    { id: 'intake', name: 'Patient Intake', icon: '👤' },
    { id: 'symptoms', name: 'Symptom Assessment', icon: '🩺' },
    { id: 'vitals', name: 'Vital Signs', icon: '📊' },
    { id: 'assessment', name: 'AI Analysis', icon: '🧠' },
    { id: 'results', name: 'Results & Plan', icon: '📋' }
  ];

  const addSymptom = () => {
    setSymptoms([...symptoms, {
      name: '',
      severity: 3,
      duration: '',
      onset: 'gradual',
      description: ''
    }]);
  };

  const updateSymptom = (index: number, field: keyof Symptom, value: any) => {
    const updated = [...symptoms];
    updated[index] = { ...updated[index], [field]: value };
    setSymptoms(updated);
  };

  const removeSymptom = (index: number) => {
    setSymptoms(symptoms.filter((_, i) => i !== index));
  };

  const conductAIAssessment = async () => {
    setIsProcessing(true);
    setCurrentStep('assessment');

    // Simulate AI analysis - replace with real API call
    try {
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate processing

      const mockAssessment: Assessment = {
        id: `assessment_${Date.now()}`,
        timestamp: new Date(),
        patientInfo,
        chiefComplaint,
        symptoms,
        vitalSigns,
        triageLevel: calculateTriageLevel(),
        recommendations: generateRecommendations(),
        differentialDiagnosis: generateDifferentialDx(),
        redFlags: identifyRedFlags(),
        disposition: determineDisposition()
      };

      setAssessment(mockAssessment);
      setCurrentStep('results');
    } catch (error) {
      console.error('Assessment error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateTriageLevel = (): 1 | 2 | 3 | 4 | 5 => {
    // Simplified triage calculation
    if (vitalSigns.temperature && vitalSigns.temperature > 39) return 2;
    if (vitalSigns.bloodPressure && vitalSigns.bloodPressure.systolic > 180) return 2;
    if (vitalSigns.heartRate && (vitalSigns.heartRate > 120 || vitalSigns.heartRate < 50)) return 3;
    if (vitalSigns.painLevel && vitalSigns.painLevel >= 8) return 3;
    if (symptoms.some(s => s.severity >= 4)) return 3;
    if (symptoms.some(s => s.severity >= 3)) return 4;
    return 5;
  };

  const generateRecommendations = (): string[] => {
    const recommendations = [];
    if (vitalSigns.temperature && vitalSigns.temperature > 38.5) {
      recommendations.push('Monitor temperature closely, consider fever reduction');
    }
    if (vitalSigns.painLevel && vitalSigns.painLevel >= 7) {
      recommendations.push('Pain management required - consider analgesics');
    }
    recommendations.push('Continue monitoring symptoms');
    recommendations.push('Follow up if symptoms worsen');
    return recommendations;
  };

  const generateDifferentialDx = () => {
    // Mock differential diagnosis based on symptoms
    return [
      { condition: 'Viral Upper Respiratory Infection', probability: 0.65, reasoning: 'Based on symptom presentation' },
      { condition: 'Bacterial Infection', probability: 0.25, reasoning: 'Consider if fever persists' },
      { condition: 'Allergic Reaction', probability: 0.10, reasoning: 'Rule out environmental triggers' }
    ];
  };

  const identifyRedFlags = (): string[] => {
    const redFlags = [];
    if (vitalSigns.temperature && vitalSigns.temperature > 39.5) {
      redFlags.push('High fever requiring immediate attention');
    }
    if (vitalSigns.bloodPressure && vitalSigns.bloodPressure.systolic > 200) {
      redFlags.push('Severe hypertension - emergency care needed');
    }
    return redFlags;
  };

  const determineDisposition = (): Assessment['disposition'] => {
    const triageLevel = calculateTriageLevel();
    if (triageLevel <= 2) return 'emergency';
    if (triageLevel === 3) return 'urgent_care';
    if (triageLevel === 4) return 'primary_care';
    return 'self_care';
  };

  const renderStepIndicator = () => (
    <div className="flex justify-center mb-8">
      <div className="flex items-center space-x-4">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep === step.id ? 'bg-blue-600 text-white' :
              steps.findIndex(s => s.id === currentStep) > index ? 'bg-green-500 text-white' :
              'bg-neutral-200 text-neutral-600'
            }`}>
              {steps.findIndex(s => s.id === currentStep) > index ? '✓' : step.icon}
            </div>
            <span className={`ml-2 text-sm font-medium ${
              currentStep === step.id ? 'text-blue-600' : 'text-neutral-600'
            }`}>
              {step.name}
            </span>
            {index < steps.length - 1 && (
              <div className={`mx-4 w-8 h-0.5 ${
                steps.findIndex(s => s.id === currentStep) > index ? 'bg-green-500' : 'bg-neutral-200'
              }`} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
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

  const getUrgencyBadgeClass = (urgency: string) => {
    switch (urgency) {
      case 'low': return 'badge-success';
      case 'medium': return 'badge-warning';
      case 'high': return 'badge-danger';
      case 'emergency': return 'badge-danger';
      default: return 'badge-secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-neutral-900">
          AI Health Assessment
        </h1>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          Advanced AI medical triage using GPT-4 and specialized refugee health expertise 
          with cultural sensitivity protocols.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Voice Input & Controls */}
        <div className="lg:col-span-1 space-y-6">
          {/* Voice Input */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-neutral-900">
                Voice Input
              </h3>
            </div>
            <div className="card-body">
              <VoiceInputComponent 
                onTranscript={handleVoiceInput}
              />
            </div>
          </div>

          {/* Session Info */}
          {currentSession && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-neutral-900">
                  Session Information
                </h3>
              </div>
              <div className="card-body space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Session ID:</span>
                  <span className="font-mono text-xs bg-neutral-100 px-2 py-1 rounded">
                    {currentSession.id.slice(-8)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Started:</span>
                  <span className="font-medium">{currentSession.startTime.toLocaleTimeString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Voice Inputs:</span>
                  <span className="font-medium">{currentSession.voiceInputs.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-600">Risk Level:</span>
                  <span className={`badge ${getUrgencyBadgeClass(currentSession.riskAssessment.level)}`}>
                    {currentSession.riskAssessment.level.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          {aiAnalysis && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-neutral-900">
                  Available Actions
                </h3>
              </div>
              <div className="card-body space-y-3">
                <button
                  onClick={generateReport}
                  className="btn-primary w-full"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download AI Report
                </button>
                <button
                  onClick={initializeSession}
                  className="btn-secondary w-full"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  New Assessment
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Middle Column: Conversation */}
        <div className="lg:col-span-1">
          <div className="card h-[700px] flex flex-col">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-neutral-900">
                  AI Conversation
                </h3>
                {isProcessing && (
                  <div className="flex items-center text-blue-600">
                    <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full mr-2"></div>
                    <span className="text-sm">Processing...</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {conversationHistory.map((entry, index) => (
                <div key={index} className={`p-4 rounded-lg ${
                  entry.type === 'user' ? 'bg-blue-50 border-l-4 border-blue-500 ml-8' :
                  entry.type === 'ai' ? 'bg-green-50 border-l-4 border-green-500 mr-8' :
                  'bg-neutral-50 border-l-4 border-neutral-300 text-center'
                }`}>
                  <div className={`flex items-center text-sm font-medium mb-2 ${
                    entry.type === 'user' ? 'text-blue-700' :
                    entry.type === 'ai' ? 'text-green-700' :
                    'text-neutral-600'
                  }`}>
                    {entry.type === 'user' && (
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                    {entry.type === 'ai' && (
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                      </svg>
                    )}
                    {entry.type === 'system' && (
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    )}
                    {entry.type === 'user' ? 'You' : 
                     entry.type === 'ai' ? 'AI Assistant' : 'System'}
                  </div>
                  <div className="text-neutral-800 text-sm whitespace-pre-line leading-relaxed">
                    {entry.content}
                  </div>
                  <div className="text-xs text-neutral-500 mt-2">
                    {entry.timestamp.toLocaleTimeString()}
                  </div>
                </div>
              ))}
              
              {conversationHistory.length === 0 && (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h4 className="font-medium text-neutral-900 mb-2">
                    Ready to Begin Assessment
                  </h4>
                  <p className="text-neutral-600 text-sm max-w-xs mx-auto">
                    Use voice input to describe your health concerns. 
                    The AI will provide culturally sensitive guidance.
                  </p>
                </div>
              )}
            </div>

            {/* Follow-up Questions */}
            {followUpQuestions.length > 0 && (
              <div className="card-footer border-t border-neutral-200">
                <h4 className="font-medium text-neutral-900 mb-3">
                  Follow-up Questions:
                </h4>
                <div className="space-y-3">
                  {followUpQuestions.slice(0, 2).map((question) => (
                    <div key={question.id} className="p-3 border border-neutral-200 rounded-lg bg-neutral-50">
                      <p className="text-sm text-neutral-700 mb-3">
                        {question.question}
                      </p>
                      {question.type === 'boolean' && (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleQuestionAnswer(question.id, true)}
                            className="btn-success btn-sm"
                          >
                            Yes
                          </button>
                          <button
                            onClick={() => handleQuestionAnswer(question.id, false)}
                            className="btn-danger btn-sm"
                          >
                            No
                          </button>
                        </div>
                      )}
                      {question.type === 'scale' && (
                        <div className="space-y-2">
                          <input
                            type="range"
                            min="1"
                            max="10"
                            className="w-full h-2 bg-neutral-200 rounded-lg appearance-none cursor-pointer"
                            onChange={(e) => handleQuestionAnswer(question.id, parseInt(e.target.value))}
                          />
                          <div className="flex justify-between text-xs text-neutral-500">
                            <span>1 (Mild)</span>
                            <span>10 (Severe)</span>
                          </div>
                        </div>
                      )}
                      {question.type === 'multiple-choice' && question.options && (
                        <div className="grid grid-cols-1 gap-2">
                          {question.options.map((option, idx) => (
                            <button
                              key={idx}
                              onClick={() => handleQuestionAnswer(question.id, option)}
                              className="px-3 py-2 bg-white border border-neutral-200 hover:border-blue-300 hover:bg-blue-50 text-sm rounded-lg transition-colors text-left"
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
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-neutral-900">
                    AI Analysis Results
                  </h3>
                </div>
                <div className="card-body space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`badge ${getUrgencyBadgeClass(aiAnalysis.urgencyLevel)}`}>
                      {aiAnalysis.urgencyLevel.toUpperCase()} PRIORITY
                    </span>
                    <span className="text-sm text-neutral-600">
                      {Math.round(aiAnalysis.confidence * 100)}% confidence
                    </span>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-neutral-900 mb-2">Primary Assessment:</h4>
                    <p className="text-sm text-neutral-700 font-medium mb-1">
                      {aiAnalysis.primaryDiagnosis.condition}
                    </p>
                    <p className="text-xs text-neutral-600 leading-relaxed">
                      {aiAnalysis.primaryDiagnosis.reasoning}
                    </p>
                  </div>

                  {aiAnalysis.differentialDiagnoses.length > 0 && (
                    <div>
                      <h4 className="font-medium text-neutral-900 mb-2">Other Possibilities:</h4>
                      <div className="space-y-1">
                        {aiAnalysis.differentialDiagnoses.slice(0, 2).map((dd, index) => (
                          <div key={index} className="text-sm">
                            <span className="text-neutral-700">
                              {dd.condition}
                            </span>
                            <span className="text-neutral-500 ml-2">
                              ({Math.round(dd.probability * 100)}%)
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Immediate Actions */}
              <div className="card">
                <div className="card-header">
                  <h3 className="text-lg font-semibold text-neutral-900">
                    Immediate Actions
                  </h3>
                </div>
                <div className="card-body">
                  <ul className="space-y-2">
                    {aiAnalysis.immediateActions.map((action, index) => (
                      <li key={index} className="flex items-start">
                        <svg className="w-4 h-4 text-red-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                        <span className="text-sm text-neutral-700">{action}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Cultural Advice */}
              {aiAnalysis.culturallySensitiveAdvice.length > 0 && (
                <div className="alert-info">
                  <div className="flex items-start space-x-2">
                    <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h4 className="font-medium mb-2">Cultural Considerations</h4>
                      <ul className="space-y-1">
                        {aiAnalysis.culturallySensitiveAdvice.map((advice, index) => (
                          <li key={index} className="text-sm flex items-start">
                            <span className="text-blue-500 mr-2">•</span>
                            <span>{advice}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Red Flags */}
              <div className="alert-error">
                <div className="flex items-start space-x-2">
                  <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <div>
                    <h4 className="font-medium mb-2">Warning Signs</h4>
                    <p className="text-sm mb-3">
                      Seek immediate medical attention if you experience:
                    </p>
                    <ul className="space-y-1">
                      {aiAnalysis.redFlags.map((flag, index) => (
                        <li key={index} className="text-sm flex items-start">
                          <span className="text-red-500 mr-2">⚠️</span>
                          <span>{flag}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card text-center">
              <div className="card-body py-12">
                <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-neutral-900 mb-2">
                  AI Analysis Ready
                </h3>
                <p className="text-sm text-neutral-600 max-w-xs mx-auto">
                  Start by describing your symptoms using voice input. 
                  The AI will analyze your input and provide personalized medical guidance.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AITriagePage;