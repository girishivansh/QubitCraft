import { UserProfile, DEFAULT_USER_STATS } from '../types/user';
import { OnboardingData } from '../types/learning';
import { LoginCredentials, SignupCredentials, AuthResult } from './authTypes';
import { apiFetch } from '../services/apiClient';

const USERS_KEY = 'qubitcraft_users';
const SESSION_KEY = 'qubitcraft_session';

// Fallback password hash for local offline mock
const hashPassword = (password: string) => btoa(password);

const getStoredUsers = (): any[] => {
  const users = localStorage.getItem(USERS_KEY);
  return users ? JSON.parse(users) : [];
};

const saveStoredUsers = (users: any[]) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResult> {
    // 1. Attempt login with MongoDB backend
    const { data, error } = await apiFetch<{ success: boolean; user?: UserProfile; error?: string }>(
      '/api/auth/login',
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      }
    );

    if (data) {
      if (data.success && data.user) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(data.user));
        return { success: true, user: data.user };
      }
      return { success: false, error: data.error || 'Invalid credentials' };
    }

    // 2. Fallback to localStorage if backend is offline/unreachable
    console.warn('Backend unavailable, falling back to local storage for login:', error);
    const users = getStoredUsers();
    const user = users.find(u => u.email === credentials.email && u.passwordHash === hashPassword(credentials.password));
    
    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }

    const { passwordHash: _unused, ...userProfile } = user;
    localStorage.setItem(SESSION_KEY, JSON.stringify(userProfile));
    return { success: true, user: userProfile as UserProfile };
  },

  async signup(credentials: SignupCredentials): Promise<AuthResult> {
    // 1. Attempt signup with MongoDB backend
    const { data, error } = await apiFetch<{ success: boolean; user?: UserProfile; error?: string }>(
      '/api/auth/signup',
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      }
    );

    if (data) {
      if (data.success && data.user) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(data.user));
        return { success: true, user: data.user };
      }
      return { success: false, error: data.error || 'Signup failed' };
    }

    // 2. Fallback to localStorage if backend is offline/unreachable
    console.warn('Backend unavailable, falling back to local storage for signup:', error);
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

    const { passwordHash: _unused, ...userProfile } = newUser;
    localStorage.setItem(SESSION_KEY, JSON.stringify(userProfile));
    return { success: true, user: userProfile as UserProfile };
  },

  async loginWithGoogle(profile?: { name: string; email: string; avatar?: string }): Promise<AuthResult> {
    const payload = {
      name: profile?.name || 'Shivansh Giri',
      email: (profile?.email || 'shivanshgiri@gmail.com').toLowerCase().trim(),
      avatar: profile?.avatar || null
    };

    // 1. Attempt OAuth with MongoDB backend
    const { data, error } = await apiFetch<{ success: boolean; user?: UserProfile; error?: string }>(
      '/api/auth/google',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );

    if (data && data.success && data.user) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(data.user));
      return { success: true, user: data.user };
    }

    // 2. Fallback to localStorage
    console.warn('Backend unavailable, falling back to local storage for Google auth:', error);
    const users = getStoredUsers();
    let user = users.find(u => u.email.toLowerCase() === payload.email);

    if (!user) {
      user = {
        id: crypto.randomUUID(),
        name: payload.name,
        email: payload.email,
        passwordHash: '',
        avatar: payload.avatar,
        role: 'student',
        onboardingCompleted: false,
        learnerType: null,
        skillLevel: null,
        goals: [],
        learningPreferences: [],
        ...DEFAULT_USER_STATS,
        createdAt: new Date().toISOString()
      };
      users.push(user);
      saveStoredUsers(users);
    }

    const { passwordHash: _unused, ...userProfile } = user;
    localStorage.setItem(SESSION_KEY, JSON.stringify(userProfile));
    return { success: true, user: userProfile as UserProfile };
  },

  async logout(): Promise<void> {
    localStorage.removeItem(SESSION_KEY);
  },

  async getCurrentUser(): Promise<UserProfile | null> {
    const session = localStorage.getItem(SESSION_KEY);
    if (!session) return null;

    try {
      const parsed = JSON.parse(session) as UserProfile;
      // Background revalidation with backend if user id exists
      if (parsed.id) {
        apiFetch<UserProfile>(`/api/auth/user/${parsed.id}`)
          .then(({ data }) => {
            if (data) {
              localStorage.setItem(SESSION_KEY, JSON.stringify(data));
            }
          })
          .catch(() => {});
      }
      return parsed;
    } catch {
      return null;
    }
  },

  async updateProfile(updates: Partial<UserProfile>): Promise<AuthResult> {
    const session = localStorage.getItem(SESSION_KEY);
    if (!session) return { success: false, error: 'Not authenticated' };

    const currentUser = JSON.parse(session);
    const updatedUser = { ...currentUser, ...updates };

    // Update local session immediately for smooth UI
    localStorage.setItem(SESSION_KEY, JSON.stringify(updatedUser));

    // Update in local fallback storage
    const users = getStoredUsers();
    const userIndex = users.findIndex(u => u.id === updatedUser.id);
    if (userIndex !== -1) {
      users[userIndex] = { ...users[userIndex], ...updates };
      saveStoredUsers(users);
    }

    // Attempt persist to MongoDB backend
    if (updatedUser.id) {
      const { data } = await apiFetch<{ success: boolean; user?: UserProfile; error?: string }>(
        `/api/auth/profile/${updatedUser.id}`,
        {
          method: 'PUT',
          body: JSON.stringify(updates),
        }
      );

      if (data && data.success && data.user) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(data.user));
        return { success: true, user: data.user };
      }
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
