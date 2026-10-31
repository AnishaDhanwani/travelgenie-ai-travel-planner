interface GeoCoord {
  lat: number;
  lon: number;
  displayName: string;
}

// In-memory cache for geocoded queries
const geoCache = new Map<string, GeoCoord>();

// Known prominent travel destinations coordinates fallback
const KNOWN_DESTINATIONS: Record<string, { lat: number; lon: number }> = {
  manali: { lat: 32.2432, lon: 77.1892 },
  goa: { lat: 15.2993, lon: 74.1240 },
  jaipur: { lat: 26.9124, lon: 75.7873 },
  kashmir: { lat: 34.0837, lon: 74.7973 },
  srinagar: { lat: 34.0837, lon: 74.7973 },
  kerala: { lat: 10.8505, lon: 76.2711 },
  munnar: { lat: 10.0889, lon: 77.0595 },
  rishikesh: { lat: 30.0869, lon: 78.2676 },
  udaipur: { lat: 24.5854, lon: 73.7125 },
  shimla: { lat: 31.1048, lon: 77.1734 },
  varanasi: { lat: 25.3176, lon: 82.9739 },
  paris: { lat: 48.8566, lon: 2.3522 },
  london: { lat: 51.5074, lon: -0.1278 },
  tokyo: { lat: 35.6762, lon: 139.6503 },
  dubai: { lat: 25.2048, lon: 55.2708 },
  singapore: { lat: 1.3521, lon: 103.8198 },
  bali: { lat: -8.4095, lon: 115.1889 },
  bangkok: { lat: 13.7563, lon: 100.5018 },
  rome: { lat: 41.9028, lon: 12.4964 },
  barcelona: { lat: 41.3851, lon: 2.1734 },
  newyork: { lat: 40.7128, lon: -74.0060 },
  'new york': { lat: 40.7128, lon: -74.0060 },
};

export class GeocodingService {
  /**
   * Geocode a place within a destination using Nominatim OpenStreetMap
   */
  public static async geocodePlace(placeName: string, destination: string): Promise<{ lat: number; lon: number } | null> {
    const queryKey = `${placeName.toLowerCase().trim()}__${destination.toLowerCase().trim()}`;
    if (geoCache.has(queryKey)) {
      return geoCache.get(queryKey) || null;
    }

    try {
      const fullQuery = `${placeName}, ${destination}`;
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullQuery)}&limit=1`;
      
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'TravelGenie-App/1.0 (contact@travelgenie.ai)'
        }
      });

      if (response.ok) {
        const data = (await response.json()) as Array<{ lat: string; lon: string; display_name: string }>;
        if (data && data.length > 0) {
          const result = {
            lat: parseFloat(data[0].lat),
            lon: parseFloat(data[0].lon),
            displayName: data[0].display_name
          };
          geoCache.set(queryKey, result);
          return { lat: result.lat, lon: result.lon };
        }
      }
    } catch {
      // Nominatim failed or offline, fallback to destination centroid
    }

    // Fallback: check destination base coords
    const destCoords = await this.getDestinationCoords(destination);
    if (destCoords) {
      // Add slight deterministically clustered offset so markers do not stack exactly on 1 point
      const hash = this.hashString(placeName);
      const latOffset = ((hash % 100) - 50) * 0.0003;
      const lonOffset = (((hash / 100) % 100) - 50) * 0.0003;
      const result = {
        lat: Number((destCoords.lat + latOffset).toFixed(5)),
        lon: Number((destCoords.lon + lonOffset).toFixed(5))
      };
      geoCache.set(queryKey, { ...result, displayName: placeName });
      return result;
    }

    return null;
  }

  /**
   * Get coordinates for a destination city
   */
  public static async getDestinationCoords(destination: string): Promise<{ lat: number; lon: number } | null> {
    const cleanDest = destination.toLowerCase().trim();
    
    // Check known dictionary first
    for (const [key, coords] of Object.entries(KNOWN_DESTINATIONS)) {
      if (cleanDest.includes(key)) {
        return coords;
      }
    }

    try {
      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destination)}&limit=1`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'TravelGenie-App/1.0 (contact@travelgenie.ai)'
        }
      });

      if (response.ok) {
        const data = (await response.json()) as Array<{ lat: string; lon: string }>;
        if (data && data.length > 0) {
          return {
            lat: parseFloat(data[0].lat),
            lon: parseFloat(data[0].lon)
          };
        }
      }
    } catch {
      // Network failure
    }

    // Default to Delhi / Global neutral if unknown
    return { lat: 28.6139, lon: 77.2090 };
  }

  private static hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) - hash + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash);
  }
}

