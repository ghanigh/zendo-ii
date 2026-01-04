import React from 'react';
import { Home, Clock, User, ShieldCheck } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export const NavBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { icon: Home, label: 'Accueil', path: '/' },
    { icon: Clock, label: 'Historique', path: '/history' },
    { icon: User, label: 'Profil', path: '/profile' },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-zendo-dark/95 backdrop-blur-md border-t border-slate-800 pb-safe pt-2 px-6 z-50">
      <div className="flex justify-between items-center max-w-md mx-auto h-16">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-1 transition-colors duration-200 ${
              isActive(item.path) ? 'text-cyan-400' : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <item.icon size={24} strokeWidth={isActive(item.path) ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};