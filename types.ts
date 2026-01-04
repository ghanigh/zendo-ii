export enum UserRole {
  CLIENT = 'CLIENT',
  ARTISAN = 'ARTISAN',
  ADMIN = 'ADMIN'
}

export enum ServiceType {
  PLUMBING = 'PLUMBING',
  ELECTRICITY = 'ELECTRICITY',
  LOCKSMITH = 'LOCKSMITH',
  HVAC = 'HVAC'
}

export enum ArtisanStatus {
  STANDARD = 'STANDARD',
  PRO_PLUS = 'PRO_PLUS',
  ELITE = 'ELITE'
}

export enum AvailabilityStatus {
  ONLINE = 'ONLINE',
  BUSY = 'BUSY',
  OFFLINE = 'OFFLINE'
}

export enum InterventionStatus {
  SEARCHING = 'SEARCHING',
  ACCEPTED = 'ACCEPTED',
  EN_ROUTE = 'EN_ROUTE',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED'
}

export interface User {
  id: string;
  name: string;
  email: string; // Added email
  phone: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: Date;
}

export interface Artisan extends User {
  role: UserRole.ARTISAN;
  level: ArtisanStatus; 
  availability: AvailabilityStatus;
  rating: number;
  jobsCompleted: number;
  specialty: ServiceType;
  location: { lat: number; lng: number };
  stripeAccountId?: string;
}

export interface ServiceDefinition {
  id: ServiceType;
  label: string;
  icon: any; 
  color: string;
  bgGradient: string;
}

export interface Intervention {
  id: string;
  clientId: string;
  artisanId?: string;
  serviceType: ServiceType;
  description: string;
  photos: string[];
  status: InterventionStatus;
  priceEstimate?: number;
  priceFinal?: number;
  location: { lat: number; lng: number; address: string };
  createdAt: Date;
  completedAt?: Date;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}