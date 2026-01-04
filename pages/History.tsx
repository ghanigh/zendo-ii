import React from 'react';
import { H1, Card, Badge } from '../components/DesignSystem';
import { Wrench, Zap, FileText, Calendar, Key, Thermometer, AlertCircle } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { useAuth } from '../contexts/AuthContext';
import { ServiceType, InterventionStatus } from '../types';
import { MOCK_ARTISANS } from '../constants';

export const History: React.FC = () => {
  const { interventions } = useData();
  const { user } = useAuth();

  // Filter interventions relevant to current user
  const myHistory = interventions.filter(i => 
    i.clientId === user?.id || i.artisanId === user?.id
  ).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

  const getServiceConfig = (type: ServiceType) => {
    switch (type) {
      case ServiceType.PLUMBING: return { icon: Wrench, color: 'text-cyan-400', label: 'Plomberie' };
      case ServiceType.ELECTRICITY: return { icon: Zap, color: 'text-yellow-400', label: 'Électricité' };
      case ServiceType.LOCKSMITH: return { icon: Key, color: 'text-rose-400', label: 'Serrurerie' };
      case ServiceType.HVAC: return { icon: Thermometer, color: 'text-blue-400', label: 'Climatisation' };
      default: return { icon: Wrench, color: 'text-gray-400', label: 'Autre' };
    }
  };

  const getStatusLabel = (status: InterventionStatus) => {
    switch(status) {
      case InterventionStatus.COMPLETED: return { label: 'Terminé', variant: 'neutral' as const };
      case InterventionStatus.SEARCHING: return { label: 'Recherche', variant: 'warning' as const };
      case InterventionStatus.EN_ROUTE: return { label: 'En cours', variant: 'success' as const };
      case InterventionStatus.CANCELLED: return { label: 'Annulé', variant: 'neutral' as const };
      default: return { label: status, variant: 'neutral' as const };
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('fr-FR', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-zendo-dark p-6 pb-24">
      <H1 className="mb-6">Historique</H1>
      
      {myHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 opacity-50">
           <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
             <FileText size={24} />
           </div>
           <p>Aucune intervention passée</p>
        </div>
      ) : (
        <div className="space-y-4">
          {myHistory.map((item) => {
            const config = getServiceConfig(item.serviceType);
            const statusConfig = getStatusLabel(item.status);
            const artisan = MOCK_ARTISANS.find(a => a.id === item.artisanId);

            return (
              <Card key={item.id} className="flex flex-col gap-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full bg-zendo-input flex items-center justify-center ${config.color}`}>
                      <config.icon size={18} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{config.label}</h3>
                      <div className="flex items-center gap-1 text-xs text-zendo-text-secondary">
                        <Calendar size={12} />
                        {formatDate(item.createdAt)}
                      </div>
                    </div>
                  </div>
                  <Badge label={statusConfig.label} variant={statusConfig.variant} />
                </div>
                
                <div className="h-px bg-white/5 w-full"></div>
                
                {artisan ? (
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <img src={artisan.avatarUrl} className="w-6 h-6 rounded-full border border-slate-600" alt="artisan" />
                      <span className="text-sm text-slate-300">{artisan.name}</span>
                    </div>
                    {item.priceEstimate && (
                       <span className="font-bold text-white">~{Math.round(item.priceEstimate)} €</span>
                    )}
                  </div>
                ) : (
                   <div className="flex items-center gap-2 text-slate-500 text-sm">
                     <AlertCircle size={14} />
                     En attente d'attribution
                   </div>
                )}

                {item.status === InterventionStatus.COMPLETED && (
                  <button className="w-full py-2 flex items-center justify-center gap-2 rounded-lg bg-slate-800/50 text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors">
                    <FileText size={14} />
                    Voir la facture
                  </button>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};