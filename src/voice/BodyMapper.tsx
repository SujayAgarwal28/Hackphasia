import React, { useRef, useEffect, useState } from 'react';

export interface BodyRegion {
  id: string;
  name: string;
  anatomicalPart: string;
  x: number;
  y: number;
  width: number;
  height: number;
  shape: 'rect' | 'circle' | 'ellipse';
  relatedSymptoms: string[];
  exerciseRecommendations: string[];
  urgencyFactors: string[];
}

export interface PainAssessment {
  region: BodyRegion;
  painLevel: number; // 1-10 scale
  description: string;
  duration: string;
  type: 'sharp' | 'dull' | 'throbbing' | 'burning' | 'cramping' | 'stabbing';
}

interface BodyMapperProps {
  onRegionSelect: (assessment: PainAssessment) => void;
  selectedRegions: PainAssessment[];
}

// Comprehensive body regions with accurate anatomical mapping
const BODY_REGIONS: BodyRegion[] = [
  // Head and Neck
  {
    id: 'head-front',
    name: 'Forehead/Temple',
    anatomicalPart: 'Head',
    x: 45, y: 5, width: 10, height: 8,
    shape: 'ellipse',
    relatedSymptoms: ['headache', 'migraine', 'tension', 'pressure'],
    exerciseRecommendations: ['neck stretches', 'relaxation techniques', 'eye exercises'],
    urgencyFactors: ['sudden severe headache', 'vision changes', 'confusion']
  },
  {
    id: 'head-back',
    name: 'Back of Head',
    anatomicalPart: 'Head',
    x: 145, y: 8, width: 10, height: 8,
    shape: 'ellipse',
    relatedSymptoms: ['headache', 'neck pain', 'tension'],
    exerciseRecommendations: ['neck stretches', 'posture correction', 'shoulder rolls'],
    urgencyFactors: ['severe head trauma', 'loss of consciousness', 'persistent vomiting']
  },
  {
    id: 'neck-front',
    name: 'Front of Neck',
    anatomicalPart: 'Neck',
    x: 48, y: 18, width: 4, height: 6,
    shape: 'rect',
    relatedSymptoms: ['sore throat', 'swallowing difficulty', 'voice changes'],
    exerciseRecommendations: ['gentle neck stretches', 'warm compress', 'hydration'],
    urgencyFactors: ['severe difficulty swallowing', 'breathing difficulty', 'high fever']
  },
  
  // Chest and Upper Body
  {
    id: 'chest-upper',
    name: 'Upper Chest',
    anatomicalPart: 'Chest',
    x: 42, y: 25, width: 16, height: 8,
    shape: 'rect',
    relatedSymptoms: ['chest pain', 'breathing difficulty', 'heart palpitations'],
    exerciseRecommendations: ['deep breathing exercises', 'gentle stretching', 'posture improvement'],
    urgencyFactors: ['severe chest pain', 'shortness of breath', 'radiating pain to arm']
  },
  {
    id: 'chest-lower',
    name: 'Lower Chest/Ribcage',
    anatomicalPart: 'Chest',
    x: 42, y: 33, width: 16, height: 6,
    shape: 'rect',
    relatedSymptoms: ['rib pain', 'breathing discomfort', 'muscle strain'],
    exerciseRecommendations: ['gentle torso stretches', 'breathing exercises', 'posture correction'],
    urgencyFactors: ['severe breathing difficulty', 'suspected fracture', 'persistent sharp pain']
  },
  
  // Arms
  {
    id: 'shoulder-left',
    name: 'Left Shoulder',
    anatomicalPart: 'Shoulder',
    x: 32, y: 28, width: 8, height: 6,
    shape: 'circle',
    relatedSymptoms: ['shoulder pain', 'stiffness', 'reduced mobility'],
    exerciseRecommendations: ['shoulder rolls', 'arm circles', 'wall push-ups', 'pendulum swings'],
    urgencyFactors: ['suspected dislocation', 'complete loss of motion', 'severe trauma']
  },
  {
    id: 'shoulder-right',
    name: 'Right Shoulder',
    anatomicalPart: 'Shoulder',
    x: 60, y: 28, width: 8, height: 6,
    shape: 'circle',
    relatedSymptoms: ['shoulder pain', 'stiffness', 'reduced mobility'],
    exerciseRecommendations: ['shoulder rolls', 'arm circles', 'wall push-ups', 'pendulum swings'],
    urgencyFactors: ['suspected dislocation', 'complete loss of motion', 'severe trauma']
  },
  {
    id: 'arm-left-upper',
    name: 'Left Upper Arm',
    anatomicalPart: 'Arm',
    x: 28, y: 35, width: 6, height: 12,
    shape: 'rect',
    relatedSymptoms: ['muscle pain', 'weakness', 'numbness'],
    exerciseRecommendations: ['arm stretches', 'light weights', 'range of motion exercises'],
    urgencyFactors: ['sudden numbness', 'severe weakness', 'suspected fracture']
  },
  {
    id: 'arm-right-upper',
    name: 'Right Upper Arm',
    anatomicalPart: 'Arm',
    x: 66, y: 35, width: 6, height: 12,
    shape: 'rect',
    relatedSymptoms: ['muscle pain', 'weakness', 'numbness'],
    exerciseRecommendations: ['arm stretches', 'light weights', 'range of motion exercises'],
    urgencyFactors: ['sudden numbness', 'severe weakness', 'suspected fracture']
  },
  
  // Abdomen
  {
    id: 'abdomen-upper',
    name: 'Upper Abdomen',
    anatomicalPart: 'Abdomen',
    x: 44, y: 42, width: 12, height: 8,
    shape: 'rect',
    relatedSymptoms: ['stomach pain', 'nausea', 'heartburn', 'indigestion'],
    exerciseRecommendations: ['gentle walking', 'deep breathing', 'avoid trigger foods'],
    urgencyFactors: ['severe abdominal pain', 'persistent vomiting', 'signs of appendicitis']
  },
  {
    id: 'abdomen-lower',
    name: 'Lower Abdomen',
    anatomicalPart: 'Abdomen',
    x: 44, y: 50, width: 12, height: 8,
    shape: 'rect',
    relatedSymptoms: ['lower abdominal pain', 'cramping', 'digestive issues'],
    exerciseRecommendations: ['gentle walking', 'heat therapy', 'hydration'],
    urgencyFactors: ['severe pain', 'appendicitis symptoms', 'internal bleeding signs']
  },
  
  // Back
  {
    id: 'back-upper',
    name: 'Upper Back',
    anatomicalPart: 'Back',
    x: 142, y: 28, width: 16, height: 12,
    shape: 'rect',
    relatedSymptoms: ['back pain', 'muscle tension', 'stiffness'],
    exerciseRecommendations: ['back stretches', 'cat-cow poses', 'posture exercises', 'shoulder blade squeezes'],
    urgencyFactors: ['severe spinal injury', 'numbness in extremities', 'loss of bladder control']
  },
  {
    id: 'back-lower',
    name: 'Lower Back',
    anatomicalPart: 'Back',
    x: 142, y: 45, width: 16, height: 15,
    shape: 'rect',
    relatedSymptoms: ['lower back pain', 'sciatica', 'muscle spasms'],
    exerciseRecommendations: ['pelvic tilts', 'knee-to-chest stretches', 'gentle twists', 'walking'],
    urgencyFactors: ['severe sciatica', 'loss of bowel/bladder control', 'progressive weakness']
  },
  
  // Legs
  {
    id: 'hip-left',
    name: 'Left Hip',
    anatomicalPart: 'Hip',
    x: 38, y: 58, width: 8, height: 6,
    shape: 'circle',
    relatedSymptoms: ['hip pain', 'stiffness', 'limited mobility'],
    exerciseRecommendations: ['hip circles', 'leg swings', 'hip flexor stretches', 'gentle squats'],
    urgencyFactors: ['suspected fracture', 'complete immobility', 'severe trauma']
  },
  {
    id: 'hip-right',
    name: 'Right Hip',
    anatomicalPart: 'Hip',
    x: 54, y: 58, width: 8, height: 6,
    shape: 'circle',
    relatedSymptoms: ['hip pain', 'stiffness', 'limited mobility'],
    exerciseRecommendations: ['hip circles', 'leg swings', 'hip flexor stretches', 'gentle squats'],
    urgencyFactors: ['suspected fracture', 'complete immobility', 'severe trauma']
  },
  {
    id: 'leg-left-upper',
    name: 'Left Thigh',
    anatomicalPart: 'Leg',
    x: 38, y: 65, width: 8, height: 15,
    shape: 'rect',
    relatedSymptoms: ['muscle pain', 'cramps', 'weakness'],
    exerciseRecommendations: ['quadriceps stretches', 'hamstring stretches', 'light walking', 'massage'],
    urgencyFactors: ['sudden severe weakness', 'suspected fracture', 'circulation problems']
  },
  {
    id: 'leg-right-upper',
    name: 'Right Thigh',
    anatomicalPart: 'Leg',
    x: 54, y: 65, width: 8, height: 15,
    shape: 'rect',
    relatedSymptoms: ['muscle pain', 'cramps', 'weakness'],
    exerciseRecommendations: ['quadriceps stretches', 'hamstring stretches', 'light walking', 'massage'],
    urgencyFactors: ['sudden severe weakness', 'suspected fracture', 'circulation problems']
  },
  {
    id: 'knee-left',
    name: 'Left Knee',
    anatomicalPart: 'Knee',
    x: 40, y: 80, width: 4, height: 4,
    shape: 'circle',
    relatedSymptoms: ['knee pain', 'swelling', 'stiffness', 'clicking'],
    exerciseRecommendations: ['gentle knee bends', 'straight leg raises', 'ice therapy', 'low-impact exercise'],
    urgencyFactors: ['suspected ligament tear', 'inability to bear weight', 'severe swelling']
  },
  {
    id: 'knee-right',
    name: 'Right Knee',
    anatomicalPart: 'Knee',
    x: 56, y: 80, width: 4, height: 4,
    shape: 'circle',
    relatedSymptoms: ['knee pain', 'swelling', 'stiffness', 'clicking'],
    exerciseRecommendations: ['gentle knee bends', 'straight leg raises', 'ice therapy', 'low-impact exercise'],
    urgencyFactors: ['suspected ligament tear', 'inability to bear weight', 'severe swelling']
  }
];

const BodyMapper: React.FC<BodyMapperProps> = ({ onRegionSelect, selectedRegions }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredRegion, setHoveredRegion] = useState<BodyRegion | null>(null);
  const [showPainModal, setShowPainModal] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<BodyRegion | null>(null);
  const [painLevel, setPainLevel] = useState(5);
  const [painType, setPainType] = useState<PainAssessment['type']>('dull');
  const [painDuration, setPainDuration] = useState('');
  const [painDescription, setPainDescription] = useState('');

  useEffect(() => {
    drawBodyMap();
  }, [hoveredRegion, selectedRegions]);

  const drawBodyMap = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw body outline (simplified front and back view)
    drawBodyOutline(ctx);

    // Draw regions
    BODY_REGIONS.forEach(region => {
      const isSelected = selectedRegions.some(sr => sr.region.id === region.id);
      const isHovered = hoveredRegion?.id === region.id;
      
      drawRegion(ctx, region, isSelected, isHovered);
    });

    // Draw legend
    drawLegend(ctx);
  };

  const drawBodyOutline = (ctx: CanvasRenderingContext2D) => {
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.fillStyle = '#f9f9f9';

    // Front view (left side)
    ctx.beginPath();
    ctx.ellipse(50, 12, 8, 10, 0, 0, 2 * Math.PI); // Head
    ctx.rect(42, 22, 16, 45); // Torso
    ctx.rect(38, 65, 8, 25); // Left leg
    ctx.rect(54, 65, 8, 25); // Right leg
    ctx.rect(28, 32, 6, 20); // Left arm
    ctx.rect(66, 32, 6, 20); // Right arm
    ctx.fill();
    ctx.stroke();

    // Back view (right side)
    ctx.beginPath();
    ctx.ellipse(150, 12, 8, 10, 0, 0, 2 * Math.PI); // Head
    ctx.rect(142, 22, 16, 45); // Torso
    ctx.rect(138, 65, 8, 25); // Left leg
    ctx.rect(154, 65, 8, 25); // Right leg
    ctx.rect(128, 32, 6, 20); // Left arm
    ctx.rect(166, 32, 6, 20); // Right arm
    ctx.fill();
    ctx.stroke();

    // Labels
    ctx.fillStyle = '#666';
    ctx.font = '14px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Front View', 50, 100);
    ctx.fillText('Back View', 150, 100);
  };

  const drawRegion = (ctx: CanvasRenderingContext2D, region: BodyRegion, isSelected: boolean, isHovered: boolean) => {
    let fillColor = 'rgba(59, 130, 246, 0.1)'; // Light blue
    let strokeColor = '#3b82f6';

    if (isSelected) {
      const assessment = selectedRegions.find(sr => sr.region.id === region.id);
      const painLevel = assessment?.painLevel || 5;
      
      // Color based on pain level
      if (painLevel <= 3) fillColor = 'rgba(34, 197, 94, 0.4)'; // Green
      else if (painLevel <= 6) fillColor = 'rgba(251, 191, 36, 0.4)'; // Yellow
      else fillColor = 'rgba(239, 68, 68, 0.4)'; // Red
      
      strokeColor = painLevel <= 3 ? '#22c55e' : painLevel <= 6 ? '#fbbf24' : '#ef4444';
    }

    if (isHovered) {
      fillColor = 'rgba(99, 102, 241, 0.3)';
      strokeColor = '#6366f1';
    }

    ctx.fillStyle = fillColor;
    ctx.strokeStyle = strokeColor;
    ctx.lineWidth = isSelected || isHovered ? 3 : 1;

    ctx.beginPath();
    if (region.shape === 'circle') {
      ctx.arc(
        region.x + region.width / 2,
        region.y + region.height / 2,
        Math.min(region.width, region.height) / 2,
        0,
        2 * Math.PI
      );
    } else if (region.shape === 'ellipse') {
      ctx.ellipse(
        region.x + region.width / 2,
        region.y + region.height / 2,
        region.width / 2,
        region.height / 2,
        0,
        0,
        2 * Math.PI
      );
    } else {
      ctx.rect(region.x, region.y, region.width, region.height);
    }
    ctx.fill();
    ctx.stroke();

    // Show pain level for selected regions
    if (isSelected) {
      const assessment = selectedRegions.find(sr => sr.region.id === region.id);
      if (assessment) {
        ctx.fillStyle = '#000';
        ctx.font = 'bold 12px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
          assessment.painLevel.toString(),
          region.x + region.width / 2,
          region.y + region.height / 2 + 4
        );
      }
    }
  };

  const drawLegend = (ctx: CanvasRenderingContext2D) => {
    const legendX = 200;
    const legendY = 20;

    ctx.fillStyle = '#333';
    ctx.font = '12px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Pain Scale:', legendX, legendY);

    // Pain scale legend
    const colors = ['#22c55e', '#fbbf24', '#ef4444'];
    const labels = ['Mild (1-3)', 'Moderate (4-6)', 'Severe (7-10)'];
    
    colors.forEach((color, index) => {
      ctx.fillStyle = color;
      ctx.fillRect(legendX, legendY + 10 + (index * 20), 15, 15);
      ctx.fillStyle = '#333';
      ctx.fillText(labels[index], legendX + 20, legendY + 22 + (index * 20));
    });
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const clickedRegion = BODY_REGIONS.find(region => {
      if (region.shape === 'circle') {
        const centerX = region.x + region.width / 2;
        const centerY = region.y + region.height / 2;
        const radius = Math.min(region.width, region.height) / 2;
        const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        return distance <= radius;
      } else {
        return x >= region.x && x <= region.x + region.width &&
               y >= region.y && y <= region.y + region.height;
      }
    });

    if (clickedRegion) {
      setSelectedRegion(clickedRegion);
      setShowPainModal(true);
    }
  };

  const handleCanvasMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const hoveredRegion = BODY_REGIONS.find(region => {
      if (region.shape === 'circle') {
        const centerX = region.x + region.width / 2;
        const centerY = region.y + region.height / 2;
        const radius = Math.min(region.width, region.height) / 2;
        const distance = Math.sqrt((x - centerX) ** 2 + (y - centerY) ** 2);
        return distance <= radius;
      } else {
        return x >= region.x && x <= region.x + region.width &&
               y >= region.y && y <= region.y + region.height;
      }
    });

    setHoveredRegion(hoveredRegion || null);
  };

  const handlePainSubmit = () => {
    if (!selectedRegion) return;

    const assessment: PainAssessment = {
      region: selectedRegion,
      painLevel,
      description: painDescription,
      duration: painDuration,
      type: painType
    };

    onRegionSelect(assessment);
    setShowPainModal(false);
    setSelectedRegion(null);
    setPainDescription('');
    setPainDuration('');
  };

  return (
    <div className="space-y-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          🎯 Draw Your Pain - Interactive Body Map
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
          Click on any body region to indicate pain or discomfort. Hover over regions to see details.
        </p>
        
        <div className="relative">
          <canvas
            ref={canvasRef}
            width={300}
            height={110}
            className="border border-gray-300 dark:border-gray-600 rounded cursor-pointer"
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
            onMouseLeave={() => setHoveredRegion(null)}
          />
          
          {hoveredRegion && (
            <div className="absolute top-2 left-2 bg-black bg-opacity-75 text-white p-2 rounded text-sm max-w-xs">
              <strong>{hoveredRegion.name}</strong>
              <div className="text-xs mt-1">
                Common symptoms: {hoveredRegion.relatedSymptoms.join(', ')}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pain Assessment Modal */}
      {showPainModal && selectedRegion && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Pain Assessment: {selectedRegion.name}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Pain Level (1-10 scale)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={painLevel}
                  onChange={(e) => setPainLevel(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Mild (1)</span>
                  <span className="font-semibold">{painLevel}</span>
                  <span>Severe (10)</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Pain Type
                </label>
                <select
                  value={painType}
                  onChange={(e) => setPainType(e.target.value as PainAssessment['type'])}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                >
                  <option value="dull">Dull/Aching</option>
                  <option value="sharp">Sharp</option>
                  <option value="throbbing">Throbbing</option>
                  <option value="burning">Burning</option>
                  <option value="cramping">Cramping</option>
                  <option value="stabbing">Stabbing</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Duration
                </label>
                <select
                  value={painDuration}
                  onChange={(e) => setPainDuration(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                >
                  <option value="">Select duration</option>
                  <option value="less-than-hour">Less than 1 hour</option>
                  <option value="few-hours">Few hours</option>
                  <option value="1-day">1 day</option>
                  <option value="few-days">Few days</option>
                  <option value="1-week">About a week</option>
                  <option value="weeks">Several weeks</option>
                  <option value="months">Months</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Additional Description (Optional)
                </label>
                <textarea
                  value={painDescription}
                  onChange={(e) => setPainDescription(e.target.value)}
                  placeholder="Describe what makes it better or worse, when it occurs, etc."
                  rows={3}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md dark:bg-gray-700 dark:text-white"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => setShowPainModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={handlePainSubmit}
                disabled={!painDuration}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white rounded-md"
              >
                Add Pain Point
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selected Regions Summary */}
      {selectedRegions.length > 0 && (
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
            Selected Pain Points ({selectedRegions.length})
          </h4>
          <div className="space-y-2">
            {selectedRegions.map((assessment, index) => (
              <div key={index} className="flex items-center justify-between bg-white dark:bg-gray-800 p-3 rounded">
                <div>
                  <span className="font-medium">{assessment.region.name}</span>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Level: {assessment.painLevel}/10 • {assessment.type} • {assessment.duration}
                  </div>
                </div>
                <button
                  onClick={() => {
                    const newRegions = selectedRegions.filter((_, i) => i !== index);
                    // This would typically call a parent function to update the list
                  }}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default BodyMapper;