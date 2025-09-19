import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon, LatLngBounds } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Clinic } from '../types';
import { UserLocation, GeolocationService } from './GeolocationService';
import { DataProvider } from '../data/DataProviders';

// Fix for default markers in react-leaflet
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const userIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="8" fill="#3B82F6" stroke="#1E40AF" stroke-width="2"/>
      <circle cx="12" cy="12" r="3" fill="white"/>
    </svg>
  `),
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  popupAnchor: [0, -12],
});

const clinicIcon = new Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 14.5v-5c0-1.1-.9-2-2-2h-2V6a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v1.5H7c-1.1 0-2 .9-2 2v5c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2z" fill="#EF4444"/>
      <path d="M12 8v8M8 12h8" stroke="white" stroke-width="2" stroke-linecap="round"/>
    </svg>
  `),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

interface ClinicMapProps {
  selectedClinic?: string | null;
  onClinicSelect?: (clinic: Clinic) => void;
  className?: string;
}

// Component to fit map bounds to show all markers
const MapBoundsController: React.FC<{
  clinics: Clinic[];
  userLocation: UserLocation | null;
}> = ({ clinics, userLocation }) => {
  const map = useMap();

  useEffect(() => {
    const points: [number, number][] = [];

    // Add clinic positions
    clinics.forEach(clinic => {
      points.push([clinic.lat, clinic.lng]);
    });

    // Add user location if available
    if (userLocation) {
      points.push([userLocation.lat, userLocation.lng]);
    }

    if (points.length > 0) {
      const bounds = new LatLngBounds(points);
      map.fitBounds(bounds, { padding: [20, 20], maxZoom: 15 });
    }
  }, [map, clinics, userLocation]);

  return null;
};

export const ClinicMap: React.FC<ClinicMapProps> = ({
  selectedClinic = null,
  onClinicSelect,
  className = ''
}) => {
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationPermission, setLocationPermission] = useState<PermissionState>('prompt');
  const mapRef = useRef<any>(null);

  // Load data on component mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const clinicsData = await DataProvider.getClinics();
        setClinics(clinicsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load map data');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Request user location
  useEffect(() => {
    const requestLocation = async () => {
      try {
        const permission = await GeolocationService.checkPermission();
        setLocationPermission(permission);

        if (permission === 'granted' || permission === 'prompt') {
          const location = await GeolocationService.getCurrentLocation();
          setUserLocation(location);
        }
      } catch (err) {
        console.warn('Failed to get user location:', err);
      }
    };

    requestLocation();
  }, []);

  const handleLocationRequest = async () => {
    try {
      const success = await GeolocationService.requestPermission();
      if (success) {
        const location = await GeolocationService.getCurrentLocation();
        setUserLocation(location);
        setLocationPermission('granted');
      }
    } catch (err) {
      setError('Failed to get your location. Please check your browser settings.');
    }
  };

  const handleClinicClick = (clinic: Clinic) => {
    if (onClinicSelect) {
      onClinicSelect(clinic);
    }
  };

  const getServicesBadgeColor = (services: string[]): string => {
    if (services.includes('Emergency')) return 'bg-red-500';
    if (services.includes('Mental Health')) return 'bg-blue-500';
    if (services.includes('General')) return 'bg-green-500';
    return 'bg-gray-500';
  };

  const defaultCenter: [number, number] = [39.9334, 32.8597]; // Ankara, Turkey

  if (loading) {
    return (
      <div className={`flex items-center justify-center h-96 bg-gray-100 dark:bg-gray-800 rounded-lg ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading map...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center h-96 bg-gray-100 dark:bg-gray-800 rounded-lg ${className}`}>
        <div className="text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Location permission banner */}
      {locationPermission !== 'granted' && (
        <div className="absolute top-4 left-4 right-4 z-[1000] bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-blue-600 dark:text-blue-400 mr-2">📍</span>
              <span className="text-blue-800 dark:text-blue-200 text-sm">
                Enable location to find nearby clinics
              </span>
            </div>
            <button
              onClick={handleLocationRequest}
              className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded"
            >
              Allow
            </button>
          </div>
        </div>
      )}

      {/* Map container */}
      <MapContainer
        center={userLocation ? [userLocation.lat, userLocation.lng] : defaultCenter}
        zoom={userLocation ? 13 : 10}
        style={{ height: '500px', width: '100%' }}
        className="rounded-lg"
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Auto-fit bounds to show all markers */}
        <MapBoundsController clinics={clinics} userLocation={userLocation} />

        {/* User location marker */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userIcon}>
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-blue-600">Your Location</h3>
                <p className="text-sm text-gray-600">
                  Accuracy: ±{userLocation.accuracy?.toFixed(0) || 'Unknown'}m
                </p>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Clinic markers */}
        {clinics.map((clinic) => (
          <Marker
            key={clinic.id}
            position={[clinic.lat, clinic.lng]}
            icon={clinicIcon}
            eventHandlers={{
              click: () => handleClinicClick(clinic)
            }}
          >
            <Popup>
              <div className="p-3 max-w-xs">
                <h3 className="font-semibold text-gray-900 mb-2">{clinic.name}</h3>
                
                {clinic.address && (
                  <p className="text-sm text-gray-600 mb-2">{clinic.address}</p>
                )}

                {clinic.phone && (
                  <p className="text-sm text-gray-600 mb-2">
                    📞 <a href={`tel:${clinic.phone}`} className="text-blue-600 hover:underline">
                      {clinic.phone}
                    </a>
                  </p>
                )}

                {clinic.hours && (
                  <p className="text-sm text-gray-600 mb-3">🕒 {clinic.hours}</p>
                )}

                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-700 mb-1">Services:</p>
                  <div className="flex flex-wrap gap-1">
                    {clinic.services.map((service, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 text-xs text-white rounded ${getServicesBadgeColor(clinic.services)}`}
                      >
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                {userLocation && (
                  <div className="text-sm text-gray-600">
                    <p>
                      📍 {GeolocationService.formatDistance(
                        GeolocationService.calculateDistance(
                          userLocation.lat,
                          userLocation.lng,
                          clinic.lat,
                          clinic.lng
                        )
                      )} away
                    </p>
                  </div>
                )}

                <button
                  onClick={() => handleClinicClick(clinic)}
                  className="w-full mt-2 px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded"
                >
                  Get Directions
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map legend */}
      <div className="absolute bottom-4 right-4 z-[1000] bg-white dark:bg-gray-800 rounded-lg shadow-lg p-3">
        <h4 className="font-semibold text-gray-900 dark:text-white text-sm mb-2">Legend</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
            <span className="text-gray-600 dark:text-gray-300">Your Location</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 mr-2"></div>
            <span className="text-gray-600 dark:text-gray-300">Health Clinic</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClinicMap;