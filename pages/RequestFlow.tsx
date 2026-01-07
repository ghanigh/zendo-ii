import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { SERVICES } from '../constants';
import { Button } from '../components/Button';
import { ArrowLeft, Camera, X, MapPin, ChevronRight, Info } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { ServiceType } from '../types';
import { LiveMap } from '../components/LiveMap';

export const RequestFlow: React.FC = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { createIntervention } = useData();
  const service = SERVICES.find(s => s.id === serviceId);
  
  const locationState = location.state?.location;
  const finalLocation = locationState || { lat: 48.8566, lng: 2.3522, address: "Paris, France" };

  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const url = URL.createObjectURL(e.target.files[0]);
      setImages([...images, url]);
    }
  };

  const handleRequest = async () => {
    if (!serviceId) return;
    setIsSubmitting(true);
    
    try {
      const interventionId = await createIntervention(
        serviceId as ServiceType,
        description,
        finalLocation
      );
      navigate('/matching', { state: { interventionId } });
    } catch (error) {
      console.error("Failed", error);
      setIsSubmitting(false);
    }
  };

  if (!service) return <div>Service not found</div>;

  return (
    <div className="h-screen bg-zendo-dark flex flex-col relative">
      
      {/* --- TOP MAP HEADER --- */}
      <div className="h-[35%] w-full relative">
        <LiveMap status="selecting" userLocation={finalLocation} />
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)} 
          className="absolute top-4 left-4 z-50 w-10 h-10 bg-white rounded-full text-black flex items-center justify-center shadow-lg active:scale-90 transition-transform"
        >
          <ArrowLeft size={20} />
        </button>

        {/* Location Overlay Pill */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white text-black px-4 py-2 rounded-full shadow-xl flex items-center gap-2 max-w-[90%]">
           <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
           <span className="text-xs font-bold truncate">{finalLocation.address}</span>
        </div>
      </div>

      {/* --- BOTTOM FORM SHEET --- */}
      <div className="flex-1 bg-zendo-dark rounded-t-3xl -mt-6 relative z-10 border-t border-white/10 flex flex-col shadow-[0_-10px_30px_rgba(0,0,0,0.5)]">
        <div className="w-12 h-1 bg-slate-700 rounded-full mx-auto mt-3 mb-4"></div>

        <div className="px-6 pb-6 flex-1 flex flex-col overflow-y-auto">
          {/* Service Header */}
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br ${service.bgGradient}`}>
               <service.icon size={24} className="text-white" />
            </div>
            <div>
               <h1 className="text-xl font-bold text-white">{service.label}</h1>
               <p className="text-xs text-slate-400">Intervention rapide • <span className="text-emerald-400">Arrivée 14:30</span></p>
            </div>
            <div className="ml-auto text-right">
               <span className="block text-xl font-bold text-white">49€</span>
            </div>
          </div>

          <div className="space-y-4">
             {/* Problem Description */}
             <div className="bg-zendo-card border border-white/5 rounded-2xl p-4">
                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block tracking-wider">Détails du problème</label>
                <textarea
                  className="w-full bg-transparent border-none focus:outline-none text-white text-sm min-h-[80px] placeholder:text-slate-600 resize-none"
                  placeholder="Ex: Le robinet de la cuisine fuit abondamment..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
             </div>

             {/* Photos */}
             <div>
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                  <label className="flex-shrink-0 w-20 h-20 rounded-xl bg-slate-800 border border-dashed border-slate-600 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-slate-700 transition-colors">
                    <Camera size={20} className="text-cyan-400" />
                    <span className="text-[10px] text-slate-400">Photo</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  </label>
                  
                  {images.map((img, idx) => (
                    <div key={idx} className="relative flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border border-slate-700">
                      <img src={img} alt="preview" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => setImages(images.filter((_, i) => i !== idx))}
                        className="absolute top-0.5 right-0.5 bg-black/50 p-0.5 rounded-full text-white backdrop-blur-sm"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                </div>
             </div>
             
             {/* Price Info Box */}
             <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-3 flex items-start gap-3">
                <Info size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-slate-300 leading-relaxed">
                   Le montant de 49€ couvre le déplacement. Le devis final sera établi sur place avant travaux.
                </p>
             </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className="p-4 border-t border-white/10 bg-zendo-dark pb-safe">
           <Button 
             fullWidth 
             onClick={handleRequest} 
             disabled={description.length < 5}
             isLoading={isSubmitting}
             className="h-14 text-lg"
           >
             Confirmer la demande
           </Button>
        </div>
      </div>
    </div>
  );
};