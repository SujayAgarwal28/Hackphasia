export interface UserLocation {
  lat: number;
  lng: number;
  accuracy?: number;
  timestamp: number;
}

export interface LocationError {
  code: number;
  message: string;
}

export class GeolocationService {
  private static lastKnownLocation: UserLocation | null = null;
  private static watchId: number | null = null;

  // Get current user location
  static async getCurrentLocation(timeout = 10000): Promise<UserLocation> {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout,
        maximumAge: 5 * 60 * 1000 // 5 minutes
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location: UserLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: Date.now()
          };
          this.lastKnownLocation = location;
          resolve(location);
        },
        (error) => {
          const locationError: LocationError = {
            code: error.code,
            message: this.getErrorMessage(error)
          };
          reject(locationError);
        },
        options
      );
    });
  }

  // Watch user location for continuous updates
  static watchLocation(
    onUpdate: (location: UserLocation) => void,
    onError: (error: LocationError) => void
  ): number | null {
    if (!navigator.geolocation) {
      onError({
        code: -1,
        message: 'Geolocation is not supported by this browser'
      });
      return null;
    }

    const options: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 30000,
      maximumAge: 1 * 60 * 1000 // 1 minute
    };

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const location: UserLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: Date.now()
        };
        this.lastKnownLocation = location;
        onUpdate(location);
      },
      (error) => {
        const locationError: LocationError = {
          code: error.code,
          message: this.getErrorMessage(error)
        };
        onError(locationError);
      },
      options
    );

    return this.watchId;
  }

  // Stop watching location
  static stopWatching(): void {
    if (this.watchId !== null && navigator.geolocation) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  // Get last known location (cached)
  static getLastKnownLocation(): UserLocation | null {
    return this.lastKnownLocation;
  }

  // Calculate distance between two points using Haversine formula
  static calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLng = this.toRadians(lng2 - lng1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  }

  // Calculate bearing from point A to point B
  static calculateBearing(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const dLng = this.toRadians(lng2 - lng1);
    const lat1Rad = this.toRadians(lat1);
    const lat2Rad = this.toRadians(lat2);

    const y = Math.sin(dLng) * Math.cos(lat2Rad);
    const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - 
              Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLng);

    const bearingRad = Math.atan2(y, x);
    return (this.toDegrees(bearingRad) + 360) % 360;
  }

  // Check if location is within radius of a point
  static isWithinRadius(
    userLat: number,
    userLng: number,
    targetLat: number,
    targetLng: number,
    radiusKm: number
  ): boolean {
    const distance = this.calculateDistance(userLat, userLng, targetLat, targetLng);
    return distance <= radiusKm;
  }

  // Find nearest points from user location
  static findNearest<T extends { lat: number; lng: number }>(
    userLocation: UserLocation,
    points: T[],
    limit = 5
  ): Array<T & { distance: number; bearing: number }> {
    return points
      .map(point => ({
        ...point,
        distance: this.calculateDistance(
          userLocation.lat,
          userLocation.lng,
          point.lat,
          point.lng
        ),
        bearing: this.calculateBearing(
          userLocation.lat,
          userLocation.lng,
          point.lat,
          point.lng
        )
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, limit);
  }

  // Check if geolocation permission is granted
  static async checkPermission(): Promise<PermissionState> {
    if ('permissions' in navigator) {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      return permission.state;
    }
    return 'prompt'; // Default if permissions API not available
  }

  // Request geolocation permission
  static async requestPermission(): Promise<boolean> {
    try {
      await this.getCurrentLocation(5000);
      return true;
    } catch (error) {
      return false;
    }
  }

  // Get user-friendly error message
  private static getErrorMessage(error: GeolocationPositionError): string {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        return 'Location access denied by user';
      case error.POSITION_UNAVAILABLE:
        return 'Location information is unavailable';
      case error.TIMEOUT:
        return 'Location request timed out';
      default:
        return 'Unknown location error occurred';
    }
  }

  // Helper methods
  private static toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private static toDegrees(radians: number): number {
    return radians * (180 / Math.PI);
  }

  // Format distance for display
  static formatDistance(distanceKm: number): string {
    if (distanceKm < 1) {
      return `${Math.round(distanceKm * 1000)}m`;
    }
    return `${distanceKm.toFixed(1)}km`;
  }

  // Get compass direction from bearing
  static getCompassDirection(bearing: number): string {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(bearing / 45) % 8;
    return directions[index];
  }
}

export default GeolocationService;