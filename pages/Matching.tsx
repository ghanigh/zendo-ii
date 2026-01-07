import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LiveMap } from '../components/LiveMap'; // New component
import { MOCK_ARTISANS } from '../constants';
import { Phone, MessageSquare, Shield, Star, X } from 'lucide-react';
import { Button } from '../components/Button';
import { ArtisanStatus, InterventionStatus } from '../types';
import { useData } from '../contexts/DataContext';

export const Matching: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getInterventionById, completeIntervention, cancelIntervention } = useData();
  
  const interventionId = location.state?.interventionId;
  const intervention = getInterventionById(interventionId);
  
  const assignedArtisan = intervention?.artisanId 
    ? MOCK_ARTISANS.find(a => a.id === intervention.artisanId) 
    : null;

  const isFound = intervention && intervention.status !== InterventionStatus.SEARCHING && intervention.status !== InterventionStatus.CANCELLED;

  // --- MOVEMENT SIMULATION ---
  const [simulatedArtisanPos, setSimulatedArtisanPos] = useState({ lat: 0, lng: 0 });

  useEffect(() => {
     // Reset position when found
     if (isFound) {
       setSimulatedArtisanPos({ lat: -50, lng: -50 }); // Start far away relative offset
     }
  }, [isFound]);

  useEffect(() => {
     if (isFound) {
        // Move artisan closer to center (0,0 is user) over time
        const interval = setInterval(() => {
           setSimulatedArtisanPos(prev => {
              // Linear interpolation towards 0,0
              const step = 2; // Speed
              const newLat = prev.lat + (0 - prev.lat) * 0.05;
              const newLng = prev.lng + (0 - prev.lng) * 0.05;
              return { lat: newLat, lng: newLng };
           });
        }, 500);
        return () => clearInterval(interval);
     }
  }, [isFound]);

  const handleFinishDemo = async () => {
     if(interventionId) await completeIntervention(interventionId);
     navigate('/');
  };

  const handleCancel = async () => {
    if(interventionId) await cancelIntervention(interventionId);
    navigate('/');
  };

  if (!intervention) return <div className="text-white p-10">Chargement...</div>;

  return (
    <div className="h-screen bg-zendo-dark flex flex-col relative overflow-hidden">
       
       {/* --- MAP LAYER --- */}
       <div className="absolute inset-0 z-0">
          <LiveMap 
            status={isFound ? 'en_route' : 'searching'}
            userLocation={{ lat: 0, lng: 0 }} // Center
            artisanLocation={isFound ? simulatedArtisanPos : null}
            showRoute={isFound}
          />
       </div>

       {/* --- OVERLAYS --- */}
       
       {/* Back Button (Only searching) */}
       {!isFound && (
          <button 
             onClick={handleCancel}
             className="absolute top-12 left-4 z-50 w-10 h-10 bg-white/10 backdrop-blur rounded-full text-white flex items-center justify-center"
          >
             <X size={20} />
          </button>
       )}

       {/* SEARCHING STATE UI */}
       {!isFound && (
          <div className="absolute bottom-0 w-full z-20">
             <div className="bg-zendo-dark rounded-t-3xl p-8 pb-12 shadow-[0_-10px_40px_rgba(0,0,0,0.8)] border-t border-white/10 animate-[slideUp_0.3s_ease-out]">
                <h2 className="text-2xl font-bold mb-2 animate-pulse text-center">Recherche d'artisan...</h2>
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden mb-6 mt-4">
                   <div className="h-full bg-zendo-primary w-1/3 animate-[loading_2s_ease-in-out_infinite]"></div>
                </div>
                <div className="flex justify-between text-slate-400 text-sm">
                   <span>Contact des proches</span>
                   <span>Vérification disponibilités</span>
                </div>
             </div>
          </div>
       )}

       {/* FOUND STATE UI (Driver Details) */}
       {isFound && assignedArtisan && (
         <div className="absolute bottom-0 w-full z-20">
            {/* Status Pill */}
            <div className="absolute -top-16 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2 border border-white/10">
               <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
               <span className="font-bold text-sm">Arrivée dans 8 min</span>
            </div>

            <div className="bg-zendo-card rounded-t-3xl p-6 pb-safe border-t border-white/10 shadow-2xl animate-[slideUp_0.5s_ease-out]">
               {/* Driver Header */}
               <div className="flex justify-between items-start mb-6">
                  <div>
                     <h2 className="text-xl font-bold text-white mb-1">{assignedArtisan.name}</h2>
                     <div className="flex items-center gap-1.5 bg-slate-800 w-fit px-2 py-1 rounded-md">
                        <span className="text-xs font-bold text-white">4.9</span>
                        <Star size={10} className="fill-white text-white" />
                     </div>
                  </div>
                  <div className="relative">
                     <img src={assignedArtisan.avatarUrl} alt="Avatar" className="w-16 h-16 rounded-full border-4 border-zendo-dark object-cover" />
                     <div className="absolute -bottom-1 -right-1 bg-cyan-500 text-black text-[10px] font-bold px-1.5 rounded-sm">PRO</div>
                  </div>
               </div>
               
               {/* Vehicle/Pro Info */}
               <div className="flex justify-between items-center bg-slate-800/50 p-4 rounded-xl mb-6">
                  <div>
                     <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Expertise</p>
                     <p className="text-sm font-semibold text-white">{intervention?.serviceType}</p>
                  </div>
                  <div className="text-right">
                     <p className="text-xs text-slate-400 uppercase font-bold tracking-wider mb-1">Véhicule</p>
                     <p className="text-sm font-semibold text-white bg-slate-700 px-2 py-0.5 rounded">AB-123-CD</p>
                  </div>
               </div>

               {/* Actions */}
               <div className="grid grid-cols-2 gap-4 mb-6">
                  <button className="flex items-center justify-center gap-2 py-3 bg-white text-black rounded-xl font-bold hover:bg-slate-200 transition-colors">
                     <Phone size={18} />
                     Appeler
                  </button>
                  <button className="flex items-center justify-center gap-2 py-3 bg-slate-800 text-white border border-slate-700 rounded-xl font-bold hover:bg-slate-700 transition-colors">
                     <MessageSquare size={18} />
                     Message
                  </button>
               </div>
               
               <button 
                 onClick={handleFinishDemo} 
                 className="w-full py-4 text-center text-xs text-slate-500 hover:text-white transition-colors uppercase tracking-widest font-bold"
               >
                  Terminer la démo (Simuler Fin)
               </button>
            </div>
         </div>
       )}
    </div>
  );
};