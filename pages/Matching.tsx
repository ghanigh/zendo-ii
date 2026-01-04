import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { RadarMap } from '../components/RadarMap';
import { MOCK_ARTISANS } from '../constants';
import { Phone, MessageSquare, Shield, Star, CheckCircle } from 'lucide-react';
import { Button } from '../components/Button';
import { ArtisanStatus, InterventionStatus } from '../types';
import { useData } from '../contexts/DataContext';

export const Matching: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getInterventionById, completeIntervention, cancelIntervention } = useData();
  
  // Get ID from navigation state
  const interventionId = location.state?.interventionId;
  const intervention = getInterventionById(interventionId);
  
  // Find the artisan object if assigned
  const assignedArtisan = intervention?.artisanId 
    ? MOCK_ARTISANS.find(a => a.id === intervention.artisanId) 
    : null;

  // Polling logic is handled by DataContext simulation, we just react to state changes
  const isFound = intervention && intervention.status !== InterventionStatus.SEARCHING && intervention.status !== InterventionStatus.CANCELLED;

  const handleFinishDemo = async () => {
     if(interventionId) await completeIntervention(interventionId);
     navigate('/');
  };

  const handleCancel = async () => {
    if(interventionId) await cancelIntervention(interventionId);
    navigate('/');
  };

  if (!intervention) return <div className="text-white">Chargement...</div>;

  if (!isFound) {
    return (
      <div className="h-screen bg-zendo-dark flex flex-col relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2/3">
           <RadarMap status="scanning" serviceType={intervention.serviceType} />
        </div>
        <div className="absolute bottom-0 w-full h-1/3 bg-zendo-dark rounded-t-3xl border-t border-slate-800 p-8 flex flex-col items-center justify-center text-center z-20 shadow-[0_-10px_50px_rgba(0,0,0,0.8)]">
           <h2 className="text-2xl font-bold mb-2 animate-pulse">Recherche en cours...</h2>
           <p className="text-slate-400">Nous contactons les meilleurs artisans autour de vous.</p>
           <div className="mt-4 text-xs text-slate-500">Simulation: Attendez 5 secondes...</div>
           <Button variant="secondary" className="mt-6" onClick={handleCancel}>Annuler</Button>
        </div>
      </div>
    );
  }

  // Fallback if artisan data missing (shouldn't happen in complete mock)
  const artisanDisplay = assignedArtisan || MOCK_ARTISANS[0];

  return (
    <div className="h-screen bg-zendo-dark flex flex-col">
       {/* Map View */}
       <div className="flex-1 relative">
         <RadarMap status="found" serviceType={artisanDisplay.specialty} />
         
         {/* Status Pill */}
         <div className="absolute top-24 left-1/2 -translate-x-1/2 bg-zendo-card/90 backdrop-blur border border-cyan-500/30 px-6 py-2 rounded-full shadow-lg flex items-center gap-2">
           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
           <span className="text-sm font-semibold text-cyan-400">
             En route (12 min)
           </span>
         </div>
       </div>

       {/* Artisan Card */}
       <div className="bg-zendo-card rounded-t-3xl p-6 border-t border-slate-800 shadow-[0_-10px_40px_rgba(0,0,0,0.6)] animate-[slideUp_0.5s_ease-out]">
         <div className="flex items-start gap-4 mb-6">
           <div className="relative">
             <img src={artisanDisplay.avatarUrl} alt={artisanDisplay.name} className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-700" />
             {artisanDisplay.level === ArtisanStatus.ELITE && (
               <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-400 to-yellow-600 text-[10px] font-bold text-black px-2 py-0.5 rounded-full shadow-lg border border-white/20">
                 ELITE
               </div>
             )}
           </div>
           
           <div className="flex-1">
             <h2 className="text-lg font-bold flex items-center gap-2">
               {artisanDisplay.name}
               <Shield size={14} className="text-cyan-400 fill-cyan-400/20" />
             </h2>
             <div className="flex items-center gap-1 text-slate-400 text-sm mt-1">
               <Star size={14} className="text-amber-400 fill-amber-400" />
               <span className="text-white font-medium">{artisanDisplay.rating}</span>
               <span>• {artisanDisplay.jobsCompleted} interventions</span>
             </div>
             <p className="text-xs text-slate-500 mt-1">Estimation: {intervention.priceEstimate ? Math.round(intervention.priceEstimate) : 85} €</p>
           </div>

           <div className="flex flex-col gap-2">
             <button className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-cyan-400 hover:bg-slate-700">
               <Phone size={20} />
             </button>
             <button className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-cyan-400 hover:bg-slate-700">
               <MessageSquare size={20} />
             </button>
           </div>
         </div>

         <div className="border-t border-slate-800 py-4 mb-4">
           <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-full bg-cyan-500/10 flex items-center justify-center text-cyan-400">
               <CheckCircle size={16} />
             </div>
             <div>
               <p className="text-sm font-medium">Intervention confirmée</p>
               <p className="text-xs text-slate-500">Code sécurité: <span className="text-white font-mono tracking-widest">8921</span></p>
             </div>
           </div>
         </div>

         <Button fullWidth onClick={handleFinishDemo}>
           Terminer l'intervention (Demo)
         </Button>
       </div>
    </div>
  );
};