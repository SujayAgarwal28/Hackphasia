import React, { useEffect, useRef, useState } from 'react';
import { RefugeeTicket, Hospital } from '../types/hospital';
import { GeolocationService } from '../map/GeolocationService';
import './HospitalMap.css';

interface HospitalMapProps {
  tickets: RefugeeTicket[];
  hospitals: Hospital[];
  selectedTicket?: RefugeeTicket | null;
  onTicketSelect?: (ticket: RefugeeTicket) => void;
}

interface HeatmapData {
  lat: number;
  lng: number;
  intensity: number;
  count: number;
  emergencyType: string;
}

export const HospitalMap: React.FC<HospitalMapProps> = ({
  tickets,
  hospitals,
  selectedTicket,
  onTicketSelect
}) => {
  const mapRef = useRef<HTMLCanvasElement>(null);
  const [viewMode, setViewMode] = useState<'cases' | 'heatmap' | 'coverage'>('cases');
  const [heatmapData, setHeatmapData] = useState<HeatmapData[]>([]);
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [mapBounds, setMapBounds] = useState({
    north: 13.1986,   // Bangalore North
    south: 12.8340,   // Bangalore South  
    west: 77.4606,    // Bangalore West
    east: 77.7502     // Bangalore East
  });

  useEffect(() => {
    generateHeatmapData();
  }, [tickets]);

  useEffect(() => {
    // Auto-detect user location and adjust map bounds
    detectLocationAndSetBounds();
  }, []);

  const detectLocationAndSetBounds = async () => {
    try {
      // Try to get user's current location
      const location = await GeolocationService.getCurrentLocation();
      setUserLocation(location);
      
      // Determine city/region and set appropriate bounds
      const cityBounds = getCityBounds(location.lat, location.lng);
      setMapBounds(cityBounds);
    } catch (error) {
      console.log('Location detection failed, using default Bangalore bounds');
      // Default to Bangalore if location detection fails
    }
  };

  const getCityBounds = (lat: number, lng: number) => {
    // Define bounds for major Indian cities and global fallback
    const cityData = [
      {
        name: 'Bangalore',
        center: {lat: 12.9716, lng: 77.5946},
        bounds: {north: 13.1986, south: 12.8340, west: 77.4606, east: 77.7502}
      },
      {
        name: 'Mumbai',
        center: {lat: 19.0760, lng: 72.8777},
        bounds: {north: 19.2700, south: 18.8900, west: 72.7700, east: 72.9800}
      },
      {
        name: 'Delhi',
        center: {lat: 28.6139, lng: 77.2090},
        bounds: {north: 28.8800, south: 28.4000, west: 76.8400, east: 77.3500}
      },
      {
        name: 'Chennai',
        center: {lat: 13.0827, lng: 80.2707},
        bounds: {north: 13.2500, south: 12.8300, west: 80.1000, east: 80.3500}
      }
    ];

    // Find closest city
    let closestCity = cityData[0]; // default to Bangalore
    let minDistance = Infinity;

    for (const city of cityData) {
      const distance = Math.sqrt(
        Math.pow(lat - city.center.lat, 2) + Math.pow(lng - city.center.lng, 2)
      );
      if (distance < minDistance) {
        minDistance = distance;
        closestCity = city;
      }
    }

    // If user is within 1 degree of a known city, use that city's bounds
    if (minDistance < 1.0) {
      return closestCity.bounds;
    } else {
      // Create dynamic bounds around user location
      return {
        north: lat + 0.2,
        south: lat - 0.2, 
        west: lng - 0.3,
        east: lng + 0.3
      };
    }
  };

  // Convert latitude/longitude to canvas coordinates for any location
  const latLngToCanvas = (lat: number, lng: number, canvas: HTMLCanvasElement) => {
    // Use dynamic map bounds instead of hardcoded NYC
    const bounds = mapBounds;
    
    // Convert to canvas coordinates with proper scaling
    const x = ((lng - bounds.west) / (bounds.east - bounds.west)) * canvas.width;
    const y = ((bounds.north - lat) / (bounds.north - bounds.south)) * canvas.height;
    
    return { x, y };
  };

  const generateHeatmapData = () => {
    const locationMap = new Map<string, HeatmapData>();
    
    tickets.forEach(ticket => {
      const key = `${ticket.location.lat.toFixed(3)},${ticket.location.lng.toFixed(3)}`;
      const existing = locationMap.get(key);
      
      if (existing) {
        existing.count += 1;
        existing.intensity = Math.min(10, existing.intensity + 1);
      } else {
        locationMap.set(key, {
          lat: ticket.location.lat,
          lng: ticket.location.lng,
          intensity: ticket.emergency.severity === 'critical' ? 5 : 
                   ticket.emergency.severity === 'high' ? 3 : 
                   ticket.emergency.severity === 'medium' ? 2 : 1,
          count: 1,
          emergencyType: ticket.emergency.severity
        });
      }
    });
    
    setHeatmapData(Array.from(locationMap.values()));
  };

  const drawMap = () => {
    const canvas = mapRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw base map (simplified version)
    drawBaseMap(ctx);
    
    if (viewMode === 'heatmap') {
      drawHeatmap(ctx);
    } else if (viewMode === 'cases') {
      drawCases(ctx);
    } else if (viewMode === 'coverage') {
      drawCoverage(ctx);
    }
    
    drawHospitals(ctx);
  };

  const drawBaseMap = (ctx: CanvasRenderingContext2D) => {
    const canvas = ctx.canvas;
    
    // Draw a dynamic map background based on detected location
    ctx.fillStyle = '#E8F4FD'; // Water/background color
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw land areas (simplified city layout)
    ctx.fillStyle = '#F5F5DC'; // Land color
    
    // Create a generic city layout that works for any location
    const cityAreas = [
      // Main city center
      {x: canvas.width * 0.3, y: canvas.height * 0.3, w: canvas.width * 0.4, h: canvas.height * 0.4},
      // Suburban areas
      {x: canvas.width * 0.1, y: canvas.height * 0.1, w: canvas.width * 0.25, h: canvas.height * 0.25},
      {x: canvas.width * 0.65, y: canvas.height * 0.15, w: canvas.width * 0.25, h: canvas.height * 0.3},
      {x: canvas.width * 0.15, y: canvas.height * 0.6, w: canvas.width * 0.3, h: canvas.width * 0.25},
    ];
    
    cityAreas.forEach(area => {
      ctx.fillRect(area.x, area.y, area.w, area.h);
    });
    
    // Add road network
    ctx.strokeStyle = '#CCCCCC';
    ctx.lineWidth = 1;
    
    // Major roads (horizontal)
    for (let i = 1; i <= 4; i++) {
      const y = (canvas.height / 5) * i;
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
    
    // Major roads (vertical)
    for (let i = 1; i <= 4; i++) {
      const x = (canvas.width / 5) * i;
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, canvas.height);
      ctx.stroke();
    }
    
    // Add a central landmark/park area
    ctx.fillStyle = '#228B22';
    const parkX = canvas.width * 0.4;
    const parkY = canvas.height * 0.35;
    const parkW = canvas.width * 0.2;
    const parkH = canvas.height * 0.15;
    ctx.fillRect(parkX, parkY, parkW, parkH);
    
    ctx.fillStyle = '#333333';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('City Center', parkX + parkW/2, parkY + parkH/2);
    
    // Add current location indicator if available
    if (userLocation) {
      const coords = latLngToCanvas(userLocation.lat, userLocation.lng, canvas);
      ctx.fillStyle = '#FF0000';
      ctx.beginPath();
      ctx.arc(coords.x, coords.y, 8, 0, 2 * Math.PI);
      ctx.fill();
      
      ctx.fillStyle = '#333333';
      ctx.font = '10px Arial';
      ctx.fillText('Your Location', coords.x, coords.y - 12);
    }
    
    // Add compass rose
    const compassX = canvas.width - 50;
    const compassY = 50;
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 2;
    
    // North arrow
    ctx.beginPath();
    ctx.moveTo(compassX, compassY - 15);
    ctx.lineTo(compassX - 5, compassY - 5);
    ctx.moveTo(compassX, compassY - 15);
    ctx.lineTo(compassX + 5, compassY - 5);
    ctx.stroke();
    
    ctx.fillStyle = '#333333';
    ctx.font = '10px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('N', compassX, compassY - 20);
    
    // Add scale indicator
    ctx.strokeStyle = '#333333';
    ctx.lineWidth = 2;
    const scaleX = 20;
    const scaleY = canvas.height - 30;
    ctx.beginPath();
    ctx.moveTo(scaleX, scaleY);
    ctx.lineTo(scaleX + 40, scaleY);
    ctx.stroke();
    
    ctx.fillStyle = '#333333';
    ctx.font = '10px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('5 km', scaleX, scaleY - 5);
  };

  const drawHeatmap = (ctx: CanvasRenderingContext2D) => {
    const canvas = ctx.canvas;
    
    heatmapData.forEach(point => {
      const coords = latLngToCanvas(point.lat, point.lng, canvas);
      const x = coords.x;
      const y = coords.y;
      
      const gradient = ctx.createRadialGradient(x, y, 0, x, y, 30);
      const alpha = Math.min(0.8, point.intensity / 10);
      
      if (point.emergencyType === 'critical') {
        gradient.addColorStop(0, `rgba(255, 0, 0, ${alpha})`);
        gradient.addColorStop(1, 'rgba(255, 0, 0, 0)');
      } else if (point.emergencyType === 'high') {
        gradient.addColorStop(0, `rgba(255, 165, 0, ${alpha})`);
        gradient.addColorStop(1, 'rgba(255, 165, 0, 0)');
      } else {
        gradient.addColorStop(0, `rgba(255, 255, 0, ${alpha})`);
        gradient.addColorStop(1, 'rgba(255, 255, 0, 0)');
      }
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(x, y, 30, 0, 2 * Math.PI);
      ctx.fill();
    });
  };

  const drawCases = (ctx: CanvasRenderingContext2D) => {
    const canvas = ctx.canvas;
    
    tickets.forEach(ticket => {
      const coords = latLngToCanvas(ticket.location.lat, ticket.location.lng, canvas);
      const x = coords.x;
      const y = coords.y;
      
      let color = '#4CAF50';
      let size = 6;
      
      switch (ticket.emergency.severity) {
        case 'critical':
          color = '#F44336';
          size = 10;
          break;
        case 'high':
          color = '#FF9800';
          size = 8;
          break;
        case 'medium':
          color = '#FFC107';
          size = 6;
          break;
        case 'low':
          color = '#4CAF50';
          size = 4;
          break;
      }
      
      ctx.fillStyle = color;
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      
      ctx.beginPath();
      ctx.arc(x, y, size, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
      
      if (selectedTicket?.id === ticket.id) {
        ctx.strokeStyle = '#2196F3';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(x, y, size + 5, 0, 2 * Math.PI);
        ctx.stroke();
      }
    });
  };

  const drawCoverage = (ctx: CanvasRenderingContext2D) => {
    const canvas = ctx.canvas;
    
    hospitals.forEach(hospital => {
      const coords = latLngToCanvas(hospital.coordinates.lat, hospital.coordinates.lng, canvas);
      const x = coords.x;
      const y = coords.y;
      
      // Coverage radius (simplified)
      const radius = 50; // 5km coverage area
      
      ctx.strokeStyle = 'rgba(33, 150, 243, 0.3)';
      ctx.fillStyle = 'rgba(33, 150, 243, 0.1)';
      ctx.lineWidth = 2;
      
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, 2 * Math.PI);
      ctx.fill();
      ctx.stroke();
    });
  };

  const drawHospitals = (ctx: CanvasRenderingContext2D) => {
    const canvas = ctx.canvas;
    
    hospitals.forEach(hospital => {
      const coords = latLngToCanvas(hospital.coordinates.lat, hospital.coordinates.lng, canvas);
      const x = coords.x;
      const y = coords.y;
      
      // Hospital icon
      ctx.fillStyle = '#2196F3';
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      
      // Draw hospital cross
      ctx.fillRect(x - 8, y - 3, 16, 6);
      ctx.fillRect(x - 3, y - 8, 6, 16);
      
      ctx.strokeRect(x - 8, y - 3, 16, 6);
      ctx.strokeRect(x - 3, y - 8, 6, 16);
    });
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = mapRef.current;
    if (!canvas || !onTicketSelect) return;
    
    const rect = canvas.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    
    // Find clicked ticket
    for (const ticket of tickets) {
      const coords = latLngToCanvas(ticket.location.lat, ticket.location.lng, canvas);
      const x = coords.x;
      const y = coords.y;
      
      const distance = Math.sqrt((clickX - x) ** 2 + (clickY - y) ** 2);
      if (distance <= 15) {
        onTicketSelect(ticket);
        break;
      }
    }
  };

  useEffect(() => {
    drawMap();
  }, [viewMode, tickets, hospitals, selectedTicket, heatmapData]);

  const getStatistics = () => {
    const stats = {
      total: tickets.length,
      critical: tickets.filter(t => t.emergency.severity === 'critical').length,
      high: tickets.filter(t => t.emergency.severity === 'high').length,
      medium: tickets.filter(t => t.emergency.severity === 'medium').length,
      low: tickets.filter(t => t.emergency.severity === 'low').length,
    };
    
    return stats;
  };

  const stats = getStatistics();

  return (
    <div className="hospital-map">
      <div className="map-header">
        <h3>Geographic Emergency Distribution</h3>
        <div className="map-controls">
          <button 
            className={viewMode === 'cases' ? 'active' : ''}
            onClick={() => setViewMode('cases')}
          >
            Case Locations
          </button>
          <button 
            className={viewMode === 'heatmap' ? 'active' : ''}
            onClick={() => setViewMode('heatmap')}
          >
            Heat Map
          </button>
          <button 
            className={viewMode === 'coverage' ? 'active' : ''}
            onClick={() => setViewMode('coverage')}
          >
            Hospital Coverage
          </button>
        </div>
      </div>
      
      <div className="map-container">
        <canvas
          ref={mapRef}
          width={600}
          height={400}
          onClick={handleCanvasClick}
          className="map-canvas"
        />
        
        <div className="map-legend">
          <div className="legend-section">
            <h4>Emergency Severity</h4>
            <div className="legend-item">
              <div className="legend-color critical"></div>
              <span>Critical ({stats.critical})</span>
            </div>
            <div className="legend-item">
              <div className="legend-color urgent"></div>
              <span>High ({stats.high})</span>
            </div>
            <div className="legend-item">
              <div className="legend-color moderate"></div>
              <span>Medium ({stats.medium})</span>
            </div>
            <div className="legend-item">
              <div className="legend-color minor"></div>
              <span>Low ({stats.low})</span>
            </div>
          </div>
          
          <div className="legend-section">
            <h4>Symbols</h4>
            <div className="legend-item">
              <div className="legend-symbol hospital"></div>
              <span>Hospital</span>
            </div>
            <div className="legend-item">
              <div className="legend-symbol case"></div>
              <span>Emergency Case</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="map-stats">
        <div className="stat-item">
          <span className="stat-number">{stats.total}</span>
          <span className="stat-label">Total Cases</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{hospitals.length}</span>
          <span className="stat-label">Active Hospitals</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{Math.round((stats.critical + stats.high) / stats.total * 100)}%</span>
          <span className="stat-label">High Priority</span>
        </div>
      </div>
    </div>
  );
};