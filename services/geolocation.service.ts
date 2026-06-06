/**
 * Geolocation Service
 * Production-grade geolocation tracking with error handling and persistence
 */

export interface Coordinates {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: number;
}

export interface GeolocationConfig {
  enableHighAccuracy: boolean;
  maximumAge: number;
  timeout: number;
}

export type GeolocationCallback = (coords: Coordinates) => void;
export type GeolocationErrorCallback = (error: GeolocationPositionError) => void;

class GeolocationService {
  private watchId: number | null = null;
  private currentPosition: Coordinates | null = null;
  private listeners: Set<GeolocationCallback> = new Set();
  private errorListeners: Set<GeolocationErrorCallback> = new Set();

  private readonly defaultConfig: GeolocationConfig = {
    enableHighAccuracy: true,
    maximumAge: 10000, // 10 seconds
    timeout: 15000, // 15 seconds
  };

  /**
   * Check if geolocation is supported by the browser
   */
  public isSupported(): boolean {
    return 'geolocation' in navigator;
  }

  /**
   * Request permission and get current position
   */
  public async getCurrentPosition(config?: Partial<GeolocationConfig>): Promise<Coordinates> {
    if (!this.isSupported()) {
      throw new Error('Geolocation is not supported by this browser');
    }

    return new Promise((resolve, reject) => {
      const options = { ...this.defaultConfig, ...config };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          const coords: Coordinates = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp,
          };
          this.currentPosition = coords;
          this.saveToStorage(coords);
          resolve(coords);
        },
        (error) => {
          reject(error);
        },
        options
      );
    });
  }

  /**
   * Start watching user's location continuously
   */
  public startWatching(config?: Partial<GeolocationConfig>): void {
    if (!this.isSupported()) {
      console.error('Geolocation is not supported');
      return;
    }

    // Stop existing watch if any
    this.stopWatching();

    const options = { ...this.defaultConfig, ...config };

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        const coords: Coordinates = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        };

        this.currentPosition = coords;
        this.saveToStorage(coords);
        this.notifyListeners(coords);
      },
      (error) => {
        console.error('Geolocation error:', error);
        this.notifyErrorListeners(error);
      },
      options
    );
  }

  /**
   * Stop watching user's location
   */
  public stopWatching(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  /**
   * Get last known position (from memory or storage)
   */
  public getLastKnownPosition(): Coordinates | null {
    if (this.currentPosition) {
      return this.currentPosition;
    }

    return this.loadFromStorage();
  }

  /**
   * Subscribe to location updates
   */
  public subscribe(callback: GeolocationCallback): () => void {
    this.listeners.add(callback);
    
    // Immediately notify with current position if available
    if (this.currentPosition) {
      callback(this.currentPosition);
    }

    // Return unsubscribe function
    return () => {
      this.listeners.delete(callback);
    };
  }

  /**
   * Subscribe to location errors
   */
  public subscribeToErrors(callback: GeolocationErrorCallback): () => void {
    this.errorListeners.add(callback);
    return () => {
      this.errorListeners.delete(callback);
    };
  }

  /**
   * Calculate distance between two coordinates (in kilometers)
   */
  public calculateDistance(
    coords1: { latitude: number; longitude: number },
    coords2: { latitude: number; longitude: number }
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(coords2.latitude - coords1.latitude);
    const dLon = this.toRadians(coords2.longitude - coords1.longitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(coords1.latitude)) *
        Math.cos(this.toRadians(coords2.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  /**
   * Get formatted address from coordinates using Nominatim (OpenStreetMap - FREE!)
   */
  public async getAddressFromCoords(coords: Coordinates): Promise<string> {
    try {
      // Use Nominatim (OpenStreetMap) for reverse geocoding - FREE!
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.latitude}&lon=${coords.longitude}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'LifeLineAI/1.0', // Nominatim requires User-Agent
          },
        }
      );
      const data = await response.json();
      
      if (data && data.display_name) {
        return data.display_name;
      }
      return `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`;
    } catch (error) {
      console.error('Geocoding error:', error);
      return `${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`;
    }
  }

  /**
   * Request permission proactively
   */
  public async requestPermission(): Promise<boolean> {
    if (!this.isSupported()) {
      return false;
    }

    try {
      await this.getCurrentPosition();
      return true;
    } catch (error) {
      console.error('Permission denied:', error);
      return false;
    }
  }

  // Private helper methods

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  private notifyListeners(coords: Coordinates): void {
    this.listeners.forEach((listener) => {
      try {
        listener(coords);
      } catch (error) {
        console.error('Error in geolocation listener:', error);
      }
    });
  }

  private notifyErrorListeners(error: GeolocationPositionError): void {
    this.errorListeners.forEach((listener) => {
      try {
        listener(error);
      } catch (err) {
        console.error('Error in geolocation error listener:', err);
      }
    });
  }

  private saveToStorage(coords: Coordinates): void {
    try {
      localStorage.setItem('lastKnownLocation', JSON.stringify(coords));
    } catch (error) {
      console.error('Failed to save location to storage:', error);
    }
  }

  private loadFromStorage(): Coordinates | null {
    try {
      const stored = localStorage.getItem('lastKnownLocation');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (error) {
      console.error('Failed to load location from storage:', error);
    }
    return null;
  }

  /**
   * Cleanup method - call when component unmounts
   */
  public cleanup(): void {
    this.stopWatching();
    this.listeners.clear();
    this.errorListeners.clear();
  }
}

// Export singleton instance
export const geolocationService = new GeolocationService();
