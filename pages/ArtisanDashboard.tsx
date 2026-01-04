import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { DollarSign, Award, TrendingUp, Calendar, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { H1, Card, Badge, Subtext } from '../components/DesignSystem';
import { Button } from '../components/Button';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { InterventionStatus } from '../types';

const data = [
  { name: 'Mon', income: 140 },
  { name: 'Tue', income: 220 },
  { name: 'Wed', income: 180 },
  { name: 'Thu', income: 340 },
  { name: 'Fri', income: 290 },
  { name: 'Sat', income: 450 },
  { name: 'Sun', income: 380 },
];

export const ArtisanDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { interventions, acceptIntervention } = useData();

  // Find interventions that are searching for an artisan
  const availableJobs = interventions.filter(i => i.status === InterventionStatus.SEARCHING);

  // Find my jobs
  const myJobs = interventions.filter(i => 
    i.artisanId === user?.id && 
    (i.status === InterventionStatus.EN_ROUTE || i.status === InterventionStatus.IN_PROGRESS)
  );

  return (
    <div className="min-h-screen bg-zendo-dark pb-24 text-white p-6">
      <header className="flex justify-between items-center mb-8">
        <div>
          <H1>Bonjour, {user?.name.split(' ')[0]}</H1>
          <div className="mt-2">
            <Badge label="Elite Ambassador" variant="elite" />
          </div>
        </div>
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 p-[2px]">
           {user?.avatarUrl && <img src={user.avatarUrl} className="w-full h-full rounded-full border-2 border-zendo-dark" alt="profile" />}
        </div>
      </header>

      {/* --- AVAILABLE JOBS SECTION --- */}
      <h3 className="font-semibold mb-4 flex items-center gap-2 text-sm text-cyan-400 uppercase tracking-widest">
        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
        Demandes en cours ({availableJobs.length})
      </h3>

      {availableJobs.length === 0 ? (
         <Card className="mb-8 border-dashed border-slate-700 bg-transparent text-center py-8">
            <p className="text-slate-500 text-sm">Aucune demande dans votre zone.</p>
         </Card>
      ) : (
        <div className="space-y-4 mb-8">
           {availableJobs.map(job => (
             <Card key={job.id} className="border-cyan-500/30 bg-gradient-to-r from-zendo-card to-cyan-900/10">
                <div className="flex justify-between items-start mb-2">
                   <Badge label={job.serviceType} variant="warning" />
                   <span className="text-xs font-mono text-cyan-400">Maintenant</span>
                </div>
                <h4 className="font-bold text-white mb-1 truncate">{job.description}</h4>
                <div className="flex items-center gap-2 text-xs text-slate-400 mb-4">
                   <MapPin size={12} />
                   12 Rue de la Paix, Paris (2.4 km)
                </div>
                <Button fullWidth onClick={() => {
                   if(user) acceptIntervention(job.id, user.id);
                }}>
                   Accepter la course
                </Button>
             </Card>
           ))}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <Card>
          <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center mb-2">
            <DollarSign size={18} />
          </div>
          <Subtext>Revenus (Sem)</Subtext>
          <p className="text-xl font-bold">2,140 €</p>
        </Card>
        <Card>
          <div className="w-8 h-8 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center mb-2">
            <Award size={18} />
          </div>
          <Subtext>Note Moyenne</Subtext>
          <p className="text-xl font-bold">4.9/5</p>
        </Card>
      </div>

      {/* Chart */}
      <Card className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-semibold flex items-center gap-2 text-sm">
            <TrendingUp size={16} className="text-cyan-400" />
            Performance
          </h3>
          <select className="bg-zendo-dark border border-white/10 text-xs rounded-lg px-2 py-1 outline-none text-slate-400">
            <option>Cette semaine</option>
            <option>Ce mois</option>
          </select>
        </div>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 10}} dy={10} />
              <YAxis hide />
              <Tooltip 
                cursor={{fill: '#1e293b'}} 
                contentStyle={{backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#fff'}}
              />
              <Bar dataKey="income" fill="#06b6d4" radius={[4, 4, 0, 0]} barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};