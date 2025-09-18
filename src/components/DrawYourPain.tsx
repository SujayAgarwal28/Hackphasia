import { useState, useRef, useEffect } from 'react';

interface BodyZone {
  id: string;
  name: string;
  x: number;
  y: number;
  width: number;
  height: number;
  symptoms: string[];
  painLevel: number;
}

interface DrawYourPainProps {
  onBodyZoneSelect: (zone: BodyZone) => void;
  selectedZones: BodyZone[];
}

const DrawYourPain = ({ onBodyZoneSelect, selectedZones }: DrawYourPainProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bodyZones] = useState<BodyZone[]>([
    { id: 'head', name: 'Head', x: 180, y: 20, width: 80, height: 80, symptoms: [], painLevel: 0 },
    { id: 'neck', name: 'Neck', x: 190, y: 100, width: 60, height: 40, symptoms: [], painLevel: 0 },
    { id: 'chest', name: 'Chest', x: 160, y: 140, width: 120, height: 100, symptoms: [], painLevel: 0 },
    { id: 'left_arm', name: 'Left Arm', x: 100, y: 140, width: 60, height: 150, symptoms: [], painLevel: 0 },
    { id: 'right_arm', name: 'Right Arm', x: 280, y: 140, width: 60, height: 150, symptoms: [], painLevel: 0 },
    { id: 'abdomen', name: 'Abdomen', x: 170, y: 240, width: 100, height: 80, symptoms: [], painLevel: 0 },
    { id: 'back', name: 'Back', x: 170, y: 320, width: 100, height: 120, symptoms: [], painLevel: 0 },
    { id: 'left_leg', name: 'Left Leg', x: 160, y: 440, width: 50, height: 160, symptoms: [], painLevel: 0 },
    { id: 'right_leg', name: 'Right Leg', x: 230, y: 440, width: 50, height: 160, symptoms: [], painLevel: 0 },
  ]);

  const [selectedZone, setSelectedZone] = useState<BodyZone | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    drawBody();
  }, [selectedZones]);

  const drawBody = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw simple body outline
    ctx.strokeStyle = '#374151';
    ctx.lineWidth = 2;
    ctx.fillStyle = '#F3F4F6';

    // Head
    ctx.beginPath();
    ctx.arc(220, 60, 40, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // Body
    ctx.fillRect(180, 100, 80, 40); // neck
    ctx.strokeRect(180, 100, 80, 40);
    
    ctx.fillRect(160, 140, 120, 100); // chest
    ctx.strokeRect(160, 140, 120, 100);
    
    ctx.fillRect(170, 240, 100, 80); // abdomen
    ctx.strokeRect(170, 240, 100, 80);

    // Arms
    ctx.fillRect(100, 140, 60, 150); // left arm
    ctx.strokeRect(100, 140, 60, 150);
    
    ctx.fillRect(280, 140, 60, 150); // right arm
    ctx.strokeRect(280, 140, 60, 150);

    // Legs
    ctx.fillRect(160, 320, 50, 280); // left leg
    ctx.strokeRect(160, 320, 50, 280);
    
    ctx.fillRect(230, 320, 50, 280); // right leg
    ctx.strokeRect(230, 320, 50, 280);

    // Draw pain indicators
    selectedZones.forEach(zone => {
      const intensity = zone.painLevel / 10;
      ctx.fillStyle = `rgba(239, 68, 68, ${intensity})`;
      ctx.fillRect(zone.x, zone.y, zone.width, zone.height);
      
      // Pain level indicator
      ctx.fillStyle = '#DC2626';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText(zone.painLevel.toString(), zone.x + zone.width/2 - 5, zone.y + zone.height/2);
    });

    // Draw zone boundaries (invisible, for click detection)
    bodyZones.forEach(zone => {
      const isSelected = selectedZones.some(sz => sz.id === zone.id);
      if (isSelected) {
        ctx.strokeStyle = '#DC2626';
        ctx.lineWidth = 3;
      } else {
        ctx.strokeStyle = 'rgba(0,0,0,0.1)';
        ctx.lineWidth = 1;
      }
      ctx.strokeRect(zone.x, zone.y, zone.width, zone.height);
    });
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Find clicked zone
    const clickedZone = bodyZones.find(zone => 
      x >= zone.x && x <= zone.x + zone.width &&
      y >= zone.y && y <= zone.y + zone.height
    );

    if (clickedZone) {
      setSelectedZone(clickedZone);
      setShowModal(true);
    }
  };

  const handleZoneConfiguration = (symptoms: string[], painLevel: number) => {
    if (!selectedZone) return;

    const updatedZone = {
      ...selectedZone,
      symptoms,
      painLevel
    };

    onBodyZoneSelect(updatedZone);
    setShowModal(false);
    setSelectedZone(null);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-semibold text-neutral-900">🎯 Draw Your Pain</h3>
          <p className="text-sm text-neutral-600">
            Click on body areas where you feel pain or discomfort. No words needed!
          </p>
        </div>
        <div className="card-body">
          <div className="flex justify-center">
            <canvas
              ref={canvasRef}
              width={440}
              height={600}
              onClick={handleCanvasClick}
              className="border border-neutral-200 rounded-lg cursor-pointer hover:border-blue-300 transition-colors"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
          
          {selectedZones.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-neutral-900 mb-2">Selected Areas:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedZones.map(zone => (
                  <span 
                    key={zone.id}
                    className="inline-flex items-center bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm"
                  >
                    {zone.name} (Pain: {zone.painLevel}/10)
                    <button
                      onClick={() => onBodyZoneSelect({ ...zone, painLevel: 0, symptoms: [] })}
                      className="ml-2 text-red-600 hover:text-red-800"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pain Configuration Modal */}
      {showModal && selectedZone && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Configure Pain in {selectedZone.name}</h3>
            
            <PainConfigurationForm
              zoneName={selectedZone.name}
              onSubmit={handleZoneConfiguration}
              onCancel={() => setShowModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

interface PainConfigurationFormProps {
  zoneName: string;
  onSubmit: (symptoms: string[], painLevel: number) => void;
  onCancel: () => void;
}

const PainConfigurationForm = ({
  zoneName,
  onSubmit,
  onCancel
}: PainConfigurationFormProps) => {
  const [painLevel, setPainLevel] = useState(5);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([]);

  const commonSymptoms = {
    'Head': ['Headache', 'Dizziness', 'Confusion', 'Memory problems'],
    'Neck': ['Stiffness', 'Sharp pain', 'Muscle tension'],
    'Chest': ['Chest pain', 'Shortness of breath', 'Heart palpitations', 'Pressure'],
    'Abdomen': ['Stomach pain', 'Nausea', 'Cramps', 'Bloating'],
    'Back': ['Lower back pain', 'Muscle spasms', 'Stiffness', 'Shooting pain'],
    'Left Arm': ['Muscle pain', 'Weakness', 'Numbness', 'Swelling'],
    'Right Arm': ['Muscle pain', 'Weakness', 'Numbness', 'Swelling'],
    'Left Leg': ['Leg pain', 'Weakness', 'Numbness', 'Swelling', 'Cramping'],
    'Right Leg': ['Leg pain', 'Weakness', 'Numbness', 'Swelling', 'Cramping']
  };

  const symptoms = commonSymptoms[zoneName as keyof typeof commonSymptoms] || ['Pain', 'Discomfort', 'Swelling', 'Weakness'];

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms(prev => 
      prev.includes(symptom) 
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom]
    );
  };

  const handleSubmit = () => {
    onSubmit(selectedSymptoms, painLevel);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          Pain Level (0-10): {painLevel}
        </label>
        <input
          type="range"
          min="0"
          max="10"
          value={painLevel}
          onChange={(e) => setPainLevel(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-neutral-500 mt-1">
          <span>No Pain</span>
          <span>Moderate</span>
          <span>Severe</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-neutral-700 mb-2">
          What does it feel like? (Select all that apply)
        </label>
        <div className="grid grid-cols-2 gap-2">
          {symptoms.map(symptom => (
            <label key={symptom} className="flex items-center">
              <input
                type="checkbox"
                checked={selectedSymptoms.includes(symptom)}
                onChange={() => toggleSymptom(symptom)}
                className="rounded border-neutral-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm">{symptom}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button onClick={handleSubmit} className="btn-primary">
          Add Pain Area
        </button>
      </div>
    </div>
  );
};

export default DrawYourPain;
export type { BodyZone };