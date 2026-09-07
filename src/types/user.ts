export type UserRole = 'student' | 'instructor' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  role: UserRole;
  onboardingCompleted: boolean;
  learnerType: string | null;
  skillLevel: string | null;
  goals: string[];
  learningPreferences: string[];
  xp: number;
  streak: number;
  lessonsCompleted: number;
  circuitsBuilt: number;
  challengesCompleted: number;
  createdAt: string;
}

export const DEFAULT_USER_STATS = {
  xp: 0,
  streak: 0,
  lessonsCompleted: 0,
  circuitsBuilt: 0,
  challengesCompleted: 0,
} as const;
