import { UserProfile } from '../types/user';
import { OnboardingData } from '../types/learning';

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignupCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResult {
  success: boolean;
  user?: UserProfile;
  error?: string;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<AuthResult>;
  signup: (credentials: SignupCredentials) => Promise<AuthResult>;
  logout: () => void;
  updateProfile: (updates: Partial<UserProfile>) => Promise<AuthResult>;
  updateOnboarding: (data: Partial<OnboardingData>) => void;
  completeOnboarding: (data: OnboardingData) => Promise<AuthResult>;
}
