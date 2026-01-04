import React from 'react';
import { UserRole } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Settings, CreditCard, HelpCircle, Briefcase, User as UserIcon } from 'lucide-react';
import { H1, Card, Badge } from '../components/DesignSystem';

export const Profile: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-zendo-dark p-6 pb-24">
      <H1 className="mb-8">Mon Profil</H1>

      {/* User Header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-20 h-20 bg-slate-800 rounded-full overflow-hidden border-2 border-slate-700">
           {user.avatarUrl ? (
             <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
           ) : (
             <div className="w-full h-full flex items-center justify-center text-slate-500">
               <UserIcon size={32} />
             </div>
           )}
        </div>
        <div>
          <h2 className="text-xl font-bold text-white">{user.name}</h2>
          <p className="text-slate-400 text-sm">{user.email}</p>
          <div className="mt-2 inline-flex items-center">
            {user.role === UserRole.ARTISAN ? (
               <Badge label="Artisan" variant="elite" />
            ) : (
               <Badge label="Client" variant="neutral" />
            )}
            {user.phone && <span className="text-xs text-slate-500 ml-2">{user.phone}</span>}
          </div>
        </div>
      </div>

      {/* Stats Section (Conditional) */}
      {user.role === UserRole.ARTISAN && (
        <div className="grid grid-cols-2 gap-4 mb-8">
           <Card className="text-center">
              <span className="block text-2xl font-bold text-white">4.9</span>
              <span className="text-xs text-slate-400">Note moyenne</span>
           </Card>
           <Card className="text-center">
              <span className="block text-2xl font-bold text-white">12</span>
              <span className="text-xs text-slate-400">Missions ce mois</span>
           </Card>
        </div>
      )}

      {/* Menu Actions */}
      <div className="space-y-3 mb-8">
        <button className="w-full flex items-center justify-between p-4 bg-zendo-card rounded-xl border border-slate-800 hover:border-slate-600 transition-colors">
          <div className="flex items-center gap-3">
             <Settings className="text-cyan-400" size={20} />
             <span className="font-medium text-slate-200">Paramètres du compte</span>
          </div>
        </button>
        <button className="w-full flex items-center justify-between p-4 bg-zendo-card rounded-xl border border-slate-800 hover:border-slate-600 transition-colors">
          <div className="flex items-center gap-3">
             <CreditCard className="text-cyan-400" size={20} />
             <span className="font-medium text-slate-200">Moyens de paiement</span>
          </div>
        </button>
        
        {user.role === UserRole.ARTISAN && (
          <button className="w-full flex items-center justify-between p-4 bg-zendo-card rounded-xl border border-slate-800 hover:border-slate-600 transition-colors">
            <div className="flex items-center gap-3">
               <Briefcase className="text-amber-400" size={20} />
               <span className="font-medium text-slate-200">Documents Pro</span>
            </div>
          </button>
        )}

        <button className="w-full flex items-center justify-between p-4 bg-zendo-card rounded-xl border border-slate-800 hover:border-slate-600 transition-colors">
          <div className="flex items-center gap-3">
             <HelpCircle className="text-cyan-400" size={20} />
             <span className="font-medium text-slate-200">Aide & Support</span>
          </div>
        </button>
      </div>

      {/* Logout */}
      <button 
        onClick={logout}
        className="flex items-center justify-center gap-2 text-red-500 font-medium text-sm mx-auto w-full py-4 hover:bg-red-500/10 rounded-xl transition-colors"
      >
        <LogOut size={16} />
        Se déconnecter
      </button>
    </div>
  );
};