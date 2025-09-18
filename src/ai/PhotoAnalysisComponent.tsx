import { useState, useRef, useCallback } from 'react';
import Webcam from 'react-webcam';
import ComputerVisionHealthService, { VisualSymptomAnalysis, PhotoAnalysisRequest } from '../ai/ComputerVisionHealthService';

interface PhotoAnalysisComponentProps {
  onAnalysisComplete: (analysis: VisualSymptomAnalysis) => void;
}

const PhotoAnalysisComponent = ({ onAnalysisComplete }: PhotoAnalysisComponentProps) => {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisType, setAnalysisType] = useState<'skin' | 'wound' | 'general' | 'nutrition' | 'all'>('all');
  const [showCamera, setShowCamera] = useState(false);
  const [analysis, setAnalysis] = useState<VisualSymptomAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const webcamRef = useRef<Webcam>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cvService = useRef(new ComputerVisionHealthService());

  const capture = useCallback(() => {
    if (webcamRef.current) {
      const imageSrc = webcamRef.current.getScreenshot();
      if (imageSrc) {
        setCapturedImage(imageSrc);
        setShowCamera(false);
      }
    }
  }, []);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setCapturedImage(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const analyzeImage = async () => {
    if (!capturedImage) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const request: PhotoAnalysisRequest = {
        imageData: capturedImage,
        analysisType,
        bodyRegion: 'unspecified',
        symptoms: []
      };

      const result = await cvService.current.analyzeHealthPhoto(request);
      setAnalysis(result);
      onAnalysisComplete(result);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Analysis failed';
      setError(errorMessage);
      console.error('Image analysis error:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetAnalysis = () => {
    setCapturedImage(null);
    setAnalysis(null);
    setError(null);
    setShowCamera(false);
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
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          📸 AI Photo Analysis
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Upload or take a photo for AI-powered health analysis using computer vision
        </p>
      </div>

      {/* Analysis Type Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Analysis Type:
        </label>
        <select
          value={analysisType}
          onChange={(e) => setAnalysisType(e.target.value as any)}
          className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="all">🔍 Comprehensive Analysis</option>
          <option value="skin">🔬 Skin Conditions</option>
          <option value="wound">🩹 Wound Assessment</option>
          <option value="nutrition">🥗 Nutritional Signs</option>
          <option value="general">👤 General Health</option>
        </select>
      </div>

      {!capturedImage && !showCamera && (
        <div className="space-y-4">
          {/* Camera Option */}
          <button
            onClick={() => setShowCamera(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            <span className="mr-2">📷</span>
            Take Photo with Camera
          </button>

          {/* File Upload Option */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
          >
            <span className="mr-2">📁</span>
            Upload Photo from Device
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      )}

      {/* Camera View */}
      {showCamera && (
        <div className="space-y-4">
          <div className="relative">
            <Webcam
              ref={webcamRef}
              audio={false}
              height={300}
              width="100%"
              screenshotFormat="image/jpeg"
              className="rounded-lg"
            />
            <div className="absolute inset-0 border-2 border-dashed border-blue-400 rounded-lg pointer-events-none flex items-center justify-center">
              <div className="bg-black bg-opacity-50 text-white px-3 py-1 rounded text-sm">
                Position the area you want to analyze
              </div>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <button
              onClick={capture}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              📸 Capture Photo
            </button>
            <button
              onClick={() => setShowCamera(false)}
              className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Captured Image */}
      {capturedImage && !analysis && (
        <div className="space-y-4">
          <div className="relative">
            <img
              src={capturedImage}
              alt="Captured for analysis"
              className="w-full max-h-64 object-cover rounded-lg"
            />
            <div className="absolute top-2 right-2">
              <button
                onClick={resetAnalysis}
                className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={analyzeImage}
              disabled={isAnalyzing}
              className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              {isAnalyzing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Analyzing...
                </>
              ) : (
                <>
                  <span className="mr-2">🤖</span>
                  Analyze with AI
                </>
              )}
            </button>
            <button
              onClick={resetAnalysis}
              className="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              New Photo
            </button>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-red-800 dark:text-red-200 text-sm">
            <strong>Analysis Error:</strong> {error}
          </p>
        </div>
      )}

      {/* Analysis Results */}
      {analysis && (
        <div className="space-y-6">
          {/* Image with overlay */}
          <div className="relative">
            <img
              src={capturedImage!}
              alt="Analyzed image"
              className="w-full max-h-64 object-cover rounded-lg"
            />
            
            {/* Overlay detected areas */}
            {analysis.skinConditions.map((condition, index) => (
              <div
                key={index}
                className="absolute border-2 border-red-500 bg-red-500 bg-opacity-20"
                style={{
                  left: `${(condition.location.x / 400) * 100}%`,
                  top: `${(condition.location.y / 300) * 100}%`,
                  width: `${(condition.location.width / 400) * 100}%`,
                  height: `${(condition.location.height / 300) * 100}%`,
                }}
              >
                <div className="absolute -top-6 left-0 bg-red-500 text-white text-xs px-2 py-1 rounded">
                  {condition.condition}
                </div>
              </div>
            ))}
          </div>

          {/* Analysis Summary */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-gray-900 dark:text-white">Analysis Summary</h4>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getUrgencyColor(analysis.urgency)}`}>
                  {analysis.urgency.toUpperCase()}
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {Math.round(analysis.confidence * 100)}% confidence
                </span>
              </div>
            </div>

            {/* Skin Conditions */}
            {analysis.skinConditions.length > 0 && (
              <div className="mb-4">
                <h5 className="font-medium text-gray-900 dark:text-white mb-2">🔬 Detected Conditions:</h5>
                {analysis.skinConditions.map((condition, index) => (
                  <div key={index} className="mb-3 p-3 bg-white dark:bg-gray-800 rounded border">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-medium text-gray-900 dark:text-white">{condition.condition}</span>
                      <span className={`px-2 py-1 rounded text-xs ${
                        condition.severity === 'mild' ? 'bg-green-100 text-green-800' :
                        condition.severity === 'moderate' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {condition.severity}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <strong>Recommendations:</strong>
                      <ul className="list-disc list-inside mt-1">
                        {condition.recommendations.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Wound Assessment */}
            {analysis.woundAssessment && (
              <div className="mb-4">
                <h5 className="font-medium text-gray-900 dark:text-white mb-2">🩹 Wound Assessment:</h5>
                <div className="p-3 bg-white dark:bg-gray-800 rounded border">
                  <div className="grid grid-cols-2 gap-2 text-sm mb-3">
                    <div><strong>Type:</strong> {analysis.woundAssessment.type}</div>
                    <div><strong>Severity:</strong> {analysis.woundAssessment.severity}</div>
                    <div><strong>Size:</strong> {analysis.woundAssessment.size.width}×{analysis.woundAssessment.size.height}mm</div>
                    <div><strong>Stage:</strong> {analysis.woundAssessment.healingStage}</div>
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    <strong>First Aid Steps:</strong>
                    <ol className="list-decimal list-inside mt-1">
                      {analysis.woundAssessment.firstAidSteps.map((step, i) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ol>
                  </div>
                </div>
              </div>
            )}

            {/* General Recommendations */}
            <div>
              <h5 className="font-medium text-gray-900 dark:text-white mb-2">💡 Recommendations:</h5>
              <ul className="list-disc list-inside text-sm text-gray-600 dark:text-gray-400 space-y-1">
                {analysis.recommendations.map((rec, index) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-3">
            <button
              onClick={resetAnalysis}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              📸 Analyze Another Photo
            </button>
            <button
              onClick={() => {
                // Generate report functionality
                const reportData = {
                  timestamp: new Date().toISOString(),
                  analysisType,
                  results: analysis
                };
                console.log('Analysis Report:', reportData);
                alert('Analysis report generated! Check console for details.');
              }}
              className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              📄 Save Report
            </button>
          </div>
        </div>
      )}

      {/* Educational Info */}
      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
        <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">📚 How AI Analysis Works:</h4>
        <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1">
          <li>• Computer vision algorithms analyze visual patterns in your photo</li>
          <li>• AI models trained on medical imagery identify potential health concerns</li>
          <li>• Results are recommendations only - always consult healthcare providers</li>
          <li>• Photos are processed locally for privacy and are not stored</li>
        </ul>
      </div>
    </div>
  );
};

export default PhotoAnalysisComponent;