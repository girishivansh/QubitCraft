import { LearningProgressData, DEFAULT_LEARNING_PROGRESS, LessonState, Achievement } from '../types/curriculum';
import { XP } from '../config/xp';

const getProgressKey = (userId: string) => `qubitcraft_progress_${userId}`;

export const progressService = {
  getProgress(userId: string): LearningProgressData {
    const data = localStorage.getItem(getProgressKey(userId));
    if (!data) return { ...DEFAULT_LEARNING_PROGRESS };
    try {
      return JSON.parse(data) as LearningProgressData;
    } catch {
      return { ...DEFAULT_LEARNING_PROGRESS };
    }
  },

  saveProgress(userId: string, progress: LearningProgressData): void {
    localStorage.setItem(getProgressKey(userId), JSON.stringify(progress));
  },

  completeLesson(
    userId: string, 
    lessonId: string, 
    courseId: string, 
    pathId: string,
    allLessonIdsInCourse: string[],
    currentStreakProfile: number
  ): { xpEarned: number; isNewCompletion: boolean; courseCompleted: boolean; courseXP: number } {
    const progress = this.getProgress(userId);
    
    if (progress.completedLessonIds.includes(lessonId)) {
      return { xpEarned: 0, isNewCompletion: false, courseCompleted: false, courseXP: 0 };
    }

    progress.completedLessonIds.push(lessonId);
    progress.currentLessonId = lessonId;
    progress.currentCourseId = courseId;
    progress.currentPathId = pathId;

    const courseCompleted = allLessonIdsInCourse.every(id => progress.completedLessonIds.includes(id));
    
    let xpEarned = XP.LESSON_COMPLETE;
    let courseXP = 0;
    
    if (courseCompleted) {
      xpEarned += XP.COURSE_COMPLETE;
      courseXP = XP.COURSE_COMPLETE;
    }

    this.updateStreak(userId, currentStreakProfile, progress);
    
    // Note: updateStreak updates progress.longestStreak and progress.lastActiveDate, 
    // so we just save the final object.
    this.saveProgress(userId, progress);

    return { xpEarned, isNewCompletion: true, courseCompleted, courseXP };
  },

  completeKnowledgeCheck(userId: string, checkId: string): { xpEarned: number; isNewCompletion: boolean } {
    const progress = this.getProgress(userId);
    
    if (progress.completedCheckIds.includes(checkId)) {
      return { xpEarned: 0, isNewCompletion: false };
    }

    progress.completedCheckIds.push(checkId);
    this.saveProgress(userId, progress);

    return { xpEarned: XP.KNOWLEDGE_CHECK, isNewCompletion: true };
  },

  updateStreak(userId: string, currentStreakFromProfile: number, existingProgress?: LearningProgressData): { currentStreak: number; longestStreak: number } {
    const progress = existingProgress || this.getProgress(userId);
    const today = new Date().toISOString().split('T')[0];
    
    let currentStreak = currentStreakFromProfile;
    
    if (progress.lastActiveDate === today) {
      return { currentStreak: currentStreakFromProfile, longestStreak: progress.longestStreak };
    }
    
    if (progress.lastActiveDate) {
      const lastDate = new Date(progress.lastActiveDate);
      const currentDate = new Date(today);
      const diffTime = Math.abs(currentDate.getTime() - lastDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        currentStreak += 1;
      } else {
        currentStreak = 1;
      }
    } else {
      currentStreak = 1;
    }
    
    progress.longestStreak = Math.max(progress.longestStreak, currentStreak);
    progress.lastActiveDate = today;
    
    if (!existingProgress) {
      this.saveProgress(userId, progress);
    }
    
    return { currentStreak, longestStreak: progress.longestStreak };
  },

  getLessonState(userId: string, lessonId: string, lessonOrder: number, courseLessonIds: string[]): LessonState {
    const progress = this.getProgress(userId);
    
    if (progress.completedLessonIds.includes(lessonId)) {
      return 'completed';
    }
    
    if (lessonOrder === 1) {
      return 'available';
    }
    
    const prevLessonId = courseLessonIds[lessonOrder - 2];
    if (prevLessonId && progress.completedLessonIds.includes(prevLessonId)) {
      return 'available';
    }
    
    return 'locked';
  },

  getNextLessonId(userId: string, courseLessonIds: string[]): string | null {
    const progress = this.getProgress(userId);
    for (const id of courseLessonIds) {
      if (!progress.completedLessonIds.includes(id)) {
        return id;
      }
    }
    return null;
  },

  checkAchievements(userId: string, achievements: Achievement[], pathLessonIdsMap?: Record<string, string[]>): string[] {
    const progress = this.getProgress(userId);
    const newlyUnlocked: string[] = [];
    
    achievements.forEach(achievement => {
      if (progress.unlockedAchievementIds.includes(achievement.id)) return;
      
      let unlocked = false;
      const cond = achievement.condition;
      
      switch (cond.type) {
        case 'lesson-complete':
          if (progress.completedLessonIds.includes(cond.lessonId)) unlocked = true;
          break;
        case 'lessons-completed':
          if (progress.completedLessonIds.length >= cond.count) unlocked = true;
          break;
        case 'checks-completed':
          if (progress.completedCheckIds.length >= cond.count) unlocked = true;
          break;
        case 'path-complete':
          if (pathLessonIdsMap && pathLessonIdsMap[cond.pathId]) {
             unlocked = pathLessonIdsMap[cond.pathId].every(id => progress.completedLessonIds.includes(id));
          }
          break;
        case 'course-complete':
          if (pathLessonIdsMap && pathLessonIdsMap[cond.courseId]) {
             unlocked = pathLessonIdsMap[cond.courseId].every(id => progress.completedLessonIds.includes(id));
          }
          break;
      }
      
      if (unlocked) {
        newlyUnlocked.push(achievement.id);
        progress.unlockedAchievementIds.push(achievement.id);
      }
    });
    
    if (newlyUnlocked.length > 0) {
      this.saveProgress(userId, progress);
    }
    
    return newlyUnlocked;
  }
};
