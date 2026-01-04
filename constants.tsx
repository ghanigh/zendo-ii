import { ServiceType, ServiceDefinition, Artisan, UserRole, ArtisanStatus, AvailabilityStatus } from './types';
import { Wrench, Zap, Key, Thermometer } from 'lucide-react';

export const SERVICES: ServiceDefinition[] = [
  {
    id: ServiceType.PLUMBING,
    label: 'Plomberie',
    icon: Wrench,
    color: 'text-cyan-400',
    bgGradient: 'from-cyan-500/20 to-cyan-900/40',
  },
  {
    id: ServiceType.ELECTRICITY,
    label: 'Électricité',
    icon: Zap,
    color: 'text-yellow-400',
    bgGradient: 'from-yellow-500/20 to-yellow-900/40',
  },
  {
    id: ServiceType.LOCKSMITH,
    label: 'Serrurerie',
    icon: Key,
    color: 'text-rose-400',
    bgGradient: 'from-rose-500/20 to-rose-900/40',
  },
  {
    id: ServiceType.HVAC,
    label: 'Climatisation',
    icon: Thermometer,
    color: 'text-blue-400',
    bgGradient: 'from-blue-500/20 to-blue-900/40',
  }
];

export const MOCK_ARTISANS: Artisan[] = [
  {
    id: 'a1',
    name: 'Jean Michel',
    email: 'jean.michel@example.com',
    phone: '+33612345678',
    role: UserRole.ARTISAN,
    level: ArtisanStatus.ELITE,
    availability: AvailabilityStatus.ONLINE,
    rating: 4.9,
    jobsCompleted: 342,
    specialty: ServiceType.PLUMBING,
    location: { lat: 48.8566, lng: 2.3522 },
    avatarUrl: 'https://picsum.photos/100/100?random=1',
    createdAt: new Date()
  },
  {
    id: 'a2',
    name: 'Sarah Connor',
    email: 'sarah.connor@example.com',
    phone: '+33698765432',
    role: UserRole.ARTISAN,
    level: ArtisanStatus.PRO_PLUS,
    availability: AvailabilityStatus.BUSY,
    rating: 4.7,
    jobsCompleted: 120,
    specialty: ServiceType.ELECTRICITY,
    location: { lat: 48.8606, lng: 2.3376 },
    avatarUrl: 'https://picsum.photos/100/100?random=2',
    createdAt: new Date()
  }
];

export const APP_NAME = "ZENDO";