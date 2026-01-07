import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { SERVICES } from '../constants';
import { LiveMap } from '../components/LiveMap';
import { ChevronRight, Search, MapPin, Navigation, X, Clock } from 'lucide-react';
import { H2, Subtext, Card } from '../components/DesignSystem';
import { AddressService, AddressFeature } from '../services/addressService';

export const ClientHome: React.FC = () => {
  const navigate = useNavigate();
  
  // States
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AddressFeature[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<{lat: number, lng: number, address: string} | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  
  // UI State: 'map' (default), 'search' (expanded), 'services' (location selected)
  const [uiState, setUiState] = useState<'map' | 'search' | 'services'>('map');
  
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // --- Handlers ---

  const handleSearchFocus = () => {
    setUiState('search');
  };

  const handleSearchChange = (text: string) => {
    setQuery(text);
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
    setUiState('services'); // Transition to service selection
  };

  const handleGeolocation = () => {
    if (!navigator.geolocation) return;
    setIsLoadingLocation(true);
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const feature = await AddressService.reverse(latitude, longitude);
        setIsLoadingLocation(false);
        
        if (feature) {
          handleSelectAddress(feature);
        } else {
          setQuery("Ma position actuelle");
          setSelectedLocation({ lat: latitude, lng: longitude, address: "Position GPS" });
          setUiState('services');
        }
      },
      () => {
        setIsLoadingLocation(false);
        alert("Erreur de localisation");
      }
    );
  };

  const handleServiceClick = (serviceId: string) => {
    navigate(`/request/${serviceId}`, { state: { location: selectedLocation } });
  };

  const resetSearch = () => {
    setUiState('map');
    setQuery('');
    setSuggestions([]);
    setSelectedLocation(null);
  };

  return (
    <div className="flex flex-col h-screen bg-zendo-dark text-white relative overflow-hidden">
      
      {/* --- BACKGROUND MAP --- */}
      <div className={`absolute inset-0 transition-all duration-500 ${uiState === 'services' ? 'h-1/2' : 'h-full'}`}>
        <LiveMap 
          status={uiState === 'services' ? 'selecting' : 'idle'} 
          userLocation={selectedLocation} 
        />
        {/* Overlay gradient for better text visibility when map is full */}
        {uiState !== 'services' && (
           <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black/60 to-transparent pointer-events-none"></div>
        )}
      </div>

      {/* --- TOP BACK BUTTON (Only when not in initial map state) --- */}
      {uiState !== 'map' && (
        <button 
          onClick={resetSearch}
          className="absolute top-4 left-4 z-50 w-10 h-10 bg-white rounded-full text-black flex items-center justify-center shadow-lg active:scale-90 transition-transform"
        >
          <X size={20} />
        </button>
      )}

      {/* --- MAIN FLOATING UI --- */}
      
      {/* 1. SEARCH BAR (Floating in Map Mode, Full in Search Mode) */}
      <div className={`absolute z-40 transition-all duration-500 ease-in-out
        ${uiState === 'map' ? 'top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%]' : ''}
        ${uiState === 'search' ? 'top-0 left-0 w-full h-full bg-zendo-dark pt-20 px-4' : ''}
        ${uiState === 'services' ? 'top-4 left-1/2 -translate-x-1/2 w-[90%] opacity-0 pointer-events-none' : ''}
      `}>
        
        {/* The Search Box Container */}
        {uiState === 'map' && (
           <div className="text-center mb-6 animate-[slideUp_0.5s_ease-out]">
              <h1 className="text-3xl font-bold mb-2">ZENDO</h1>
              <p className="text-slate-300 text-sm">Votre artisan en un clic.</p>
           </div>
        )}

        <div className={`bg-zendo-card border border-white/10 shadow-2xl transition-all duration-300
           ${uiState === 'search' ? 'rounded-xl' : 'rounded-full py-2'}
        `}>
           <div className="flex items-center px-4 py-3 gap-3">
              <div className={`w-2 h-2 rounded-full ${isSearching ? 'bg-zendo-primary animate-ping' : 'bg-black border-2 border-white'}`}></div>
              <input 
                autoFocus={uiState === 'search'}
                className="bg-transparent border-none outline-none text-white text-lg w-full placeholder:text-slate-400"
                placeholder="Où est l'urgence ?"
                value={query}
                onFocus={handleSearchFocus}
                onChange={(e) => handleSearchChange(e.target.value)}
              />
              {query && <button onClick={() => setQuery('')}><X size={16} className="text-slate-500"/></button>}
           </div>

           {/* Suggestions List (Only in Search Mode) */}
           {uiState === 'search' && (
             <div className="border-t border-white/5 max-h-[60vh] overflow-y-auto">
                <button 
                  onClick={handleGeolocation}
                  className="w-full flex items-center gap-4 p-4 hover:bg-white/5 text-left border-b border-white/5"
                >
                   <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-cyan-400">
                     {isLoadingLocation ? <div className="animate-spin w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full"></div> : <Navigation size={20} fill="currentColor" />}
                   </div>
                   <div>
                      <p className="font-semibold text-cyan-400">Utiliser ma position actuelle</p>
                   </div>
                </button>

                {suggestions.map((item) => (
                  <button
                    key={item.properties.id}
                    onClick={() => handleSelectAddress(item)}
                    className="w-full flex items-center gap-4 p-4 hover:bg-white/5 text-left border-b border-white/5"
                  >
                     <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                       <MapPin size={20} />
                     </div>
                     <div>
                       <p className="font-medium text-white">{item.properties.label}</p>
                       <p className="text-xs text-slate-500">{item.properties.context}</p>
                     </div>
                  </button>
                ))}
             </div>
           )}
        </div>
      </div>

      {/* 2. SERVICES SHEET (Slides up when location selected) */}
      <div className={`absolute bottom-0 left-0 right-0 bg-zendo-dark rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.6)] z-30 transition-transform duration-500 ease-out border-t border-white/10
         ${uiState === 'services' ? 'translate-y-0' : 'translate-y-full'}
      `}>
         {/* Drag Handle */}
         <div className="w-full flex justify-center pt-3 pb-1">
            <div className="w-12 h-1.5 bg-slate-700 rounded-full"></div>
         </div>

         <div className="p-6 pt-2 pb-safe">
            <div className="flex items-center justify-between mb-6">
               <H2>Choisissez un service</H2>
               {selectedLocation && (
                  <div className="flex items-center gap-1 text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
                     <Clock size={12} />
                     <span>~15 min</span>
                  </div>
               )}
            </div>

            <div className="space-y-3 max-h-[50vh] overflow-y-auto">
               {SERVICES.map((service) => (
                  <button
                    key={service.id}
                    onClick={() => handleServiceClick(service.id)}
                    className="w-full flex items-center justify-between p-4 bg-zendo-card border border-white/5 rounded-2xl hover:border-zendo-primary/50 transition-all active:scale-[0.98] group"
                  >
                     <div className="flex items-center gap-4">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br ${service.bgGradient}`}>
                           <service.icon size={28} className="text-white drop-shadow-md" />
                        </div>
                        <div className="text-left">
                           <h3 className="font-bold text-lg text-white group-hover:text-zendo-primary transition-colors">{service.label}</h3>
                           <p className="text-xs text-slate-400">Artisan qualifié • Vérifié</p>
                        </div>
                     </div>
                     <div className="text-right">
                        <span className="block text-lg font-bold text-white">49 €</span>
                        <span className="text-[10px] text-slate-500">Est. déplacement</span>
                     </div>
                  </button>
               ))}
            </div>
         </div>
      </div>

    </div>
  );
};