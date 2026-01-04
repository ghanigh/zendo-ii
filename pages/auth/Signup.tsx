import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';
import { Button } from '../../components/Button';
import { Input, H1, Subtext } from '../../components/DesignSystem';
import { Mail, Lock, User, Phone, Briefcase, Check, ArrowLeft } from 'lucide-react';

export const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { register, socialLogin } = useAuth();
  const [role, setRole] = useState<UserRole>(UserRole.CLIENT);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    // Simulate API call
    const err = await register({ ...formData, role });
    if (!err) {
      navigate('/', { replace: true });
    } else {
      setIsLoading(false);
      setError(err);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'apple') => {
    setIsLoading(true);
    setError('');
    const err = await socialLogin(provider, role); // Pass the selected role
    if (err) {
      setError(err);
      setIsLoading(false);
    } else {
      navigate('/', { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-zendo-dark flex flex-col p-6">
      <div className="mb-4 pt-4">
        <button onClick={() => navigate('/welcome')} className="p-2 -ml-2 rounded-full hover:bg-white/5 transition-colors text-slate-400">
          <ArrowLeft size={24} />
        </button>
      </div>

       <H1 className="mt-2 mb-2">Créer un compte</H1>
       <Subtext className="mb-6">Rejoignez la communauté ZENDO.</Subtext>

       {/* Role Selector */}
       <div className="grid grid-cols-2 gap-3 mb-6 p-1 bg-slate-900 rounded-xl border border-white/5">
         <button 
           type="button"
           onClick={() => setRole(UserRole.CLIENT)}
           className={`py-2 rounded-lg text-sm font-medium transition-all ${role === UserRole.CLIENT ? 'bg-zendo-card text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
         >
           Client
         </button>
         <button 
           type="button"
           onClick={() => setRole(UserRole.ARTISAN)}
           className={`py-2 rounded-lg text-sm font-medium transition-all ${role === UserRole.ARTISAN ? 'bg-zendo-card text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
         >
           Artisan
         </button>
       </div>

       {role === UserRole.ARTISAN && (
           <div className="p-4 bg-cyan-500/5 border border-cyan-500/20 rounded-xl mb-6">
             <div className="flex gap-3">
                <Briefcase className="text-cyan-400 mt-1 flex-shrink-0" size={20} />
                <div>
                  <h4 className="text-sm font-bold text-cyan-400">Compte Pro</h4>
                  <p className="text-xs text-slate-400 mt-1">Vos documents professionnels (Kbis, Assurance) seront demandés après l'inscription.</p>
                </div>
             </div>
           </div>
       )}

       {/* Social Buttons FIRST for Signup convenience */}
       <div className="grid grid-cols-2 gap-4 mb-6">
          <button 
            type="button" 
            onClick={() => handleSocialLogin('google')}
            disabled={isLoading}
            className="flex items-center justify-center py-3 bg-white text-black rounded-xl font-medium text-sm hover:bg-slate-200 transition-colors disabled:opacity-70 shadow-lg shadow-white/5"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Google
          </button>
          <button 
            type="button" 
            onClick={() => handleSocialLogin('apple')}
            disabled={isLoading}
            className="flex items-center justify-center py-3 bg-[#111] text-white border border-white/10 rounded-xl font-medium text-sm hover:bg-[#222] transition-colors disabled:opacity-70 shadow-lg"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.74s2.57-.99 4.31-.68c.58.03 2.22.25 3.36 1.95-3.02 1.83-2.51 5.56.55 6.78-.65 1.68-1.55 3.34-3.3 4.18zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
            </svg>
            Apple
          </button>
       </div>

       <div className="relative text-center mb-6">
         <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
         <span className="relative bg-zendo-dark px-3 text-xs text-slate-500 font-medium uppercase tracking-wider">ou par email</span>
       </div>

       <form onSubmit={handleSubmit} className="flex-1 flex flex-col gap-4">
         <Input 
           label="Nom complet" 
           icon={<User size={18} />} 
           required 
           value={formData.name}
           onChange={e => setFormData({...formData, name: e.target.value})}
         />
         <Input 
           label="Email" 
           type="email" 
           icon={<Mail size={18} />} 
           required 
           value={formData.email}
           onChange={e => setFormData({...formData, email: e.target.value})}
         />
         <Input 
           label="Téléphone" 
           type="tel" 
           icon={<Phone size={18} />} 
           required 
           value={formData.phone}
           onChange={e => setFormData({...formData, phone: e.target.value})}
         />
         <Input 
           label="Mot de passe" 
           type="password" 
           icon={<Lock size={18} />} 
           required 
           value={formData.password}
           onChange={e => setFormData({...formData, password: e.target.value})}
         />

         {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              {error}
            </div>
         )}

         <div className="mt-auto py-6">
           <label className="flex items-start gap-3 mb-6 cursor-pointer group">
             <div className="relative mt-0.5">
               <input type="checkbox" className="peer sr-only" required />
               <div className="w-5 h-5 border-2 border-slate-600 rounded bg-transparent peer-checked:bg-cyan-500 peer-checked:border-cyan-500 transition-colors"></div>
               <Check size={12} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" />
             </div>
             <span className="text-xs text-slate-400 group-hover:text-slate-300">
               J'accepte les <span className="text-white underline">Conditions Générales</span> et la <span className="text-white underline">Politique de Confidentialité</span>.
             </span>
           </label>

           <Button fullWidth type="submit" isLoading={isLoading}>
             {role === UserRole.ARTISAN ? "Postuler maintenant" : "S'inscrire"}
           </Button>
           
           <div className="text-center mt-4">
             <button type="button" onClick={() => navigate('/auth/login')} className="text-sm text-slate-400">
               Déjà un compte ? <span className="text-white font-semibold">Se connecter</span>
             </button>
           </div>
         </div>
       </form>
    </div>
  );
};