import { UserRole, ServiceType, InterventionStatus, User, AuthResponse } from '../types';

/**
 * ZENDO API CLIENT (MOCK)
 */

const API_DELAY = 800; // ms to simulate network latency

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Helper to generate a consistent mock ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// --- Auth Service ---

export const AuthService = {
  login: async (email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
    return new Promise(resolve => setTimeout(() => {
      // Simulate simple validation
      if (email.includes('@error')) {
        resolve({ success: false, error: "Identifiants invalides." });
      } else {
        // DYNAMIC MOCK: Create user data based on the input email
        const namePart = email.split('@')[0];
        const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
        
        // Determine role based on email keyword or default to Client
        const role = email.toLowerCase().includes('artisan') ? UserRole.ARTISAN : UserRole.CLIENT;

        const user: User = {
          id: `u_${generateId()}`,
          name: formattedName, 
          email: email,        
          phone: "+33612345678",
          role: role,
          avatarUrl: `https://ui-avatars.com/api/?name=${formattedName}&background=06b6d4&color=fff`,
          createdAt: new Date()
        };

        resolve({
          success: true,
          data: {
            token: `jwt_${generateId()}`,
            refreshToken: `refresh_${generateId()}`,
            user: user
          }
        });
      }
    }, API_DELAY));
  },

  register: async (data: any): Promise<ApiResponse<AuthResponse>> => {
    return new Promise(resolve => setTimeout(() => {
      const user: User = {
        id: `u_${generateId()}`,
        name: data.name,
        email: data.email,
        phone: data.phone || "",
        role: data.role,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=06b6d4&color=fff`,
        createdAt: new Date()
      };

      resolve({
        success: true,
        data: {
          token: `jwt_${generateId()}`,
          refreshToken: `refresh_${generateId()}`,
          user: user
        }
      });
    }, API_DELAY));
  },

  // NEW: Social Login Mock
  socialLogin: async (provider: 'google' | 'apple', role: UserRole = UserRole.CLIENT): Promise<ApiResponse<AuthResponse>> => {
    return new Promise(resolve => setTimeout(() => {
      let user: User;

      if (provider === 'google') {
        user = {
          id: `u_google_${generateId()}`,
          name: "Alexandre Martin", // Simulated Google Name
          email: "alex.martin@gmail.com",
          phone: "", // Social logins often don't provide phone immediately
          role: role,
          avatarUrl: "https://lh3.googleusercontent.com/a/default-user=s96-c", // Google style placeholder
          createdAt: new Date()
        };
      } else {
        user = {
          id: `u_apple_${generateId()}`,
          name: "Utilisateur Apple",
          email: "privaterelay@appleid.com", // Simulated Apple Private Relay
          phone: "",
          role: role,
          avatarUrl: undefined, // Apple often returns no avatar
          createdAt: new Date()
        };
      }

      resolve({
        success: true,
        data: {
          token: `jwt_social_${generateId()}`,
          refreshToken: `refresh_social_${generateId()}`,
          user: user
        }
      });
    }, 1500)); // Slightly longer delay for "OAuth redirect" simulation
  },

  logout: async (): Promise<ApiResponse<void>> => {
    return new Promise(resolve => setTimeout(() => resolve({ success: true }), 500));
  },
  
  me: async (token: string): Promise<ApiResponse<User>> => {
    return new Promise(resolve => setTimeout(() => {
       resolve({
        success: true,
        // The data here is ignored by AuthContext in favor of localStorage persistence
        // but we return valid structure to pass the check.
        data: {
          id: "u_verified", 
          name: "Utilisateur Vérifié", 
          email: "verified@zendo.app", 
          phone: "", 
          role: UserRole.CLIENT, 
          createdAt: new Date()
        } 
       });
    }, 500));
  }
};

// --- Intervention Service ---
// (Rest of the file remains unchanged)
export const InterventionService = {
  createRequest: async (
    serviceType: string, 
    description: string, 
    location: { lat: number, lng: number }
  ): Promise<ApiResponse<{ interventionId: string }>> => {
    console.log(`[API] Creating intervention for ${serviceType} at`, location);
    return new Promise(resolve => setTimeout(() => resolve({
      success: true,
      data: { interventionId: `int_${Date.now()}` }
    }), API_DELAY));
  },

  checkStatus: async (interventionId: string): Promise<ApiResponse<{ status: InterventionStatus, artisan?: any }>> => {
    return new Promise(resolve => setTimeout(() => resolve({
      success: true,
      data: {
        status: InterventionStatus.EN_ROUTE,
        artisan: {
          id: 'a1',
          name: 'Jean Michel',
          location: { lat: 48.8566, lng: 2.3522 },
          etaMinutes: 12
        }
      }
    }), API_DELAY));
  }
};

export const ArtisanService = {
  acceptJob: async (interventionId: string): Promise<ApiResponse<void>> => {
    return new Promise(resolve => setTimeout(() => resolve({ success: true }), API_DELAY));
  },
  updateLocation: async (lat: number, lng: number): Promise<void> => {
    console.log(`[API] Location updated: ${lat}, ${lng}`);
  }
};

export const PaymentService = {
  createIntent: async (amount: number): Promise<ApiResponse<{ clientSecret: string }>> => {
    return new Promise(resolve => setTimeout(() => resolve({
      success: true,
      data: { clientSecret: "pi_mock_secret_123456" }
    }), API_DELAY));
  }
};