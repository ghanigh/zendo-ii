import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../components/Button';
import { H1, Subtext } from '../../components/DesignSystem';

export const Welcome: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="h-screen bg-zendo-dark flex flex-col relative">
      {/* Immersive Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?q=80&w=1000&auto=format&fit=crop" 
          alt="Background" 
          className="w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-zendo-dark/40 via-zendo-dark/80 to-zendo-dark"></div>
      </div>

      <div className="flex-1 flex flex-col justify-end p-8 relative z-10 pb-12">
        <div className="w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-cyan-500/20">
          <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>

        <H1 className="mb-4 text-4xl">Dépannage<br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Premium</span></H1>
        <Subtext className="mb-10 text-base">
          Accédez aux meilleurs artisans qualifiés en temps réel. Plomberie, électricité, serrurerie, et plus.
        </Subtext>

        <div className="space-y-4">
          <Button fullWidth onClick={() => navigate('/auth/register')}>
            Créer un compte
          </Button>
          <Button fullWidth variant="secondary" onClick={() => navigate('/auth/login')}>
            Se connecter
          </Button>
        </div>
        
        <p className="text-[10px] text-slate-500 text-center mt-6">
          En continuant, vous acceptez nos CGU et notre politique de confidentialité.
        </p>
      </div>
    </div>
  );
};