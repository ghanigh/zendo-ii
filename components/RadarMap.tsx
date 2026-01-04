import React from 'react';
import { MapPin, Zap, Wrench, Key } from 'lucide-react';

interface RadarMapProps {
  status?: 'idle' | 'scanning' | 'found';
  serviceType?: string;
}

export const RadarMap: React.FC<RadarMapProps> = ({ status = 'idle', serviceType }) => {
  // Mock positions for "Nearby Artisans"
  const nearbyPoints = [
    { top: '30%', left: '20%', delay: '0s' },
    { top: '60%', left: '75%', delay: '1s' },
    { top: '25%', left: '80%', delay: '2s' },
    { top: '70%', left: '30%', delay: '1.5s' },
  ];

  return (
    <div className="relative w-full h-full bg-[#111625] overflow-hidden rounded-3xl border border-slate-800 shadow-2xl">
      {/* Map Grid Lines */}
      <div className="absolute inset-0 opacity-10" 
           style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
      </div>

      {/* Street simulation (SVGs) */}
      <svg className="absolute inset-0 w-full h-full opacity-10 stroke-slate-500" strokeWidth="1">
        <path d="M-10 100 Q 150 50 350 200 T 800 150" fill="none" />
        <path d="M50 400 Q 150 200 200 0" fill="none" />
        <path d="M300 400 L 350 0" fill="none" />
      </svg>

      {/* Center User Marker */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
        <div className="relative">
          <div className="w-4 h-4 bg-cyan-500 rounded-full shadow-[0_0_15px_rgba(6,182,212,0.8)] border-2 border-white relative z-10"></div>
          {status === 'scanning' && (
             <>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-cyan-500/30 rounded-full animate-radar origin-center"></div>
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-cyan-500/40 rounded-full animate-pulse-slow"></div>
             </>
          )}
        </div>
      </div>

      {/* Nearby Artisans */}
      {status !== 'idle' && nearbyPoints.map((point, i) => (
        <div 
          key={i} 
          className="absolute z-10 transition-opacity duration-500"
          style={{ top: point.top, left: point.left, animation: `pulse 3s infinite ${point.delay}` }}
        >
          <div className="w-8 h-8 rounded-full bg-slate-800/80 backdrop-blur border border-slate-600 flex items-center justify-center text-slate-300">
             {serviceType === 'PLUMBING' ? <Wrench size={14} /> : 
              serviceType === 'ELECTRICITY' ? <Zap size={14} /> :
              serviceType === 'LOCKSMITH' ? <Key size={14} /> :
              <MapPin size={14} />}
          </div>
        </div>
      ))}
      
      {/* Search Input Simulation */}
      <div className="absolute top-6 left-4 right-4 z-30">
        <div className="bg-slate-900/90 backdrop-blur-md text-slate-300 px-4 py-3 rounded-xl border border-slate-700 shadow-lg flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-sm font-medium">Localisation actuelle...</span>
        </div>
      </div>
    </div>
  );
};