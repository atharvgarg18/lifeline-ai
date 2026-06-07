/**
 * OpenStreetMap Places Service
 * Free, open-source alternative - no API keys needed!
 * Uses Overpass API for nearby search and Nominatim for geocoding
 */

import { Coordinates } from './geolocation.service';

export interface PlaceResult {
  id: string;
  name: string;
  address: string;
  location: {
    lat: number;
    lng: number;
  };
  distance?: number;
  rating?: number;
  totalRatings?: number;
  isOpen?: boolean;
  openingHours?: string[];
  phone?: string;
  website?: string;
  photos?: string[];
  types: string[];
  priceLevel?: number;
}

export interface NearbySearchParams {
  location: Coordinates;
  radius: number; // in meters
  type?: string;
  keyword?: string;
  minRating?: number;
  openNow?: boolean;
}

export type PlaceType = 'hospital' | 'pharmacy' | 'ambulance' | 'doctor' | 'emergency';

class PlacesService {
  private cache: Map<string, { data: PlaceResult[]; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
  private readonly OVERPASS_API = 'https://overpass-api.de/api/interpreter';
  private readonly NOMINATIM_API = 'https://nominatim.openstreetmap.org';

  constructor() {
    console.log('✅ Using OpenStreetMap (FREE - No API key needed!)');
  }

  /**
   * Search for nearby hospitals
   */
  public async findNearbyHospitals(
    location: Coordinates,
    radius: number = 10000,
    options?: {
      emergency?: boolean;
      minRating?: number;
      openNow?: boolean;
    }
  ): Promise<PlaceResult[]> {
    // Use simpler tag query - just search for hospitals
    return this.nearbySearch({
      location,
      radius,
      type: 'hospital',
      keyword: 'amenity=hospital',
      minRating: options?.minRating,
      openNow: options?.openNow,
    });
  }

  /**
   * Search for nearby pharmacies
   */
  public async findNearbyPharmacies(
    location: Coordinates,
    radius: number = 5000,
    options?: {
      open24Hours?: boolean;
      minRating?: number;
    }
  ): Promise<PlaceResult[]> {
    return this.nearbySearch({
      location,
      radius,
      type: 'pharmacy',
      keyword: 'amenity=pharmacy',
      minRating: options?.minRating,
      openNow: options?.open24Hours,
    });
  }

  /**
   * Search for ambulance services
   */
  public async findNearbyAmbulances(
    location: Coordinates,
    radius: number = 15000
  ): Promise<PlaceResult[]> {
    // Search for hospitals (many have ambulance services)
    return this.nearbySearch({
      location,
      radius,
      keyword: 'amenity=hospital',
    });
  }

  /**
   * Generic nearby search using Overpass API (OpenStreetMap)
   */
  private async nearbySearch(params: NearbySearchParams): Promise<PlaceResult[]> {
    const cacheKey = this.getCacheKey(params);
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.CACHE_DURATION) {
      console.log('📦 Using cached results');
      return cached.data;
    }

    try {
      console.log('🔍 Searching OpenStreetMap for:', params.type || params.keyword);
      
      // Build Overpass QL query
      const query = this.buildOverpassQuery(params);
      
      // Fetch from Overpass API
      const response = await fetch(this.OVERPASS_API, {
        method: 'POST',
        body: query,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      if (!response.ok) {
        throw new Error(`Overpass API error: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ Overpass API response:', data);

      // Format and filter results
      let formattedResults = this.formatOverpassResults(data.elements, params.location);

      // Apply filters
      if (params.minRating) {
        formattedResults = formattedResults.filter((r: PlaceResult) =>
          r.rating && r.rating >= (params.minRating || 0)
        );
      }

      // Sort by distance
      formattedResults.sort((a: PlaceResult, b: PlaceResult) => {
        const distA = a.distance || Infinity;
        const distB = b.distance || Infinity;
        return distA - distB;
      });

      // Cache results
      this.cache.set(cacheKey, { data: formattedResults, timestamp: Date.now() });

      console.log(`✅ Found ${formattedResults.length} places`);
      return formattedResults;
    } catch (error) {
      console.error('❌ Error fetching nearby places:', error);
      return [];
    }
  }

  /**
   * Build Overpass QL query for nearby search
   */
  private buildOverpassQuery(params: NearbySearchParams): string {
    const { location, radius, keyword } = params;
    const radiusInMeters = radius;

    console.log('🔍 Building Overpass query:');
    console.log('  Location:', location);
    console.log('  Radius:', radiusInMeters, 'meters');
    console.log('  Keyword:', keyword);

    // Build query based on keyword
    // For OR queries (multiple options), split by |
    // For AND queries (must have all), split by &
    let nodeQuery = '';
    let wayQuery = '';

    if (keyword && keyword.includes('|')) {
      // OR query - search for multiple tag combinations
      const tags = keyword.split('|');
      const queries = tags.map(tag => {
        if (tag.includes('=')) {
          const [key, value] = tag.split('=');
          return `node["${key}"="${value}"](around:${radiusInMeters},${location.latitude},${location.longitude});
          way["${key}"="${value}"](around:${radiusInMeters},${location.latitude},${location.longitude});`;
        }
        return '';
      }).filter(q => q).join('\n');
      
      const query = `
        [out:json][timeout:25];
        (
          ${queries}
        );
        out center;
      `;
      
      console.log('📝 Query:', query);
      return query.trim();
    } else if (keyword && keyword.includes('=')) {
      // Single tag query
      const [key, value] = keyword.split('=');
      
      const query = `
        [out:json][timeout:25];
        (
          node["${key}"="${value}"](around:${radiusInMeters},${location.latitude},${location.longitude});
          way["${key}"="${value}"](around:${radiusInMeters},${location.latitude},${location.longitude});
        );
        out center;
      `;
      
      console.log('📝 Query:', query);
      return query.trim();
    }

    // Fallback - search all nodes/ways
    const query = `
      [out:json][timeout:25];
      (
        node(around:${radiusInMeters},${location.latitude},${location.longitude});
        way(around:${radiusInMeters},${location.latitude},${location.longitude});
      );
      out center;
    `;
    
    console.log('📝 Query:', query);
    return query.trim();
  }

  /**
   * Format Overpass API results into PlaceResult format
   */
  private formatOverpassResults(elements: any[], userLocation: Coordinates): PlaceResult[] {
    const results: PlaceResult[] = [];
    const seen = new Set<string>();

    for (const element of elements) {
      // Skip if no tags or duplicate
      if (!element.tags || !element.tags.name) continue;
      if (seen.has(element.tags.name)) continue;
      seen.add(element.tags.name);

      // Get coordinates
      let lat = element.lat;
      let lon = element.lon;

      // For ways/relations, use center point
      if (!lat && element.center) {
        lat = element.center.lat;
        lon = element.center.lon;
      }

      if (!lat || !lon) continue;

      // Build address from tags
      const address = this.buildAddress(element.tags);

      const result: PlaceResult = {
        id: `osm-${element.type}-${element.id}`,
        name: element.tags.name,
        address: address,
        location: { lat, lng: lon },
        phone: element.tags.phone || element.tags['contact:phone'],
        website: element.tags.website || element.tags['contact:website'],
        types: this.extractTypes(element.tags),
        openingHours: element.tags.opening_hours ? [element.tags.opening_hours] : undefined,
      };

      // Calculate distance
      result.distance = this.calculateDistance(
        { latitude: userLocation.latitude, longitude: userLocation.longitude },
        { latitude: lat, longitude: lon }
      );

      // Check if open (basic check)
      if (element.tags.opening_hours) {
        result.isOpen = this.checkIfOpen(element.tags.opening_hours);
      }

      results.push(result);
    }

    return results;
  }

  /**
   * Build address string from OSM tags
   */
  private buildAddress(tags: any): string {
    const parts = [];
    
    if (tags['addr:housenumber']) parts.push(tags['addr:housenumber']);
    if (tags['addr:street']) parts.push(tags['addr:street']);
    if (tags['addr:city']) parts.push(tags['addr:city']);
    if (tags['addr:state']) parts.push(tags['addr:state']);
    if (tags['addr:postcode']) parts.push(tags['addr:postcode']);
    
    return parts.length > 0 ? parts.join(', ') : 'Address not available';
  }

  /**
   * Extract types from OSM tags
   */
  private extractTypes(tags: any): string[] {
    const types = [];
    
    if (tags.amenity) types.push(tags.amenity);
    if (tags.emergency) types.push(tags.emergency);
    if (tags.healthcare) types.push(tags.healthcare);
    if (tags['healthcare:speciality']) types.push(tags['healthcare:speciality']);
    
    return types;
  }

  /**
   * Basic check if place is currently open
   */
  private checkIfOpen(openingHours: string): boolean {
    // Simple check: if it says "24/7", it's open
    if (openingHours.includes('24/7')) return true;
    
    // For more complex opening hours, we'd need a full parser
    // For now, assume open if hours are specified
    return true;
  }

  /**
   * Get detailed information about a specific place
   */
  public async getPlaceDetails(placeId: string): Promise<PlaceResult | null> {
    // For OSM, we'd need to parse the ID and fetch from Overpass
    console.log('Place details not yet implemented for OSM');
    return null;
  }

  /**
   * Calculate distance between two points (in kilometers)
   */
  private calculateDistance(
    point1: { latitude: number; longitude: number },
    point2: { latitude: number; longitude: number }
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRadians(point2.latitude - point1.latitude);
    const dLon = this.toRadians(point2.longitude - point1.longitude);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(point1.latitude)) *
        Math.cos(this.toRadians(point2.latitude)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  /**
   * Generate cache key from search params
   */
  private getCacheKey(params: NearbySearchParams): string {
    return `${params.location.latitude.toFixed(4)},${params.location.longitude.toFixed(4)}_${params.radius}_${params.type || ''}_${params.keyword || ''}`;
  }

  /**
   * Clear cache
   */
  public clearCache(): void {
    this.cache.clear();
  }
}

// Export singleton instance
export const placesService = new PlacesService();
