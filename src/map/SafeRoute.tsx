import React, { useState, useEffect } from 'react';
import { UnsafeZone } from '../types';
import { UserLocation, GeolocationService } from './GeolocationService';
import { DataProvider } from '../data/DataProviders';

interface SafeRouteProps {
  userLocation: UserLocation | null;
  onSafeRouteToggle: (enabled: boolean) => void;
  className?: string;
}

interface RouteWarning {
  zone: UnsafeZone;
  distance: number;
  severity: 'low' | 'medium' | 'high';
}

export const SafeRouteToggle: React.FC<SafeRouteProps> = ({
  userLocation,
  onSafeRouteToggle,
  className = ''
}) => {
  const [safeRouteEnabled, setSafeRouteEnabled] = useState(false);
  const [unsafeZones, setUnsafeZones] = useState<UnsafeZone[]>([]);
  const [warnings, setWarnings] = useState<RouteWarning[]>([]);
  const [loading, setLoading] = useState(false);

  // Load unsafe zones on component mount
  useEffect(() => {
    const loadUnsafeZones = async () => {
      try {
        setLoading(true);
        const zones = await DataProvider.getUnsafeZones();
        setUnsafeZones(zones);
      } catch (error) {
        console.error('Failed to load unsafe zones:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUnsafeZones();
  }, []);

  // Check for nearby unsafe zones when user location changes
  useEffect(() => {
    if (!userLocation || !safeRouteEnabled) {
      setWarnings([]);
      return;
    }

    const checkNearbyZones = () => {
      const nearbyWarnings: RouteWarning[] = [];
      const warningRadius = 1; // 1km warning radius

      unsafeZones.forEach(zone => {
        const distance = GeolocationService.calculateDistance(
          userLocation.lat,
          userLocation.lng,
          zone.lat,
          zone.lng
        );

        // Check if user is within warning radius of unsafe zone
        if (distance <= warningRadius) {
          nearbyWarnings.push({
            zone,
            distance,
            severity: zone.severity
          });
        }
      });

      // Sort by distance and severity
      nearbyWarnings.sort((a, b) => {
        const severityWeight = { high: 3, medium: 2, low: 1 };
        const severityDiff = severityWeight[b.severity] - severityWeight[a.severity];
        return severityDiff !== 0 ? severityDiff : a.distance - b.distance;
      });

      setWarnings(nearbyWarnings);
    };

    checkNearbyZones();
  }, [userLocation, safeRouteEnabled, unsafeZones]);

  const handleToggle = () => {
    const newState = !safeRouteEnabled;
    setSafeRouteEnabled(newState);
    onSafeRouteToggle(newState);
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200';
      case 'medium': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'low': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getSeverityIcon = (severity: string): string => {
    switch (severity) {
      case 'high': return '🚨';
      case 'medium': return '⚠️';
      case 'low': return '⚡';
      default: return '📍';
    }
  };

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 ${className}`}>
      {/* Toggle Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Safe Route Mode
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Highlight unsafe areas and get warnings
          </p>
        </div>
        
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={safeRouteEnabled}
            onChange={handleToggle}
            className="sr-only peer"
            disabled={loading}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
        </label>
      </div>

      {/* Status Indicators */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <div className="flex items-center">
            <span className="text-2xl mr-2">🛡️</span>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Protection
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {safeRouteEnabled ? 'Active' : 'Inactive'}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
          <div className="flex items-center">
            <span className="text-2xl mr-2">📍</span>
            <div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                Zones Tracked
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                {loading ? '...' : unsafeZones.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Warnings */}
      {safeRouteEnabled && warnings.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-2">
            ⚠️ Active Warnings
          </h4>
          <div className="space-y-2">
            {warnings.slice(0, 3).map((warning) => (
              <div
                key={warning.zone.id}
                className={`p-3 rounded-lg border ${getSeverityColor(warning.severity)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <span className="text-lg mr-2">
                      {getSeverityIcon(warning.severity)}
                    </span>
                    <div>
                      <p className="text-sm font-medium capitalize">
                        {warning.severity} Risk Zone
                      </p>
                      <p className="text-xs">
                        {GeolocationService.formatDistance(warning.distance)} away
                      </p>
                      {warning.zone.description && (
                        <p className="text-xs mt-1 opacity-75">
                          {warning.zone.description}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {warnings.length > 3 && (
              <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                +{warnings.length - 3} more warnings
              </p>
            )}
          </div>
        </div>
      )}

      {/* No Location Warning */}
      {safeRouteEnabled && !userLocation && (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mb-4">
          <div className="flex items-center">
            <span className="text-yellow-600 dark:text-yellow-400 mr-2">📍</span>
            <div>
              <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Location Required
              </p>
              <p className="text-xs text-yellow-700 dark:text-yellow-300">
                Enable location access to receive safety warnings
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Safe Route Features */}
      {safeRouteEnabled && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
          <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-200 mb-2">
            🛡️ Safe Route Features
          </h4>
          <ul className="text-xs text-blue-700 dark:text-blue-300 space-y-1">
            <li>• Real-time unsafe zone monitoring</li>
            <li>• Alternative route suggestions</li>
            <li>• Community-reported hazards</li>
            <li>• Emergency contact integration</li>
          </ul>
        </div>
      )}

      {/* Quick Actions */}
      {safeRouteEnabled && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg flex items-center justify-center">
            <span className="mr-1">📞</span>
            Emergency
          </button>
          <button className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white text-sm rounded-lg flex items-center justify-center">
            <span className="mr-1">📍</span>
            Report Issue
          </button>
        </div>
      )}
    </div>
  );
};

export default SafeRouteToggle;