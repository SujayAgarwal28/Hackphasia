import { useState } from 'react';
import { VoiceInput, UserTriageSummary } from '../types';
import VoiceInputComponent from '../voice/VoiceInput';
import { TriageEngine } from '../voice/TriageEngine';
import BodyMapper, { PainAssessment } from '../voice/BodyMapper';
import { HealthReportGenerator, ComprehensiveReport } from '../voice/HealthReportGenerator';
import { generateId, formatDate } from '../utils';

const TriagePage = () => {
  const [isListening, setIsListening] = useState(false);
  const [currentTranscript, setCurrentTranscript] = useState('');
  const [triageResult, setTriageResult] = useState<UserTriageSummary | null>(null);
  const [detectedSymptoms, setDetectedSymptoms] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [painAssessments, setPainAssessments] = useState<PainAssessment[]>([]);
  const [comprehensiveReport, setComprehensiveReport] = useState<ComprehensiveReport | null>(null);
  const [showBodyMapper, setShowBodyMapper] = useState(false);

  const handleVoiceInput = (voiceInput: VoiceInput) => {
    setCurrentTranscript(voiceInput.transcript);
    setIsProcessing(true);

    // Detect symptoms from the transcript
    const symptoms = TriageEngine.detectSymptoms(voiceInput.transcript);
    setDetectedSymptoms(symptoms);

    if (symptoms.length > 0) {
      // Analyze symptoms and get triage result
      const analysis = TriageEngine.analyzeSymptoms(symptoms);
      
      // Create triage summary
      const summary: UserTriageSummary = {
        id: generateId(),
        userId: 'anonymous',
        symptoms,
        bodyZones: [], // Will be enhanced with body mapping feature
        urgency: analysis.urgency,
        advice: analysis.advice,
        recommendedActions: analysis.recommendedActions,
        createdAt: new Date().toISOString(),
        language: 'en'
      };

      setTriageResult(summary);
    }

    setIsProcessing(false);
  };

  const handlePainAssessment = (assessment: PainAssessment) => {
    const updatedAssessments = [...painAssessments, assessment];
    setPainAssessments(updatedAssessments);
    
    // Generate comprehensive report
    const report = HealthReportGenerator.generateComprehensiveReport(updatedAssessments);
    setComprehensiveReport(report);
  };

  const removePainAssessment = (index: number) => {
    const updatedAssessments = painAssessments.filter((_, i) => i !== index);
    setPainAssessments(updatedAssessments);
    
    if (updatedAssessments.length > 0) {
      const report = HealthReportGenerator.generateComprehensiveReport(updatedAssessments);
      setComprehensiveReport(report);
    } else {
      setComprehensiveReport(null);
    }
  };

  const downloadComprehensiveReport = () => {
    if (!comprehensiveReport) return;
    
    const reportText = HealthReportGenerator.formatReportForPrint(comprehensiveReport);
    const blob = new Blob([reportText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `comprehensive-health-report-${comprehensiveReport.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const printComprehensiveReport = () => {
    if (!comprehensiveReport) return;
    
    const reportText = HealthReportGenerator.formatReportForPrint(comprehensiveReport);
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Health Assessment Report</title>
            <style>
              body { font-family: monospace; white-space: pre-wrap; margin: 20px; }
              @media print { body { margin: 0; } }
            </style>
          </head>
          <body>${reportText}</body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const resetAssessment = () => {
    setCurrentTranscript('');
    setTriageResult(null);
    setDetectedSymptoms([]);
    setIsProcessing(false);
    setPainAssessments([]);
    setComprehensiveReport(null);
    setShowBodyMapper(false);
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'emergency': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-black';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const printSummary = () => {
    window.print();
  };

  const downloadSummary = () => {
    if (!triageResult) return;
    
    const summaryText = `
HEALTH ASSESSMENT SUMMARY
Generated: ${formatDate(triageResult.createdAt)}

SYMPTOMS DETECTED:
${triageResult.symptoms.map(s => `• ${s}`).join('\n')}

URGENCY LEVEL: ${triageResult.urgency.toUpperCase()}

ADVICE:
${triageResult.advice}

RECOMMENDED ACTIONS:
${triageResult.recommendedActions.map(a => `• ${a}`).join('\n')}

DISCLAIMER: This assessment is for informational purposes only and should not replace professional medical advice.
    `;

    const blob = new Blob([summaryText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `health-assessment-${triageResult.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
          🩺 Health Assessment
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Voice-enabled symptom checker with multilingual support. Describe your symptoms and get immediate triage guidance.
        </p>
      </div>

      {!triageResult && !showBodyMapper ? (
        <div className="space-y-6">
          <VoiceInputComponent
            onTranscript={handleVoiceInput}
            isListening={isListening}
            onListeningChange={setIsListening}
            language="en-US"
          />

          {currentTranscript && (
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 dark:text-blue-200 mb-2">
                Processing your input...
              </h3>
              <p className="text-blue-800 dark:text-blue-300">
                "{currentTranscript}"
              </p>
            </div>
          )}

          {detectedSymptoms.length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Detected Symptoms:
              </h3>
              <div className="flex flex-wrap gap-2">
                {detectedSymptoms.map((symptom, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                  >
                    {symptom}
                  </span>
                ))}
              </div>
              <div className="mt-4">
                <button
                  onClick={() => setShowBodyMapper(true)}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                >
                  📍 Map Your Pain on Body Diagram
                </button>
              </div>
            </div>
          )}

          {isProcessing && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-300">Analyzing your symptoms...</p>
            </div>
          )}

          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              💡 Tips for better voice recognition:
            </h3>
            <ul className="text-yellow-700 dark:text-yellow-300 text-sm space-y-1">
              <li>• Speak clearly and at a normal pace</li>
              <li>• Describe symptoms in simple terms</li>
              <li>• Examples: "I have a headache and fever" or "My chest hurts"</li>
              <li>• Make sure microphone permissions are enabled</li>
            </ul>
          </div>
        </div>
      ) : showBodyMapper ? (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              🎯 Body Pain Mapping
            </h2>
            <button
              onClick={() => setShowBodyMapper(false)}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg"
            >
              ← Back to Voice Assessment
            </button>
          </div>

          <BodyMapper
            onRegionSelect={handlePainAssessment}
            selectedRegions={painAssessments}
          />

          {painAssessments.length > 0 && comprehensiveReport && (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  🏥 Comprehensive Health Report
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={printComprehensiveReport}
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm"
                  >
                    🖨️ Print
                  </button>
                  <button
                    onClick={downloadComprehensiveReport}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-sm"
                  >
                    💾 Download
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Overall Assessment
                  </h4>
                  <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">
                    Pain Score: {comprehensiveReport.overallPainScore}/10
                  </p>
                  <p className={`text-lg font-semibold ${
                    comprehensiveReport.urgencyLevel === 'emergency' ? 'text-red-600' :
                    comprehensiveReport.urgencyLevel === 'high' ? 'text-orange-600' :
                    comprehensiveReport.urgencyLevel === 'medium' ? 'text-yellow-600' :
                    'text-green-600'
                  }`}>
                    Priority: {comprehensiveReport.urgencyLevel.toUpperCase()}
                  </p>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    Affected Regions ({painAssessments.length})
                  </h4>
                  <div className="space-y-1">
                    {painAssessments.slice(0, 4).map((assessment, index) => (
                      <div key={index} className="text-sm text-gray-600 dark:text-gray-400">
                        • {assessment.region.name}: Level {assessment.painLevel}/10
                      </div>
                    ))}
                    {painAssessments.length > 4 && (
                      <div className="text-sm text-gray-500">
                        ... and {painAssessments.length - 4} more regions
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {comprehensiveReport.redFlags.length > 0 && (
                <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <h4 className="font-bold text-red-800 dark:text-red-200 mb-2">
                    🚨 RED FLAGS - URGENT ATTENTION NEEDED
                  </h4>
                  <ul className="text-red-700 dark:text-red-300 text-sm space-y-1">
                    {comprehensiveReport.redFlags.map((flag, index) => (
                      <li key={index}>• {flag}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  💊 Medical Recommendations
                </h4>
                <ul className="space-y-2">
                  {comprehensiveReport.recommendations.medicalAdvice.slice(0, 3).map((advice, index) => (
                    <li key={index} className="flex items-start">
                      <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 dark:text-gray-300">{advice}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                  🏃‍♂️ Exercise Recommendations
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  {comprehensiveReport.recommendations.exercises.slice(0, 4).map((exercise, index) => (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                      <h5 className="font-medium text-gray-900 dark:text-white">{exercise.name}</h5>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        {exercise.description}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {exercise.frequency} • {exercise.duration}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => window.open('/map', '_blank')}
                  className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  <span className="mr-2">🏥</span>
                  Find Nearby Clinics
                </button>
                <button
                  onClick={resetAssessment}
                  className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  <span className="mr-2">🔄</span>
                  New Assessment
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Triage Result Display */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Assessment Results
              </h2>
              <span className={`px-4 py-2 rounded-full text-sm font-bold ${getUrgencyColor(triageResult.urgency)}`}>
                {triageResult.urgency.toUpperCase()} PRIORITY
              </span>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Detected Symptoms:
                </h3>
                <div className="space-y-2">
                  {triageResult.symptoms.map((symptom, index) => (
                    <div key={index} className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                      <span className="text-gray-700 dark:text-gray-300 capitalize">
                        {symptom}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  Assessment Details:
                </h3>
                <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <p><strong>Generated:</strong> {formatDate(triageResult.createdAt)}</p>
                  <p><strong>Language:</strong> English</p>
                  <p><strong>Assessment ID:</strong> {triageResult.id}</p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Medical Advice:
              </h3>
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed">
                {triageResult.advice}
              </p>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                Recommended Actions:
              </h3>
              <ol className="space-y-2">
                {triageResult.recommendedActions.map((action, index) => (
                  <li key={index} className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold mr-3">
                      {index + 1}
                    </span>
                    <span className="text-gray-700 dark:text-gray-300">
                      {action}
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            {triageResult.urgency === 'emergency' && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">🚨</span>
                  <div>
                    <h4 className="font-bold text-red-800 dark:text-red-200">EMERGENCY SITUATION</h4>
                    <p className="text-red-700 dark:text-red-300">
                      Call your local emergency number immediately. Do not delay seeking professional medical help.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="flex flex-wrap gap-4">
              <button
                onClick={printSummary}
                className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <span className="mr-2">🖨️</span>
                Print Summary
              </button>
              <button
                onClick={downloadSummary}
                className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              >
                <span className="mr-2">💾</span>
                Download
              </button>
              <button
                onClick={() => window.open('/map', '_blank')}
                className="flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                <span className="mr-2">🏥</span>
                Find Clinics
              </button>
              <button
                onClick={resetAssessment}
                className="flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                <span className="mr-2">🔄</span>
                New Assessment
              </button>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
              ⚠️ Important Medical Disclaimer
            </h3>
            <p className="text-yellow-700 dark:text-yellow-300 text-sm">
              This assessment is for informational purposes only and should not replace professional medical advice, 
              diagnosis, or treatment. Always seek the advice of qualified healthcare providers with any questions 
              you may have regarding a medical condition.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default TriagePage;