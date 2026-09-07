import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType, LoginCredentials, SignupCredentials, AuthResult } from './authTypes';
import { authService } from './authService';
import { UserProfile } from '../types/user';
import { OnboardingData } from '../types/learning';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const currentUser = await authService.getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Failed to restore auth session', error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<AuthResult> => {
    setIsLoading(true);
    const result = await authService.login(credentials);
    if (result.success && result.user) {
      setUser(result.user);
    }
    setIsLoading(false);
    return result;
  };

  const signup = async (credentials: SignupCredentials): Promise<AuthResult> => {
    setIsLoading(true);
    const result = await authService.signup(credentials);
    if (result.success && result.user) {
      setUser(result.user);
    }
    setIsLoading(false);
    return result;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<AuthResult> => {
    const result = await authService.updateProfile(updates);
    if (result.success && result.user) {
      setUser(result.user);
    }
    return result;
  };

  const updateOnboarding = (data: Partial<OnboardingData>) => {
    if (user) {
      setUser({ ...user, ...data });
    }
  };

  const completeOnboarding = async (data: OnboardingData): Promise<AuthResult> => {
    const result = await authService.completeOnboarding(data);
    if (result.success && result.user) {
      setUser(result.user);
    }
    return result;
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    signup,
    logout,
    updateProfile,
    updateOnboarding,
    completeOnboarding
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
