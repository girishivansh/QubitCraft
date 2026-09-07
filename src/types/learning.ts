export type LearnerType = 'student' | 'educator' | 'developer' | 'researcher' | 'enthusiast';
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';
export type LearningGoal = 
  | 'understand-quantum' 
  | 'build-circuits' 
  | 'learn-algorithms' 
  | 'prepare-exams' 
  | 'practice-programming' 
  | 'explore-research' 
  | 'teach-quantum';
export type LearningPreference = 
  | 'interactive-visualizations' 
  | 'step-by-step-lessons' 
  | 'hands-on-circuits' 
  | 'challenges-quizzes' 
  | 'ai-explanations';

export interface OnboardingData {
  learnerType: LearnerType | null;
  skillLevel: SkillLevel | null;
  goals: LearningGoal[];
  learningPreferences: LearningPreference[];
}
