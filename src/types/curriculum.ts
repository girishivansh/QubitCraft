// Removed unused SkillLevel import

// ─── Difficulty ───
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

// ─── Lesson State ───
export type LessonState = 'completed' | 'current' | 'available' | 'locked';

// ─── Content Block Types ───

export interface HeadingBlock {
  id: string;
  type: 'heading';
  level: 2 | 3 | 4;
  text: string;
}

export interface TextBlock {
  id: string;
  type: 'text';
  content: string;
}

export type CalloutType = 'tip' | 'note' | 'warning' | 'important';

export interface CalloutBlock {
  id: string;
  type: 'callout';
  calloutType: CalloutType;
  title?: string;
  content: string;
}

export interface FormulaBlock {
  id: string;
  type: 'formula';
  expression: string;
  label?: string;
}

export interface CodeBlock {
  id: string;
  type: 'code';
  language: string;
  code: string;
  filename?: string;
  explanation?: string;
}

export interface VisualBlock {
  id: string;
  type: 'visual';
  visualType: string;
  title: string;
  description: string;
  altText: string;
}

export interface InteractiveBlock {
  id: string;
  type: 'interactive';
  interactiveType: string;
  title: string;
  description: string;
}

export interface KnowledgeCheckOption {
  id: string;
  text: string;
}

export interface KnowledgeCheckBlock {
  id: string;
  type: 'knowledge-check';
  question: string;
  questionType: 'multiple-choice' | 'true-false';
  options: KnowledgeCheckOption[];
  correctOptionId: string;
  explanation: string;
  xp: number;
}

export type LessonContentBlock =
  | HeadingBlock
  | TextBlock
  | CalloutBlock
  | FormulaBlock
  | CodeBlock
  | VisualBlock
  | InteractiveBlock
  | KnowledgeCheckBlock;

// ─── Lesson ───
export interface Lesson {
  id: string;
  courseId: string;
  pathId: string;
  title: string;
  description: string;
  objectives: string[];
  duration: string;
  xp: number;
  difficulty: Difficulty;
  order: number;
  contentBlocks: LessonContentBlock[];
  topic: string;
  prerequisites: string[];
  interactiveType?: string;
}

// ─── Course ───
export interface Course {
  id: string;
  pathId: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  prerequisites: string[];
  objectives: string[];
  lessonIds: string[];
  estimatedDuration: string;
  totalXP: number;
}

// ─── Learning Path ───
export interface LearningPathData {
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  icon: string;
  courseIds: string[];
  estimatedDuration: string;
  totalXP: number;
  objectives: string[];
  lessonCount: number;
}

// ─── Achievement ───
export type AchievementCondition =
  | { type: 'lesson-complete'; lessonId: string }
  | { type: 'lessons-completed'; count: number }
  | { type: 'checks-completed'; count: number }
  | { type: 'path-complete'; pathId: string }
  | { type: 'course-complete'; courseId: string };

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: AchievementCondition;
}

// ─── Learning Progress ───
export interface LearningProgressData {
  completedLessonIds: string[];
  completedCheckIds: string[];
  currentLessonId: string | null;
  currentCourseId: string | null;
  currentPathId: string | null;
  lastActiveDate: string | null;
  longestStreak: number;
  unlockedAchievementIds: string[];
}

export const DEFAULT_LEARNING_PROGRESS: LearningProgressData = {
  completedLessonIds: [],
  completedCheckIds: [],
  currentLessonId: null,
  currentCourseId: null,
  currentPathId: null,
  lastActiveDate: null,
  longestStreak: 0,
  unlockedAchievementIds: [],
};

// ─── Search Result ───
export interface SearchResult {
  type: 'path' | 'course' | 'lesson';
  id: string;
  title: string;
  description: string;
  difficulty: Difficulty;
  pathId?: string;
  courseId?: string;
  href: string;
}

// ─── Recommendation ───
export interface Recommendation {
  pathId: string;
  courseId: string;
  title: string;
  description: string;
  reason: string;
  difficulty: Difficulty;
}
