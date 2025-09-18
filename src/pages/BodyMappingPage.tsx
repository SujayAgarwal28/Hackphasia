import { useState } from 'react';
// Gemini API endpoint and key (replace with your backend endpoint if needed)
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';
import BodyMappingCanvas from '../voice/BodyMappingCanvas';

const BodyMappingPage = () => {
  const [selectedZones, setSelectedZones] = useState<string[]>([]);
  const [painLevel, setPainLevel] = useState<number>(5);
  const [painDuration, setPainDuration] = useState<string>('');
  const [additionalSymptoms, setAdditionalSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState<string>('');

  const commonSymptoms = [
    'Numbness', 'Tingling', 'Burning', 'Sharp pain', 'Dull ache', 
    'Throbbing', 'Cramping', 'Stiffness', 'Swelling', 'Redness'
  ];

  const painDurations = [
    { value: 'minutes', label: 'A few minutes' },
    { value: 'hours', label: 'Several hours' },
    { value: 'days', label: 'A few days' },
    { value: 'weeks', label: 'Several weeks' },
    { value: 'months', label: 'Months' },
    { value: 'chronic', label: 'Ongoing/Chronic' }
  ];

  const handleZoneSelect = (zones: string[]) => {
    setSelectedZones(zones);
  };

  const handleSymptomToggle = (symptom: string) => {
    setAdditionalSymptoms(prev => 
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const [loadingReport, setLoadingReport] = useState(false);

  const generateReport = async () => {
    const reportData = {
      painAreas: selectedZones,
      painLevel,
      duration: painDuration,
      symptoms: additionalSymptoms,
      notes,
      timestamp: new Date().toISOString(),
    };

    setLoadingReport(true);
    try {
      const response = await fetch("http://localhost:3001/api/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reportData }),
      });

      const data = await response.json();
      const geminiText = data?.reply || 'No report generated.';

      // Download the report as a text file
      const reportText = `BODY MAPPING REPORT\nGenerated: ${new Date().toLocaleString()}\n\nPAIN AREAS: ${selectedZones.join(', ') || 'None selected'}\nPAIN LEVEL: ${painLevel}/10\nDURATION: ${painDuration}\nSYMPTOMS: ${additionalSymptoms.join(', ') || 'None'}\n\nNOTES: ${notes}\n\nAI FIRST AID REPORT:\n${geminiText}`;
      const blob = new Blob([reportText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `pain-mapping-${Date.now()}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
      // Optionally show an error alert
      alert('Error generating report. Please try again.');
    }
    setLoadingReport(false);
  };

  const generateRecommendations = (): string[] => {
    const recommendations: string[] = [];

    if (painLevel >= 8) {
      recommendations.push('🚨 HIGH PRIORITY: Seek immediate medical attention');
    } else if (painLevel >= 6) {
      recommendations.push('⚠️ MODERATE PRIORITY: Consider seeing a healthcare provider today');
    } else if (painLevel >= 4) {
      recommendations.push('📅 Schedule a healthcare appointment within a few days');
    }

    if (painDuration === 'chronic' || painDuration === 'months') {
      recommendations.push('📋 Document patterns and triggers for healthcare provider');
    }

    if (selectedZones.includes('chest')) {
      recommendations.push('🫀 Chest pain requires immediate medical evaluation');
    }

    if (selectedZones.includes('head') && painLevel >= 6) {
      recommendations.push('🧠 Severe headache may need urgent care');
    }

    if (additionalSymptoms.includes('Numbness') || additionalSymptoms.includes('Tingling')) {
      recommendations.push('🩺 Neurological symptoms should be evaluated by a doctor');
    }

    if (recommendations.length === 0) {
      recommendations.push('✅ Monitor symptoms and rest as needed');
      recommendations.push('🏥 Visit clinic if symptoms worsen or persist');
    }

    return recommendations;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-6">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            🗺️ Body Pain Mapping
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Use our interactive body map to visualize and document your pain. 
            This helps healthcare providers understand your symptoms better.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Body Mapping Canvas */}
          <div>
            <BodyMappingCanvas 
              onBodyZoneSelect={handleZoneSelect}
              selectedZones={selectedZones}
            />
          </div>

          {/* Pain Details Form */}
          <div className="space-y-6">
            {/* Pain Level */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                😣 Pain Level
              </h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600 dark:text-gray-400">No pain</span>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={painLevel}
                    onChange={(e) => setPainLevel(Number(e.target.value))}
                    className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Worst pain</span>
                </div>
                <div className="text-center">
                  <span className={`text-2xl font-bold ${
                    painLevel <= 3 ? 'text-green-600' :
                    painLevel <= 6 ? 'text-yellow-600' :
                    'text-red-600'
                  }`}>
                    {painLevel}/10
                  </span>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {painLevel <= 3 ? 'Mild pain' :
                     painLevel <= 6 ? 'Moderate pain' :
                     'Severe pain'}
                  </p>
                </div>
              </div>
            </div>

            {/* Pain Duration */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                ⏰ How long have you had this pain?
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {painDurations.map(duration => (
                  <button
                    key={duration.value}
                    onClick={() => setPainDuration(duration.value)}
                    className={`p-3 rounded-lg text-sm font-medium transition-colors ${
                      painDuration === duration.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {duration.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Additional Symptoms */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                🩺 Additional Symptoms
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {commonSymptoms.map(symptom => (
                  <button
                    key={symptom}
                    onClick={() => handleSymptomToggle(symptom)}
                    className={`p-2 rounded-lg text-sm font-medium transition-colors ${
                      additionalSymptoms.includes(symptom)
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {symptom}
                  </button>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                📝 Additional Notes
              </h3>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Describe when the pain started, what makes it better/worse, any triggers..."
                className="w-full h-24 p-3 border border-gray-300 dark:border-gray-600 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Generate Report & AI First Aid */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Pain Assessment Summary
              </h3>
              <button
                onClick={generateReport}
                disabled={selectedZones.length === 0 || loadingReport}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors mb-4"
              >
                {loadingReport ? 'Generating Report...' : 'Generate First Aid & Download'}
              </button>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                The report will be downloaded and can be shared with healthcare providers
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BodyMappingPage;