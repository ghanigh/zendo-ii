import React, { useEffect, useRef, useState } from 'react';

// We access Leaflet from the global window object since we added it via CDN
declare global {
  interface Window {
    L: any;
  }
}

interface Location {
  lat: number;
  lng: number;
}

interface LiveMapProps {
  userLocation?: Location | null;
  artisanLocation?: Location | null;
  status: 'idle' | 'selecting' | 'searching' | 'en_route' | 'arrived';
  showRoute?: boolean;
}

export const LiveMap: React.FC<LiveMapProps> = ({ 
  userLocation, 
  artisanLocation, 
  status,
  showRoute = false 
}) => {
  const mapRef = useRef<any>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const userMarkerRef = useRef<any>(null);
  const artisanMarkerRef = useRef<any>(null);
  const nearbyMarkersRef = useRef<any[]>([]);
  const routeLineRef = useRef<any>(null);

  // Default Paris center if no location provided
  const centerLat = userLocation?.lat || 48.8566;
  const centerLng = userLocation?.lng || 2.3522;

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    if (window.L) {
      const map = window.L.map(mapContainerRef.current, {
        center: [centerLat, centerLng],
        zoom: 15,
        zoomControl: false,
        attributionControl: false,
        layers: []
      });

      // Dark Matter Tiles (Uber-like)
      window.L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        maxZoom: 20,
        subdomains: 'abcd',
      }).addTo(map);

      mapRef.current = map;
    }

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []); // Run once on mount

  // Update User Location & View
  useEffect(() => {
    if (!mapRef.current || !window.L) return;

    const map = mapRef.current;
    
    // Fly to new location smoothly
    map.flyTo([centerLat, centerLng], status === 'selecting' || status === 'searching' ? 16 : 14, {
      duration: 1.5,
      easeLinearity: 0.25
    });

    // Update User Marker (Cyan Pulse)
    if (userMarkerRef.current) map.removeLayer(userMarkerRef.current);
    
    const pulseIcon = window.L.divIcon({
      className: 'custom-div-icon',
      html: `<div class="relative">
              <div class="w-4 h-4 bg-cyan-500 rounded-full border-2 border-white shadow-[0_0_20px_rgba(6,182,212,0.8)] relative z-20"></div>
              <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-cyan-500/20 rounded-full animate-pulse z-10"></div>
              ${status === 'searching' ? '<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-cyan-500/20 rounded-full animate-[ping_2s_linear_infinite] z-0"></div>' : ''}
             </div>`,
      iconSize: [20, 20],
      iconAnchor: [10, 10]
    });

    userMarkerRef.current = window.L.marker([centerLat, centerLng], { icon: pulseIcon }).addTo(map);

  }, [centerLat, centerLng, status]);

  // Generate "Nearby" Artisans based on the NEW center location
  useEffect(() => {
    if (!mapRef.current || !window.L) return;
    
    // Clear old markers
    nearbyMarkersRef.current.forEach(m => mapRef.current.removeLayer(m));
    nearbyMarkersRef.current = [];

    // Only show nearby idle cars if we are in selecting mode
    if (status === 'idle' || status === 'selecting') {
       // Generate 4 random points around the center
       for(let i=0; i<4; i++) {
         const offsetLat = (Math.random() - 0.5) * 0.008; // ~500m radius
         const offsetLng = (Math.random() - 0.5) * 0.008;
         
         const carIcon = window.L.divIcon({
           className: '',
           html: `<div class="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center border border-slate-600 shadow-lg transform transition-transform hover:scale-110">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M5 17h12"/></svg>
                  </div>`,
           iconSize: [32, 32],
           iconAnchor: [16, 16]
         });

         const marker = window.L.marker([centerLat + offsetLat, centerLng + offsetLng], { icon: carIcon }).addTo(mapRef.current);
         nearbyMarkersRef.current.push(marker);
       }
    }
  }, [centerLat, centerLng, status]);

  // Handle Assigned Artisan Movement & Route
  useEffect(() => {
    if (!mapRef.current || !window.L) return;

    if (artisanMarkerRef.current) mapRef.current.removeLayer(artisanMarkerRef.current);
    if (routeLineRef.current) mapRef.current.removeLayer(routeLineRef.current);

    if (status === 'en_route' && artisanLocation) {
       // Relative position logic from simulation (the artisanLocation passed is relative offset in previous mock)
       // Here we need to map the simulated "relative" movement to real coordinates
       // For demo: We just offset the real center by the relative amount from the prop
       // NOTE: In a real app, artisanLocation would be real lat/lng.
       
       // Assuming artisanLocation comes in as a small offset or we project it
       // Let's create a fake real coordinate for the artisan based on the simulation state
       // The `Matching` component sends us {lat, lng} where lat/lng are slowly becoming 0.
       // We'll treat 0,0 as the User Location, and -50,-50 as start.
       // We map 1 unit of simulation to 0.0001 degrees (~10m).
       
       const realArtisanLat = centerLat + (artisanLocation.lat * 0.0001);
       const realArtisanLng = centerLng + (artisanLocation.lng * 0.0001);

       const artisanIcon = window.L.divIcon({
        className: '',
        html: `<div class="relative">
                 <div class="bg-black text-white text-[10px] px-2 py-0.5 rounded-full absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap border border-slate-700 shadow-xl z-20">Je suis là</div>
                 <div class="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-black shadow-2xl relative z-10">
                   <svg width="20" height="20" viewBox="0 0 24 24" fill="black"><path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/></svg>
                 </div>
               </div>`,
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      artisanMarkerRef.current = window.L.marker([realArtisanLat, realArtisanLng], { icon: artisanIcon }).addTo(mapRef.current);

      // Draw Route Line
      if (showRoute) {
        routeLineRef.current = window.L.polyline([
          [realArtisanLat, realArtisanLng],
          [centerLat, centerLng]
        ], {
          color: '#06b6d4', // Cyan
          weight: 4,
          opacity: 0.7,
          dashArray: '10, 10',
          lineCap: 'round'
        }).addTo(mapRef.current);
        
        // Fit bounds to show both
        const bounds = window.L.latLngBounds([
          [realArtisanLat, realArtisanLng],
          [centerLat, centerLng]
        ]);
        mapRef.current.fitBounds(bounds, { padding: [50, 50] });
      }
    }
  }, [artisanLocation, status, centerLat, centerLng, showRoute]);

  return (
    <div className="w-full h-full bg-[#0B0F19]">
      <div ref={mapContainerRef} className="w-full h-full z-0" />
      {/* Vignette Overlay for aesthetic */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(11,15,25,0.4)_100%)] z-[400]"></div>
    </div>
  );
};