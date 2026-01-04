import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { H1, Subtext, Card } from '../../components/DesignSystem';
import { Bell, MapPin, Check } from 'lucide-react';

export const PermissionsFlow: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'notifications' | 'location'>('notifications');

  const finishFlow = () => {
    localStorage.setItem('zendo_intro_done', 'true');
    navigate('/welcome', { replace: true });
  };

  const requestNotifications = async () => {
    try {
      if ('Notification' in window) {
        await Notification.requestPermission();
      }
    } catch (e) {
      console.error(e);
    }
    setStep('location');
  };

  const requestLocation = async () => {
    try {
      if ('geolocation' in navigator) {
        // Just triggering the prompt
        navigator.geolocation.getCurrentPosition(() => {}, () => {});
      }
    } catch (e) {
      console.error(e);
    }
    finishFlow();
  };

  if (step === 'notifications') {
    return (
      <div className="h-screen bg-zendo-dark flex flex-col p-8 pt-20">
        <div className="flex-1 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-gradient-to-tr from-purple-500/20 to-blue-500/20 rounded-full flex items-center justify-center mb-8 ring-4 ring-white/5 animate-pulse-slow">
            <Bell size={40} className="text-blue-400" />
          </div>
          
          <H1 align="center" className="mb-4">Restez informé</H1>
          <Subtext align="center" className="mb-8 max-w-xs mx-auto">
            Autorisez les notifications pour suivre l'arrivée de votre artisan et recevoir vos devis en temps réel.
          </Subtext>

          <Card glass className="w-full text-left space-y-4 mb-8">
            <div className="flex gap-3 items-center">
               <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                 <Check size={12} className="text-emerald-500" />
               </div>
               <span className="text-sm text-slate-300">Confirmation d'intervention</span>
            </div>
            <div className="flex gap-3 items-center">
               <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                 <Check size={12} className="text-emerald-500" />
               </div>
               <span className="text-sm text-slate-300">Arrivée du professionnel</span>
            </div>
            <div className="flex gap-3 items-center">
               <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
                 <Check size={12} className="text-emerald-500" />
               </div>
               <span className="text-sm text-slate-300">Messages importants</span>
            </div>
          </Card>
        </div>

        <div className="space-y-3">
          <Button fullWidth onClick={requestNotifications}>
            Autoriser les notifications
          </Button>
          <button 
            onClick={() => setStep('location')} 
            className="w-full py-4 text-sm font-medium text-slate-500 hover:text-slate-300 transition-colors"
          >
            Plus tard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-zendo-dark flex flex-col p-8 pt-20">
        <div className="flex-1 flex flex-col items-center text-center">
          <div className="w-24 h-24 bg-gradient-to-tr from-cyan-500/20 to-emerald-500/20 rounded-full flex items-center justify-center mb-8 ring-4 ring-white/5 animate-pulse-slow">
            <MapPin size={40} className="text-cyan-400" />
          </div>
          
          <H1 align="center" className="mb-4">Localisation précise</H1>
          <Subtext align="center" className="mb-8 max-w-xs mx-auto">
            Pour trouver les artisans disponibles autour de vous, nous avons besoin d'accéder à votre position.
          </Subtext>

          <Card glass className="w-full text-left p-6">
             <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
                  <MapPin size={20} className="text-slate-400" />
                </div>
                <div>
                   <h4 className="font-bold text-white text-sm mb-1">Pourquoi ?</h4>
                   <p className="text-xs text-slate-400 leading-relaxed">
                     ZENDO utilise votre position uniquement lorsque l'application est ouverte pour le matching.
                   </p>
                </div>
             </div>
          </Card>
        </div>

        <div className="space-y-3">
          <Button fullWidth onClick={requestLocation}>
            Activer la localisation
          </Button>
          <button 
            onClick={finishFlow} 
            className="w-full py-4 text-sm font-medium text-slate-500 hover:text-slate-300 transition-colors"
          >
            Saisir manuellement
          </button>
        </div>
      </div>
  );
};