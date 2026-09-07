import { UserProfile, DEFAULT_USER_STATS } from '../types/user';
import { OnboardingData } from '../types/learning';
import { LoginCredentials, SignupCredentials, AuthResult } from './authTypes';

// DEV ONLY: Uses localStorage to simulate a database. Do not use this in production.
const USERS_KEY = 'qubitcraft_users';
const SESSION_KEY = 'qubitcraft_session';

// DEV ONLY: Simple base64 encoding instead of actual secure hashing.
const hashPassword = (password: string) => btoa(password);

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getStoredUsers = (): any[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

const saveStoredUsers = (users: any[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResult> {
    await delay(500); // Simulate network latency
    const users = getStoredUsers();
    
    const user = users.find(u => u.email === credentials.email && u.passwordHash === hashPassword(credentials.password));
    
    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }

    const { passwordHash, ...userProfile } = user;
    localStorage.setItem(SESSION_KEY, JSON.stringify(userProfile));
    
    return { success: true, user: userProfile as UserProfile };
  },

  async signup(credentials: SignupCredentials): Promise<AuthResult> {
    await delay(500);
    const users = getStoredUsers();
    
    if (users.some(u => u.email === credentials.email)) {
      return { success: false, error: 'An account with this email already exists' };
    }

    const newUser = {
      id: crypto.randomUUID(),
      name: credentials.name,
      email: credentials.email,
      passwordHash: hashPassword(credentials.password),
      avatar: null,
      role: 'student',
      onboardingCompleted: false,
      learnerType: null,
      skillLevel: null,
      goals: [],
      learningPreferences: [],
      ...DEFAULT_USER_STATS,
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    saveStoredUsers(users);

    const { passwordHash, ...userProfile } = newUser;
    localStorage.setItem(SESSION_KEY, JSON.stringify(userProfile));

    return { success: true, user: userProfile as UserProfile };
  },

  async logout(): Promise<void> {
    await delay(300);
    localStorage.removeItem(SESSION_KEY);
  },

  async getCurrentUser(): Promise<UserProfile | null> {
    await delay(300);
    const session = localStorage.getItem(SESSION_KEY);
    return session ? JSON.parse(session) : null;
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<AuthResult> {
    await delay(400);
    const session = localStorage.getItem(SESSION_KEY);
    if (!session) return { success: false, error: 'Not authenticated' };

    const currentUser = JSON.parse(session);
    const updatedUser = { ...currentUser, ...updates };
    
    // Update session
    localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));
    
    // Update db
    const users = getStoredUsers();
    const userIndex = users.findIndex(u => u.id === updatedUser.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      saveStoredUsers(users);
    }

    return { success: true, user: updatedUser as UserProfile };
  },

  async completeOnboarding(data: OnboardingData): Promise<AuthResult> {
    return this.updateProfile({
      ...data,
      onboardingCompleted: true
    });
  }
};
