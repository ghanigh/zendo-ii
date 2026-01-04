import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SERVICES } from '../constants';
import { RadarMap } from '../components/RadarMap';
import { ChevronRight, Search, MapPin, Navigation, X } from 'lucide-react';
import { H2, Subtext, Card } from '../components/DesignSystem';
import { AddressService, AddressFeature } from '../services/addressService';

export const ClientHome: React.FC = () => {
  const navigate = useNavigate();
  
  // Search & Location State
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AddressFeature[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number, address: string} | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  
  // Debounce ref
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSearch = (text: string) => {
    setQuery(text);
    setSelectedLocation(null); // Reset selection if typing again

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (text.length > 2) {
      setIsSearching(true);
      timeoutRef.current = setTimeout(async () => {
        const results = await AddressService.search(text);
        setSuggestions(results);
        setIsSearching(false);
      }, 300);
    } else {
      setSuggestions([]);
      setIsSearching(false);
    }
  };

  const handleSelectAddress = (feature: AddressFeature) => {
    const address = feature.properties.label;
    const [lng, lat] = feature.geometry.coordinates;
    
    setQuery(address);
    setSuggestions([]);
    setSelectedLocation({ lat, lng, address });
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) {
      alert("La géolocalisation n'est pas supportée par votre navigateur.");
      return;
    }

    setIsLoadingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        // Reverse geocode to get the readable address
        const feature = await AddressService.reverse(latitude, longitude);
        
        setIsLoadingLocation(false);
        if (feature) {
          handleSelectAddress(feature);
        } else {
          // Fallback if reverse geocoding fails but we have coords
          setQuery("Ma position actuelle");
          setSelectedLocation({ 
            lat: latitude, 
            lng: longitude, 
            address: "Position GPS" 
          });
        }
      },
      (error) => {
        console.error(error);
        setIsLoadingLocation(false);
        alert("Impossible de récupérer votre position. Vérifiez vos permissions.");
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  const handleServiceClick = (serviceId: string) => {
    // Pass the selected location to the Request Flow
    navigate(`/request/${serviceId}`, { 
      state: { location: selectedLocation } 
    });
  };

  return (
    <div className="flex flex-col h-screen bg-zendo-dark text-white pb-20">
      {/* Top Map Area - Immersive */}
      <div className="flex-1 relative w-full">
        <RadarMap status="idle" />
        
        {/* Floating Search Bar */}
        <div className="absolute top-4 left-4 right-4 z-50">
          <div className="relative">
            <div className={`flex items-center gap-3 bg-zendo-card/90 backdrop-blur-md border border-white/10 p-3 shadow-xl transition-all duration-200 ${suggestions.length > 0 ? 'rounded-t-2xl rounded-b-none' : 'rounded-2xl'}`}>
               <Search size={20} className="text-zendo-primary ml-1" />
               <input 
                 type="text"
                 className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-slate-400 text-sm"
                 placeholder="Où avez-vous besoin d'aide ?"
                 value={query}
                 onChange={(e) => handleSearch(e.target.value)}
               />
               
               {query ? (
                 <button onClick={() => { setQuery(''); setSuggestions([]); setSelectedLocation(null); }} className="p-1">
                   <X size={16} className="text-slate-500" />
                 </button>
               ) : (
                 <button 
                   onClick={handleGeolocation} 
                   disabled={isLoadingLocation}
                   className="p-2 bg-slate-800 rounded-full text-cyan-400 hover:bg-slate-700 transition-colors"
                 >
                   {isLoadingLocation ? (
                     <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                   ) : (
                     <Navigation size={16} fill="currentColor" className="opacity-80" />
                   )}
                 </button>
               )}
            </div>

            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-zendo-card border-t border-white/5 shadow-2xl rounded-b-2xl overflow-hidden max-h-60 overflow-y-auto">
                {suggestions.map((item) => (
                  <button
                    key={item.properties.id}
                    onClick={() => handleSelectAddress(item)}
                    className="w-full text-left px-4 py-3 hover:bg-white/5 flex items-start gap-3 border-b border-white/5 last:border-0"
                  >
                    <MapPin size={16} className="text-slate-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-slate-200 line-clamp-1">{item.properties.label}</p>
                      <p className="text-xs text-slate-500">{item.properties.context}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Location Feedback Pill */}
          {selectedLocation && (
             <div className="mt-3 inline-flex items-center gap-2 bg-green-500/20 border border-green-500/30 rounded-full px-4 py-1.5 backdrop-blur-md">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs font-medium text-green-400">Adresse validée</span>
             </div>
          )}
        </div>
      </div>

      {/* Service Selection Bottom Sheet */}
      <div className="bg-zendo-dark px-6 py-6 rounded-t-3xl -mt-6 relative z-10 border-t border-white/5 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
        <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto mb-6"></div>
        
        <div className="mb-6">
          <H2>Besoin d'un dépannage ?</H2>
          <Subtext>Artisans qualifiés disponibles en <span className="text-zendo-success font-medium">moins de 30 min</span>.</Subtext>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {SERVICES.map((service) => (
            <button
              key={service.id}
              onClick={() => handleServiceClick(service.id)}
              className="group relative overflow-hidden rounded-2xl bg-zendo-card border border-white/5 p-4 text-left transition-all hover:border-white/20 active:scale-[0.98]"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${service.bgGradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
              <div className="relative z-10">
                <div className={`w-10 h-10 rounded-full bg-black/30 flex items-center justify-center mb-3 ${service.color} border border-white/5`}>
                  <service.icon size={20} />
                </div>
                <h3 className="font-semibold text-slate-100">{service.label}</h3>
                <div className="flex items-center text-xs text-slate-500 mt-1 font-medium">
                  Disponible <ChevronRight size={12} className="ml-1 text-zendo-primary" />
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};