import { useState } from 'react';
import PhotoAnalysisComponent from '../ai/PhotoAnalysisComponent';
import { VisualSymptomAnalysis } from '../ai/ComputerVisionHealthService';

const VisualHealthPage = () => {
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
            👁️ Visual Health Analysis
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Advanced computer vision AI for medical image analysis. Upload photos for instant 
            assessment of skin conditions, wounds, nutritional signs, and general health indicators.
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
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  📊 Analysis Summary
                </h3>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{analysisHistory.length}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Total Analyses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">
                      {Math.round(analysisHistory.reduce((sum, entry) => sum + entry.analysis.confidence, 0) / analysisHistory.length * 100)}%
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Avg Confidence</div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">High Priority:</span>
                    <span className="font-medium">
                      {analysisHistory.filter(entry => ['high', 'emergency'].includes(entry.analysis.urgency)).length}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Conditions Detected:</span>
                    <span className="font-medium">
                      {analysisHistory.reduce((sum, entry) => sum + entry.analysis.skinConditions.length, 0)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Wounds Assessed:</span>
                    <span className="font-medium">
                      {analysisHistory.filter(entry => entry.analysis.woundAssessment).length}
                    </span>
                  </div>
                </div>

                <button
                  onClick={generateComprehensiveReport}
                  className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                >
                  📄 Download Full Report
                </button>
              </div>
            )}

            {/* Recent Analysis History */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                🕒 Recent Analyses
              </h3>
              
              {analysisHistory.length === 0 ? (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  <div className="text-4xl mb-2">📸</div>
                  <p className="text-sm">No analyses yet</p>
                  <p className="text-xs">Upload or take a photo to get started</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {analysisHistory.map((entry) => (
                    <div
                      key={entry.id}
                      className="border border-gray-200 dark:border-gray-600 rounded-lg p-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {entry.timestamp.toLocaleDateString()}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getUrgencyColor(entry.analysis.urgency)}`}>
                          {entry.analysis.urgency}
                        </span>
                      </div>
                      
                      <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                        <div>
                          <strong>Confidence:</strong> {Math.round(entry.analysis.confidence * 100)}%
                        </div>
                        
                        {entry.analysis.skinConditions.length > 0 && (
                          <div>
                            <strong>Conditions:</strong> {entry.analysis.skinConditions.map(c => c.condition).join(', ')}
                          </div>
                        )}
                        
                        {entry.analysis.woundAssessment && (
                          <div>
                            <strong>Wound:</strong> {entry.analysis.woundAssessment.type} ({entry.analysis.woundAssessment.severity})
                          </div>
                        )}
                        
                        <div>
                          <strong>Top Recommendation:</strong> {entry.analysis.recommendations[0] || 'No specific recommendations'}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* AI Capabilities Info */}
            <div className="bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg shadow-md p-6 text-white">
              <h3 className="text-lg font-semibold mb-4">🤖 AI Capabilities</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center">
                  <span className="mr-2">🔬</span>
                  <span>Skin condition detection & classification</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">🩹</span>
                  <span>Wound assessment & healing stage analysis</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">🥗</span>
                  <span>Malnutrition & dehydration signs</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">👤</span>
                  <span>General health indicators</span>
                </div>
                <div className="flex items-center">
                  <span className="mr-2">🎯</span>
                  <span>Refugee-specific health patterns</span>
                </div>
              </div>
            </div>

            {/* Emergency Notice */}
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <h4 className="font-medium text-red-800 dark:text-red-200 mb-2">🚨 Emergency Situations</h4>
              <p className="text-sm text-red-700 dark:text-red-300">
                If the AI detects emergency-level conditions or you're experiencing severe symptoms, 
                seek immediate medical attention. This tool is for assessment only, not treatment.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Showcase */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-8">
            🏆 Advanced Computer Vision Features
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Real-time Analysis</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Instant AI-powered assessment using TensorFlow.js and medical computer vision models
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Precision Detection</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Specialized models for skin conditions, wounds, and refugee-specific health indicators
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🔒</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Privacy-First</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                All processing happens locally in your browser. Photos are never uploaded to servers
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Actionable Insights</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
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