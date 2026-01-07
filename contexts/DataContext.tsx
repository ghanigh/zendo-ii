import React, { createContext, useContext, useState, useEffect } from 'react';
import { Intervention, InterventionStatus, User, UserRole, ServiceType, Artisan } from '../types';
import { MOCK_ARTISANS } from '../constants';
import { useAuth } from './AuthContext';

interface DataContextType {
  interventions: Intervention[];
  activeIntervention: Intervention | null;
  createIntervention: (serviceType: ServiceType, description: string, location: any) => Promise<string>;
  acceptIntervention: (interventionId: string, artisanId: string) => Promise<void>;
  completeIntervention: (interventionId: string) => Promise<void>;
  cancelIntervention: (interventionId: string) => Promise<void>;
  getInterventionById: (id: string) => Intervention | undefined;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [interventions, setInterventions] = useState<Intervention[]>([]);

  // Load data from local storage on mount
  useEffect(() => {
    const saved = localStorage.getItem('zendo_db_interventions');
    if (saved) {
      setInterventions(JSON.parse(saved));
    }
  }, []);

  // Persist data whenever it changes
  useEffect(() => {
    localStorage.setItem('zendo_db_interventions', JSON.stringify(interventions));
  }, [interventions]);

  // SIMULATION ENGINE: Automatically match 'SEARCHING' requests if no real artisan picks them up
  useEffect(() => {
    const interval = setInterval(() => {
      setInterventions(prev => prev.map(inv => {
        // If searching for > 5 seconds, assign a mock artisan automatically
        if (inv.status === InterventionStatus.SEARCHING) {
          const timeElapsed = new Date().getTime() - new Date(inv.createdAt).getTime();
          if (timeElapsed > 5000) {
            // Find a random mock artisan with the right skill
            const artisan = MOCK_ARTISANS.find(a => a.specialty === inv.serviceType) || MOCK_ARTISANS[0];
            return {
              ...inv,
              status: InterventionStatus.EN_ROUTE,
              artisanId: artisan.id,
              priceEstimate: 80 + Math.random() * 50
            };
          }
        }
        return inv;
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const createIntervention = async (serviceType: ServiceType, description: string, location: any): Promise<string> => {
    if (!user) throw new Error("Must be logged in");

    // Ensure we have a valid location or use a default
    const validLocation = location || { lat: 48.8566, lng: 2.3522, address: "Paris, France" };

    const newIntervention: Intervention = {
      id: `inv_${Date.now()}`,
      clientId: user.id,
      serviceType,
      description,
      photos: [],
      status: InterventionStatus.SEARCHING,
      location: validLocation, 
      createdAt: new Date(),
    };

    setInterventions(prev => [newIntervention, ...prev]);
    return newIntervention.id;
  };

  const acceptIntervention = async (interventionId: string, artisanId: string) => {
    setInterventions(prev => prev.map(inv => 
      inv.id === interventionId 
        ? { ...inv, status: InterventionStatus.EN_ROUTE, artisanId } 
        : inv
    ));
  };

  const completeIntervention = async (interventionId: string) => {
    setInterventions(prev => prev.map(inv => 
      inv.id === interventionId 
        ? { ...inv, status: InterventionStatus.COMPLETED, completedAt: new Date() } 
        : inv
    ));
  };

  const cancelIntervention = async (interventionId: string) => {
    setInterventions(prev => prev.map(inv => 
      inv.id === interventionId 
        ? { ...inv, status: InterventionStatus.CANCELLED } 
        : inv
    ));
  };

  const getInterventionById = (id: string) => {
    return interventions.find(i => i.id === id);
  };

  // Derived state: Active intervention for the current user
  const activeIntervention = interventions.find(i => 
    (i.clientId === user?.id || i.artisanId === user?.id) && 
    [InterventionStatus.SEARCHING, InterventionStatus.ACCEPTED, InterventionStatus.EN_ROUTE, InterventionStatus.IN_PROGRESS].includes(i.status)
  ) || null;

  return (
    <DataContext.Provider value={{
      interventions,
      activeIntervention,
      createIntervention,
      acceptIntervention,
      completeIntervention,
      cancelIntervention,
      getInterventionById
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};