import { useState, useRef, useEffect } from 'react';
import { BodyZone } from '../types';

interface BodyMappingCanvasProps {
  onBodyZoneSelect: (zones: string[]) => void;
  selectedZones?: string[];
}

const bodyZones: BodyZone[] = [
  { id: 'head', name: 'Head', coordinates: { x: 145, y: 20, width: 60, height: 60 }, commonSymptoms: ['headache', 'dizziness', 'fever'] },
  { id: 'neck', name: 'Neck', coordinates: { x: 155, y: 80, width: 40, height: 30 }, commonSymptoms: ['sore throat', 'neck pain', 'stiffness'] },
  { id: 'left-shoulder', name: 'Left Shoulder', coordinates: { x: 115, y: 110, width: 40, height: 40 }, commonSymptoms: ['shoulder pain', 'stiffness'] },
  { id: 'right-shoulder', name: 'Right Shoulder', coordinates: { x: 195, y: 110, width: 40, height: 40 }, commonSymptoms: ['shoulder pain', 'stiffness'] },
  { id: 'chest', name: 'Chest', coordinates: { x: 140, y: 110, width: 70, height: 80 }, commonSymptoms: ['chest pain', 'shortness of breath', 'cough'] },
  { id: 'left-arm', name: 'Left Arm', coordinates: { x: 80, y: 140, width: 35, height: 100 }, commonSymptoms: ['arm pain', 'numbness', 'weakness'] },
  { id: 'right-arm', name: 'Right Arm', coordinates: { x: 235, y: 140, width: 35, height: 100 }, commonSymptoms: ['arm pain', 'numbness', 'weakness'] },
  { id: 'abdomen', name: 'Abdomen', coordinates: { x: 140, y: 190, width: 70, height: 60 }, commonSymptoms: ['abdominal pain', 'nausea', 'cramping'] },
  { id: 'lower-back', name: 'Lower Back', coordinates: { x: 140, y: 250, width: 70, height: 40 }, commonSymptoms: ['back pain', 'stiffness', 'muscle spasm'] },
  { id: 'left-leg', name: 'Left Leg', coordinates: { x: 130, y: 290, width: 35, height: 120 }, commonSymptoms: ['leg pain', 'cramping', 'swelling'] },
  { id: 'right-leg', name: 'Right Leg', coordinates: { x: 185, y: 290, width: 35, height: 120 }, commonSymptoms: ['leg pain', 'cramping', 'swelling'] },
];

const BodyMappingCanvas = ({ onBodyZoneSelect, selectedZones = [] }: BodyMappingCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredZone, setHoveredZone] = useState<string | null>(null);
  const [clickedZones, setClickedZones] = useState<string[]>(selectedZones);

  useEffect(() => {
    drawBody();
  }, [hoveredZone, clickedZones]);

  const drawBody = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw body outline
    ctx.strokeStyle = '#6B7280';
    ctx.lineWidth = 2;
    ctx.fillStyle = '#F3F4F6';

    // Simple body outline
    ctx.beginPath();
    // Head (circle)
    ctx.arc(175, 50, 25, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();

    // Neck
    ctx.fillRect(165, 75, 20, 25);
    ctx.strokeRect(165, 75, 20, 25);

    // Torso
    ctx.fillRect(140, 100, 70, 120);
    ctx.strokeRect(140, 100, 70, 120);

    // Arms
    ctx.fillRect(110, 110, 30, 80);
    ctx.strokeRect(110, 110, 30, 80);
    ctx.fillRect(210, 110, 30, 80);
    ctx.strokeRect(210, 110, 30, 80);

    // Lower body
    ctx.fillRect(150, 220, 50, 60);
    ctx.strokeRect(150, 220, 50, 60);

    // Legs
    ctx.fillRect(155, 280, 20, 80);
    ctx.strokeRect(155, 280, 20, 80);
    ctx.fillRect(175, 280, 20, 80);
    ctx.strokeRect(175, 280, 20, 80);

    // Draw body zones
    bodyZones.forEach(zone => {
      const isSelected = clickedZones.includes(zone.id);
      const isHovered = hoveredZone === zone.id;

      // Set colors based on state
      if (isSelected) {
        ctx.fillStyle = 'rgba(239, 68, 68, 0.7)'; // Red for selected (pain)
        ctx.strokeStyle = '#DC2626';
      } else if (isHovered) {
        ctx.fillStyle = 'rgba(59, 130, 246, 0.5)'; // Blue for hover
        ctx.strokeStyle = '#2563EB';
      } else {
        ctx.fillStyle = 'rgba(156, 163, 175, 0.3)'; // Gray for normal
        ctx.strokeStyle = '#6B7280';
      }

      ctx.lineWidth = isSelected || isHovered ? 3 : 1;

      // Draw zone
      ctx.fillRect(zone.coordinates.x, zone.coordinates.y, zone.coordinates.width, zone.coordinates.height);
      ctx.strokeRect(zone.coordinates.x, zone.coordinates.y, zone.coordinates.width, zone.coordinates.height);

      // Add zone label for selected or hovered
      if (isSelected || isHovered) {
        ctx.fillStyle = '#374151';
        ctx.font = '12px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(
          zone.name,
          zone.coordinates.x + zone.coordinates.width / 2,
          zone.coordinates.y + zone.coordinates.height / 2 + 4
        );
      }
    });
  };

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const getZoneAtPosition = (x: number, y: number): BodyZone | null => {
    return bodyZones.find(zone => 
      x >= zone.coordinates.x &&
      x <= zone.coordinates.x + zone.coordinates.width &&
      y >= zone.coordinates.y &&
      y <= zone.coordinates.y + zone.coordinates.height
    ) || null;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);
    const zone = getZoneAtPosition(pos.x, pos.y);
    setHoveredZone(zone?.id || null);
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const pos = getMousePos(e);
    const zone = getZoneAtPosition(pos.x, pos.y);
    
    if (zone) {
      const newSelectedZones = clickedZones.includes(zone.id)
        ? clickedZones.filter(id => id !== zone.id)
        : [...clickedZones, zone.id];
      
      setClickedZones(newSelectedZones);
      onBodyZoneSelect(newSelectedZones);
    }
  };

  const clearSelection = () => {
    setClickedZones([]);
    onBodyZoneSelect([]);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
          👤 Draw Your Pain
        </h3>
        <p className="text-gray-600 dark:text-gray-300">
          Click on body areas where you feel pain or discomfort
        </p>
      </div>

      <div className="flex justify-center mb-4">
        <canvas
          ref={canvasRef}
          width={350}
          height={420}
          className="border border-gray-300 dark:border-gray-600 rounded-lg cursor-pointer"
          onMouseMove={handleMouseMove}
          onClick={handleClick}
          onMouseLeave={() => setHoveredZone(null)}
        />
      </div>

      {clickedZones.length > 0 && (
        <div className="mb-4">
          <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
            Selected Pain Areas:
          </h4>
          <div className="flex flex-wrap gap-2 mb-3">
            {clickedZones.map(zoneId => {
              const zone = bodyZones.find(z => z.id === zoneId);
              return zone ? (
                <span
                  key={zoneId}
                  className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-full text-sm flex items-center"
                >
                  {zone.name}
                  <button
                    onClick={() => {
                      const newZones = clickedZones.filter(id => id !== zoneId);
                      setClickedZones(newZones);
                      onBodyZoneSelect(newZones);
                    }}
                    className="ml-2 text-red-600 hover:text-red-800"
                  >
                    ×
                  </button>
                </span>
              ) : null;
            })}
          </div>
          
          <button
            onClick={clearSelection}
            className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg text-sm transition-colors"
          >
            Clear All
          </button>
        </div>
      )}

      {hoveredZone && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <p className="text-blue-800 dark:text-blue-200 text-sm">
            <strong>Hovering:</strong> {bodyZones.find(z => z.id === hoveredZone)?.name}
          </p>
          <p className="text-blue-700 dark:text-blue-300 text-xs mt-1">
            Common symptoms: {bodyZones.find(z => z.id === hoveredZone)?.commonSymptoms.join(', ')}
          </p>
        </div>
      )}

      <div className="mt-4 text-xs text-gray-500 dark:text-gray-400">
        <p>💡 Tip: Click multiple areas to map all your pain points. This helps provide better health assessment.</p>
      </div>
    </div>
  );
};

export default BodyMappingCanvas;