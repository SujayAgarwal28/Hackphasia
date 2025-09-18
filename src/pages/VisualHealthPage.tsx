import { useState } from 'react';
import PhotoAnalysisComponent from '../ai/PhotoAnalysisComponent';
import { VisualSymptomAnalysis } from '../ai/ComputerVisionHealthService';

const VisualHealthPage: React.FC = () => {
  const [analysisHistory, setAnalysisHistory] = useState<Array<{
    id: string;
    timestamp: Date;
    analysis: VisualSymptomAnalysis;
    imageData?: string;
  }>>([]);

  const handleAnalysisComplete = (analysis: VisualSymptomAnalysis) => {
    const newEntry = {
      id: `analysis_${Date.now()}`,
      timestamp: new Date(),
      analysis
    };
    
    setAnalysisHistory(prev => [newEntry, ...prev.slice(0, 9)]); // Keep last 10 analyses
  };

  const generateComprehensiveReport = () => {
    if (analysisHistory.length === 0) return;

    const reportContent = `
VISUAL HEALTH ANALYSIS REPORT
Generated: ${new Date().toLocaleString()}

ANALYSIS SUMMARY:
Total Analyses: ${analysisHistory.length}
Recent Analyses: ${analysisHistory.slice(0, 3).map((entry, index) => `
  ${index + 1}. ${entry.timestamp.toLocaleDateString()} - Urgency: ${entry.analysis.urgency} (${Math.round(entry.analysis.confidence * 100)}% confidence)
     Conditions: ${entry.analysis.skinConditions.map(c => c.condition).join(', ') || 'None detected'}
     ${entry.analysis.woundAssessment ? `Wound: ${entry.analysis.woundAssessment.type} (${entry.analysis.woundAssessment.severity})` : ''}
`).join('')}

MOST RECENT DETAILED ANALYSIS:
${analysisHistory[0] ? `
Timestamp: ${analysisHistory[0].timestamp.toLocaleString()}
Urgency Level: ${analysisHistory[0].analysis.urgency.toUpperCase()}
Confidence: ${Math.round(analysisHistory[0].analysis.confidence * 100)}%

Detected Conditions:
${analysisHistory[0].analysis.skinConditions.map(condition => `
- ${condition.condition} (${condition.severity})
  Location: ${condition.location.x}, ${condition.location.y}
  Recommendations: ${condition.recommendations.join('; ')}
`).join('')}

${analysisHistory[0].analysis.woundAssessment ? `
Wound Assessment:
- Type: ${analysisHistory[0].analysis.woundAssessment.type}
- Severity: ${analysisHistory[0].analysis.woundAssessment.severity}
- Size: ${analysisHistory[0].analysis.woundAssessment.size.width}×${analysisHistory[0].analysis.woundAssessment.size.height}mm
- Healing Stage: ${analysisHistory[0].analysis.woundAssessment.healingStage}

First Aid Steps:
${analysisHistory[0].analysis.woundAssessment.firstAidSteps.map((step, i) => `${i + 1}. ${step}`).join('\n')}
` : ''}

General Recommendations:
${analysisHistory[0].analysis.recommendations.map(rec => `- ${rec}`).join('\n')}
` : 'No analyses available'}

DISCLAIMER: This AI analysis is for informational purposes only and does not replace professional medical advice. Always consult with qualified healthcare professionals for medical decisions.
    `;

    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `visual-health-analysis-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
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
        <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
          <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-neutral-900">
          Visual Health Analysis
        </h1>
        <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
          Advanced computer vision AI for medical image analysis. Upload photos for instant 
          assessment of skin conditions, wounds, nutritional signs, and health indicators.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Photo Analysis */}
        <div className="lg:col-span-2">
          <PhotoAnalysisComponent onAnalysisComplete={handleAnalysisComplete} />
        </div>

        {/* Right Column: Analysis History & Stats */}
        <div className="space-y-6">
          {/* Analysis Statistics */}
          {analysisHistory.length > 0 && (
            <div className="card">
              <div className="card-header">
                <h3 className="text-lg font-semibold text-neutral-900">
                  Analysis Summary
                </h3>
              </div>
              
              <div className="card-body space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{analysisHistory.length}</div>
                    <div className="text-sm text-neutral-600">Total Analyses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round(analysisHistory.reduce((sum, entry) => sum + entry.analysis.confidence, 0) / analysisHistory.length * 100)}%
                    </div>
                    <div className="text-sm text-neutral-600">Avg Confidence</div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">High Priority:</span>
                    <span className="font-medium">
                      {analysisHistory.filter(entry => ['high', 'emergency'].includes(entry.analysis.urgency)).length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Conditions Detected:</span>
                    <span className="font-medium">
                      {analysisHistory.reduce((sum, entry) => sum + entry.analysis.skinConditions.length, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-neutral-600">Wounds Assessed:</span>
                    <span className="font-medium">
                      {analysisHistory.filter(entry => entry.analysis.woundAssessment).length}
                    </span>
                  </div>
                </div>

                <button
                  onClick={generateComprehensiveReport}
                  className="btn-primary w-full"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Full Report
                </button>
              </div>
            </div>
          )}

          {/* Recent Analysis History */}
          <div className="card">
            <div className="card-header">
              <h3 className="text-lg font-semibold text-neutral-900">
                Recent Analyses
              </h3>
            </div>
            
            <div className="card-body">
              {analysisHistory.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <h4 className="font-medium text-neutral-900 mb-2">No Analyses Yet</h4>
                  <p className="text-sm text-neutral-600">
                    Upload or take a photo to get started with AI health analysis
                  </p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {analysisHistory.map((entry) => (
                    <div
                      key={entry.id}
                      className="p-4 border border-neutral-200 rounded-lg hover:bg-neutral-50 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-sm font-medium text-neutral-900">
                          {entry.timestamp.toLocaleDateString()}
                        </span>
                        <span className={`badge ${getUrgencyBadgeClass(entry.analysis.urgency)}`}>
                          {entry.analysis.urgency}
                        </span>
                      </div>
                      
                      <div className="text-xs text-neutral-600 space-y-2">
                        <div className="flex justify-between">
                          <span>Confidence:</span>
                          <span className="font-medium">{Math.round(entry.analysis.confidence * 100)}%</span>
                        </div>
                        
                        {entry.analysis.skinConditions.length > 0 && (
                          <div>
                            <div className="font-medium mb-1">Conditions:</div>
                            <div className="text-neutral-700">
                              {entry.analysis.skinConditions.map(c => c.condition).join(', ')}
                            </div>
                          </div>
                        )}
                        
                        {entry.analysis.woundAssessment && (
                          <div>
                            <div className="font-medium mb-1">Wound Assessment:</div>
                            <div className="text-neutral-700">
                              {entry.analysis.woundAssessment.type} ({entry.analysis.woundAssessment.severity})
                            </div>
                          </div>
                        )}
                        
                        <div>
                          <div className="font-medium mb-1">Top Recommendation:</div>
                          <div className="text-neutral-700">
                            {entry.analysis.recommendations[0] || 'No specific recommendations'}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* AI Capabilities Info */}
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-6 text-white">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              AI Capabilities
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Skin condition detection & classification</span>
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Wound assessment & healing stage analysis</span>
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Malnutrition & dehydration signs</span>
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>General health indicators</span>
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Refugee-specific health patterns</span>
              </div>
            </div>
          </div>

          {/* Emergency Notice */}
          <div className="alert-error">
            <div className="flex items-start space-x-2">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              <div>
                <h4 className="font-medium mb-1">Emergency Situations</h4>
                <p className="text-sm">
                  If the AI detects emergency-level conditions or you're experiencing severe symptoms, 
                  seek immediate medical attention. This tool is for assessment only, not treatment.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Showcase */}
      <div className="card">
        <div className="card-header text-center">
          <h2 className="text-2xl font-bold text-neutral-900">
            Advanced Computer Vision Features
          </h2>
        </div>
        
        <div className="card-body">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">Real-time Analysis</h3>
              <p className="text-sm text-neutral-600">
                Instant AI-powered assessment using TensorFlow.js and medical computer vision models
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">Precision Detection</h3>
              <p className="text-sm text-neutral-600">
                Specialized models for skin conditions, wounds, and refugee-specific health indicators
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">Privacy-First</h3>
              <p className="text-sm text-neutral-600">
                All processing happens locally in your browser. Photos are never uploaded to servers
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-neutral-900 mb-2">Actionable Insights</h3>
              <p className="text-sm text-neutral-600">
                Detailed recommendations, first aid steps, and urgency assessments for each finding
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisualHealthPage;