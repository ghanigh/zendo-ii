import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { H1, Subtext } from '../../components/DesignSystem';
import { ChevronRight, ShieldCheck, Zap } from 'lucide-react';

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const slides = [
    {
      icon: <Zap size={48} className="text-cyan-400" />,
      title: "Intervention Rapide",
      desc: "Trouvez un artisan qualifié en moins de 30 minutes, 24h/24 et 7j/7.",
      image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=1000&auto=format&fit=crop"
    },
    {
      icon: <ShieldCheck size={48} className="text-emerald-400" />,
      title: "Service Premium",
      desc: "Des professionnels vérifiés, des tarifs transparents et un paiement sécurisé.",
      image: "https://images.unsplash.com/photo-1581578731117-104f8a3d46a8?q=80&w=1000&auto=format&fit=crop"
    }
  ];

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      navigate('/permissions');
    }
  };

  return (
    <div className="h-screen bg-zendo-dark flex flex-col relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src={slides[step].image} 
          alt="Onboarding" 
          className="w-full h-3/5 object-cover opacity-40 mask-image-b transition-opacity duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zendo-dark/80 to-zendo-dark"></div>
      </div>

      <div className="flex-1 z-10 flex flex-col justify-end p-8 pb-12">
        <div className="mb-8 transition-all duration-500 transform translate-y-0">
          <div className="w-20 h-20 bg-zendo-card border border-white/10 rounded-2xl flex items-center justify-center mb-6 shadow-xl backdrop-blur-md">
            {slides[step].icon}
          </div>
          <H1 className="text-4xl mb-4 leading-tight">{slides[step].title}</H1>
          <Subtext className="text-lg">{slides[step].desc}</Subtext>
        </div>

        {/* Indicators */}
        <div className="flex gap-2 mb-8">
          {slides.map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-cyan-500' : 'w-2 bg-slate-700'}`}
            />
          ))}
        </div>

        <Button fullWidth onClick={handleNext} className="group">
          {step === slides.length - 1 ? 'Commencer' : 'Suivant'}
          <ChevronRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};