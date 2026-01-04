import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation, Clock, TriangleAlert } from 'lucide-react';
import { Button } from '../components/Button';
import { H1, H2, Subtext, Card, Badge } from '../components/DesignSystem';

export const JobProposal: React.FC = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Auto decline or timeout logic
      navigate('/');
    }
  }, [timeLeft, navigate]);

  return (
    <div className="h-screen bg-zendo-dark flex flex-col p-6 relative overflow-hidden">
      {/* Background Pulse Effect for Urgency */}
      <div className="absolute inset-0 bg-zendo-primary/5 animate-pulse-slow pointer-events-none"></div>
      
      <div className="flex-1 flex flex-col justify-center items-center relative z-10">
        <div className="mb-8 relative">
           {/* Circular Timer Visualization */}
           <svg className="w-32 h-32 transform -rotate-90">
             <circle cx="64" cy="64" r="60" stroke="#1e293b" strokeWidth="8" fill="none" />
             <circle 
               cx="64" cy="64" r="60" 
               stroke="#06b6d4" 
               strokeWidth="8" 
               fill="none" 
               strokeDasharray={377} 
               strokeDashoffset={377 - (377 * timeLeft) / 30}
               className="transition-all duration-1000 ease-linear"
             />
           </svg>
           <div className="absolute inset-0 flex items-center justify-center">
             <span className="text-3xl font-bold text-white">{timeLeft}s</span>
           </div>
        </div>

        <Badge label="Nouvelle Opportunité" variant="elite" className="mb-4" />
        <H1 align="center" className="mb-2">Plomberie - Urgence</H1>
        <Subtext align="center" className="mb-8">Fuite d'eau importante • Cuisine</Subtext>

        <Card glass className="w-full mb-6">
          <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 rounded-full bg-zendo-primary/20 flex items-center justify-center text-zendo-primary">
               <Navigation size={20} />
             </div>
             <div>
               <p className="text-xs text-slate-400">Distance</p>
               <p className="font-bold text-white">2.4 km (8 min)</p>
             </div>
          </div>
          <div className="h-px bg-white/10 w-full mb-4"></div>
          <div className="flex items-start gap-3">
             <MapPin size={20} className="text-slate-500 mt-1" />
             <div>
               <p className="font-semibold text-white">124 Avenue de la République</p>
               <p className="text-xs text-slate-400">75011 Paris</p>
             </div>
          </div>
        </Card>

        <div className="w-full grid grid-cols-2 gap-4 mt-auto">
          <Button variant="secondary" onClick={() => navigate('/')}>Refuser</Button>
          <Button onClick={() => navigate('/')}>Accepter</Button>
        </div>
      </div>
    </div>
  );
};