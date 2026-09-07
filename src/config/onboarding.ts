import { GraduationCap, BookOpen, Code, MonitorPlay, Sparkles } from 'lucide-react';
import { LearnerType, SkillLevel, LearningGoal, LearningPreference } from '../types/learning';

export const LEARNER_TYPES = [
  { id: 'student' as LearnerType, label: 'Student', description: 'Currently studying or preparing for exams', icon: GraduationCap },
  { id: 'educator' as LearnerType, label: 'Educator', description: 'Teaching or creating quantum content', icon: BookOpen },
  { id: 'developer' as LearnerType, label: 'Developer', description: 'Building quantum applications', icon: Code },
  { id: 'researcher' as LearnerType, label: 'Researcher', description: 'Exploring quantum computing research', icon: MonitorPlay },
  { id: 'enthusiast' as LearnerType, label: 'Quantum Enthusiast', description: 'Curious about quantum computing', icon: Sparkles }
];

export interface SkillLevelOption {
  key: string;
  label: string;
  description: string;
  level: SkillLevel;
}

export const SKILL_LEVEL_OPTIONS: SkillLevelOption[] = [
  { key: 'complete-beginner', label: 'Complete Beginner', description: 'No prior quantum computing experience', level: 'beginner' },
  { key: 'know-basics', label: 'I know the basics', description: 'Familiar with basic quantum concepts', level: 'beginner' },
  { key: 'comfortable-circuits', label: 'Comfortable with quantum circuits', description: 'Can build and understand basic quantum circuits', level: 'intermediate' },
  { key: 'worked-algorithms', label: 'I have worked with quantum algorithms', description: 'Experience implementing quantum algorithms', level: 'advanced' },
  { key: 'expert', label: 'Advanced', description: 'Deep expertise in quantum computing', level: 'advanced' },
];

export const LEARNING_GOALS = [
  { id: 'understand-quantum' as LearningGoal, label: 'Understand quantum mechanics' },
  { id: 'build-circuits' as LearningGoal, label: 'Build quantum circuits' },
  { id: 'learn-algorithms' as LearningGoal, label: 'Learn quantum algorithms' },
  { id: 'prepare-exams' as LearningGoal, label: 'Prepare for exams or interviews' },
  { id: 'practice-programming' as LearningGoal, label: 'Practice quantum programming' },
  { id: 'explore-research' as LearningGoal, label: 'Explore latest research' },
  { id: 'teach-quantum' as LearningGoal, label: 'Teach quantum computing' },
];

export const LEARNING_PREFERENCES = [
  { id: 'interactive-visualizations' as LearningPreference, label: 'Interactive visualisations' },
  { id: 'step-by-step-lessons' as LearningPreference, label: 'Step-by-step lessons' },
  { id: 'hands-on-circuits' as LearningPreference, label: 'Hands-on circuit building' },
  { id: 'challenges-quizzes' as LearningPreference, label: 'Challenges and quizzes' },
  { id: 'ai-explanations' as LearningPreference, label: 'AI-assisted explanations' },
];

export const RECOMMENDED_PATHS: Record<SkillLevel, { pathName: string; firstLesson: string; description: string }> = {
  beginner: { pathName: 'Quantum Foundations', firstLesson: 'Understanding Qubits', description: 'Start with the fundamentals of quantum mechanics and build your way up to quantum circuits.' },
  intermediate: { pathName: 'Quantum Circuit Mastery', firstLesson: 'Quantum Gates', description: 'Deepen your understanding of quantum gates, circuits, and hands-on simulation.' },
  advanced: { pathName: 'Quantum Algorithms', firstLesson: 'Introduction to Quantum Algorithms', description: 'Dive into Shor\'s, Grover\'s, and cutting-edge quantum algorithms with interactive walkthroughs.' },
};
