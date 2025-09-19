import React, { useState, useEffect } from 'react';
import ClinicMap from '../map/ClinicMap';
// import SafeRouteToggle from '../map/SafeRoute';
import { GeolocationService, UserLocation } from '../map/GeolocationService';
import { Clinic } from '../types';
import { DataProvider } from '../data/DataProviders';

const MapPage: React.FC = () => {
  // const [safeRouteEnabled, setSafeRouteEnabled] = useState(false);
  const [selectedClinic, setSelectedClinic] = useState<Clinic | null>(null);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [nearbyClinics, setNearbyClinics] = useState<Clinic[]>([]);
  const [dataSource, setDataSource] = useState<'firestore' | 'mock'>('mock');

  // Get user location on component mount
  useEffect(() => {
    const getUserLocation = async () => {
      try {
        const location = await GeolocationService.getCurrentLocation();
        setUserLocation(location);
      } catch (error) {
        console.warn('Could not get user location:', error);
      }
    };

    getUserLocation();
  }, []);

  // Load nearby clinics when user location changes
  useEffect(() => {
    const loadNearbyCliics = async () => {
      try {
        const clinics = await DataProvider.getClinics();
        setDataSource(DataProvider.getDataSource());
        
        if (userLocation) {
          // Sort clinics by distance
          const clinicsWithDistance = GeolocationService.findNearest(
            userLocation,
            clinics,
            10 // Get top 10 nearest clinics
          );
          setNearbyClinics(clinicsWithDistance);
        } else {
          setNearbyClinics(clinics);
        }
      } catch (error) {
        console.error('Failed to load clinics:', error);
      }
    };

    loadNearbyCliics();
  }, [userLocation]);

  const handleClinicSelect = (clinic: Clinic) => {
    setSelectedClinic(clinic);
  };

  const handleGetDirections = (clinic: Clinic) => {
    if (userLocation) {
      const googleMapsUrl = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${clinic.lat},${clinic.lng}`;
      window.open(googleMapsUrl, '_blank');
    } else {
      const googleMapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(clinic.name)}/@${clinic.lat},${clinic.lng},15z`;
      window.open(googleMapsUrl, '_blank');
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          🏥 Find Nearby Clinics
        </h1>
        <p className="text-neutral-700 text-lg">
          Interactive map with clinic locations and safe route navigation
        </p>
        
        {/* Data source indicator */}
        <div className="mt-2 flex items-center">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            dataSource === 'firestore' 
              ? 'bg-green-100 text-green-800'
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {dataSource === 'firestore' ? '🔗 Connected to Firebase' : '💾 Using Local Data'}
          </span>
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Main Map */}
        <div className="lg:col-span-3">
          <ClinicMap
            selectedClinic={selectedClinic?.id || null}
            onClinicSelect={handleClinicSelect}
            className="h-[600px]"
          />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Safe Route Toggle */}
          {/* 
          <SafeRouteToggle
            userLocation={userLocation}
            onSafeRouteToggle={setSafeRouteEnabled}
          />
          */}

          {/* Selected Clinic Details */}
          {selectedClinic && (
            <div className="bg-white rounded-lg shadow-md p-4 border border-neutral-200">
              <h3 className="text-lg font-semibold text-neutral-900 mb-3">
                Selected Clinic
              </h3>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-neutral-900">
                    {selectedClinic.name}
                  </h4>
                  {selectedClinic.address && (
                    <p className="text-sm text-neutral-600">
                      {selectedClinic.address}
                    </p>
                  )}
                </div>

                {selectedClinic.services && (
                  <div>
                    <p className="text-sm font-medium text-neutral-700 mb-1">
                      Services:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {selectedClinic.services.map((service, index) => (
                        <span
                          key={index}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                        >
                          {service}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {selectedClinic.phone && (
                  <div>
                    <p className="text-sm font-medium text-neutral-700">Phone:</p>
                    <a
                      href={`tel:${selectedClinic.phone}`}
                      className="text-sm text-blue-600 hover:underline"
                    >
                      {selectedClinic.phone}
                    </a>
                  </div>
                )}

                {selectedClinic.hours && (
                  <div>
                    <p className="text-sm font-medium text-neutral-700">Hours:</p>
                    <p className="text-sm text-neutral-600">
                      {selectedClinic.hours}
                    </p>
                  </div>
                )}

                {userLocation && (
                  <div>
                    <p className="text-sm font-medium text-neutral-700">Distance:</p>
                    <p className="text-sm text-neutral-600">
                      {GeolocationService.formatDistance(
                        GeolocationService.calculateDistance(
                          userLocation.lat,
                          userLocation.lng,
                          selectedClinic.lat,
                          selectedClinic.lng
                        )
                      )} away
                    </p>
                  </div>
                )}

                <div className="pt-2 space-y-2">
                  <button
                    onClick={() => handleGetDirections(selectedClinic)}
                    className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg flex items-center justify-center"
                  >
                    <span className="mr-2">🗺️</span>
                    Get Directions
                  </button>
                  
                  {selectedClinic.phone && (
                    <button
                      onClick={() => window.open(`tel:${selectedClinic.phone}`)}
                      className="w-full px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg flex items-center justify-center"
                    >
                      <span className="mr-2">📞</span>
                      Call Clinic
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Nearby Clinics List */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
              {userLocation ? 'Nearby Clinics' : 'All Clinics'}
            </h3>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {nearbyClinics.slice(0, 10).map((clinic) => (
                <div
                  key={clinic.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    selectedClinic?.id === clinic.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                  onClick={() => handleClinicSelect(clinic)}
                >
                  <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                    {clinic.name}
                  </h4>
                  
                  {userLocation && 'distance' in clinic && (
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {GeolocationService.formatDistance((clinic as any).distance)} away
                    </p>
                  )}
                  
                  <div className="flex flex-wrap gap-1 mt-2">
                    {clinic.services.slice(0, 2).map((service, index) => (
                      <span
                        key={index}
                        className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                      >
                        {service}
                      </span>
                    ))}
                    {clinic.services.length > 2 && (
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        +{clinic.services.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPage;