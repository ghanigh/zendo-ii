import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { SERVICES } from '../constants';
import { Button } from '../components/Button';
import { ArrowLeft, Camera, X, MapPin } from 'lucide-react';
import { useData } from '../contexts/DataContext';
import { ServiceType } from '../types';

export const RequestFlow: React.FC = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { createIntervention } = useData();
  const service = SERVICES.find(s => s.id === serviceId);
  
  // Get location data passed from ClientHome
  const locationState = location.state?.location;
  
  // Default fallback location if user didn't select anything
  const finalLocation = locationState || { 
    lat: 48.8566, 
    lng: 2.3522, 
    address: "12 Rue de la Paix, 75002 Paris" 
  };

  const [description, setDescription] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock handling file upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Create fake object URL for preview
      const url = URL.createObjectURL(e.target.files[0]);
      setImages([...images, url]);
    }
  };

  const handleRequest = async () => {
    if (!serviceId) return;
    setIsSubmitting(true);
    
    try {
      // Create actual data in our Context "Database"
      const interventionId = await createIntervention(
        serviceId as ServiceType,
        description,
        finalLocation // Pass the real address object
      );
      
      // Navigate to Matching with the specific ID
      navigate('/matching', { state: { interventionId } });
    } catch (error) {
      console.error("Failed to create request", error);
      setIsSubmitting(false);
    }
  };

  if (!service) return <div>Service not found</div>;

  return (
    <div className="min-h-screen bg-zendo-dark flex flex-col p-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 rounded-full hover:bg-slate-800 transition-colors">
          <ArrowLeft size={24} className="text-slate-300" />
        </button>
        <div>
          <h1 className="text-xl font-bold">{service.label}</h1>
          <p className="text-xs text-slate-400">Nouvelle demande</p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 flex flex-col gap-6">
        
        {/* Location Recap */}
        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 flex items-start gap-3">
          <MapPin className="text-zendo-primary mt-1" size={18} />
          <div>
            <p className="text-xs text-slate-400 mb-1">Intervention à :</p>
            <p className="text-sm font-semibold text-white line-clamp-2">{finalLocation.address}</p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300">Quel est le problème ?</label>
          <textarea
            className="w-full bg-zendo-card border border-slate-700 rounded-xl p-4 text-white focus:ring-2 focus:ring-cyan-500 focus:outline-none min-h-[120px]"
            placeholder="Décrivez votre problème en détail..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-300">Photos (Optionnel)</label>
          <div className="flex gap-3 overflow-x-auto pb-2">
            <label className="flex-shrink-0 w-24 h-24 rounded-xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-cyan-500 hover:text-cyan-500 transition-colors text-slate-500 bg-zendo-card">
              <Camera size={24} />
              <span className="text-xs font-medium">Ajouter</span>
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
            
            {images.map((img, idx) => (
              <div key={idx} className="relative flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden border border-slate-700">
                <img src={img} alt="preview" className="w-full h-full object-cover" />
                <button 
                  onClick={() => setImages(images.filter((_, i) => i !== idx))}
                  className="absolute top-1 right-1 bg-black/50 p-1 rounded-full text-white backdrop-blur-sm"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800 mt-auto mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-400">Frais de déplacement</span>
            <span className="text-sm font-semibold">49.00 €</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400">Estimation horaire</span>
            <span className="text-sm font-semibold">~60-80 €/h</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-3 italic">
            * Le prix final sera confirmé par l'artisan sur place via un devis.
          </p>
        </div>

        <Button 
          fullWidth 
          onClick={handleRequest} 
          disabled={description.length < 5}
          isLoading={isSubmitting}
        >
          Trouver un artisan
        </Button>
      </div>
    </div>
  );
};