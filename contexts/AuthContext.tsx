import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { AuthService } from '../services/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<string | null>;
  register: (data: any) => Promise<string | null>;
  socialLogin: (provider: 'google' | 'apple', role?: UserRole) => Promise<string | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize session on mount
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('zendo_token');
      // We also store the user object to persist identity in this serverless mock
      const storedUser = localStorage.getItem('zendo_user');

      if (token && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);

          const response = await AuthService.me(token);
          if (!response.success) {
             throw new Error("Token invalid");
          }
        } catch (e) {
          localStorage.removeItem('zendo_token');
          localStorage.removeItem('zendo_user');
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = async (email: string, password: string): Promise<string | null> => {
    try {
      const res = await AuthService.login(email, password);
      if (res.success && res.data) {
        setUser(res.data.user);
        localStorage.setItem('zendo_token', res.data.token);
        localStorage.setItem('zendo_user', JSON.stringify(res.data.user)); 
        return null;
      }
      return res.error || "Une erreur est survenue";
    } catch (e) {
      return "Erreur de connexion";
    }
  };

  const register = async (data: any): Promise<string | null> => {
    try {
      const res = await AuthService.register(data);
      if (res.success && res.data) {
        setUser(res.data.user);
        localStorage.setItem('zendo_token', res.data.token);
        localStorage.setItem('zendo_user', JSON.stringify(res.data.user)); 
        return null;
      }
      return res.error || "Une erreur est survenue";
    } catch (e) {
      return "Erreur d'inscription";
    }
  };

  const socialLogin = async (provider: 'google' | 'apple', role?: UserRole): Promise<string | null> => {
    try {
      const res = await AuthService.socialLogin(provider, role);
      if (res.success && res.data) {
        setUser(res.data.user);
        localStorage.setItem('zendo_token', res.data.token);
        localStorage.setItem('zendo_user', JSON.stringify(res.data.user));
        return null;
      }
      return res.error || "Une erreur est survenue avec le fournisseur social";
    } catch (e) {
      return "Erreur de connexion sociale";
    }
  };

  const logout = () => {
    AuthService.logout();
    setUser(null);
    localStorage.removeItem('zendo_token');
    localStorage.removeItem('zendo_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      register,
      socialLogin,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};