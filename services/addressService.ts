/**
 * Service to interact with api-adresse.data.gouv.fr
 * Free, open API for French addresses.
 */

export interface AddressFeature {
  properties: {
    label: string;
    score: number;
    housenumber?: string;
    id: string;
    type: string;
    name: string;
    postcode: string;
    city: string;
    context: string;
  };
  geometry: {
    type: string;
    coordinates: [number, number]; // [lon, lat]
  };
}

export const AddressService = {
  /**
   * Search for addresses based on a query string (Autocomplete)
   */
  search: async (query: string): Promise<AddressFeature[]> => {
    if (query.length < 3) return [];
    
    try {
      const response = await fetch(`https://api-adresse.data.gouv.fr/search/?q=${encodeURIComponent(query)}&limit=5`);
      const data = await response.json();
      return data.features || [];
    } catch (error) {
      console.error("Address search error:", error);
      return [];
    }
  },

  /**
   * Get an address from coordinates (Reverse Geocoding)
   */
  reverse: async (lat: number, lng: number): Promise<AddressFeature | null> => {
    try {
      const response = await fetch(`https://api-adresse.data.gouv.fr/reverse/?lon=${lng}&lat=${lat}`);
      const data = await response.json();
      if (data.features && data.features.length > 0) {
        return data.features[0];
      }
      return null;
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      return null;
    }
  }
};