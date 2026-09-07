import { SkillLevel } from '../types/learning';
import { Recommendation } from '../types/curriculum';

const PATHS = {
  'quantum-foundations': { 
    id: 'quantum-foundations', 
    title: 'Quantum Foundations', 
    lessonIds: [
      'qf-what-is-quantum-computing', 
      'qf-understanding-qubits', 
      'qf-superposition', 
      'qf-quantum-measurement', 
      'qf-quantum-gates', 
      'qf-build-first-circuit'
    ] 
  },
  'quantum-circuit-mastery': { 
    id: 'quantum-circuit-mastery', 
    title: 'Quantum Circuit Mastery', 
    lessonIds: [
      'qcm-circuit-fundamentals', 
      'qcm-single-qubit-gates', 
      'qcm-multi-qubit-gates', 
      'qcm-cnot-gate', 
      'qcm-quantum-entanglement', 
      'qcm-bell-states', 
      'qcm-quantum-teleportation'
    ] 
  },
  'quantum-algorithms': { 
    id: 'quantum-algorithms', 
    title: 'Quantum Algorithms', 
    lessonIds: [
      'qa-intro-quantum-algorithms', 
      'qa-deutsch-algorithm', 
      'qa-deutsch-jozsa-algorithm', 
      'qa-grovers-algorithm', 
      'qa-quantum-fourier-transform', 
      'qa-shors-algorithm'
    ] 
  }
};

export const recommendationService = {
  getRecommendedPath(skillLevel: SkillLevel | null, completedLessonIds: string[]): { pathId: string; reason: string } {
    const isCompleted = (pathId: keyof typeof PATHS) => PATHS[pathId].lessonIds.every(id => completedLessonIds.includes(id));
    
    if (skillLevel === 'advanced') {
      if (isCompleted('quantum-algorithms')) {
        return { pathId: 'quantum-algorithms', reason: 'You have completed all advanced content. Consider reviewing to master the concepts.' };
      }
      return { pathId: 'quantum-algorithms', reason: 'Based on your advanced knowledge, dive straight into complex algorithms.' };
    }
    
    if (skillLevel === 'intermediate') {
      if (isCompleted('quantum-circuit-mastery')) {
        if (!isCompleted('quantum-algorithms')) {
          return { pathId: 'quantum-algorithms', reason: 'You have mastered circuits, time to learn algorithms!' };
        }
        return { pathId: 'quantum-circuit-mastery', reason: 'Review your circuit mastery skills.' };
      }
      return { pathId: 'quantum-circuit-mastery', reason: 'Your intermediate skills make this the perfect starting point.' };
    }
    
    // beginner or null
    if (isCompleted('quantum-foundations')) {
      if (!isCompleted('quantum-circuit-mastery')) {
        return { pathId: 'quantum-circuit-mastery', reason: "You have built a solid foundation. Let's learn circuits!" };
      }
      return { pathId: 'quantum-foundations', reason: 'Review the foundations to solidify your knowledge.' };
    }
    return { pathId: 'quantum-foundations', reason: 'The perfect starting point for your quantum journey.' };
  },

  getRecommendations(params: { skillLevel: SkillLevel | null; learnerType: string | null; goals: string[]; completedLessonIds: string[]; currentPathId: string | null }): Recommendation[] {
    const recs: Recommendation[] = [];
    const mainRec = this.getRecommendedPath(params.skillLevel, params.completedLessonIds);
    
    const difficultyMap: Record<string, 'beginner' | 'intermediate' | 'advanced'> = {
      'quantum-foundations': 'beginner',
      'quantum-circuit-mastery': 'intermediate',
      'quantum-algorithms': 'advanced'
    };

    recs.push({
      pathId: mainRec.pathId,
      courseId: mainRec.pathId, // Course IDs match path IDs here
      title: PATHS[mainRec.pathId as keyof typeof PATHS].title,
      description: 'Your primary recommended learning path based on your profile.',
      reason: mainRec.reason,
      difficulty: difficultyMap[mainRec.pathId] || 'beginner'
    });
    
    // If they want to learn algorithms and didn't get recommended it...
    if (params.goals.includes('learn-algorithms') && mainRec.pathId !== 'quantum-algorithms') {
      const isCompleted = PATHS['quantum-algorithms'].lessonIds.every(id => params.completedLessonIds.includes(id));
      if (!isCompleted) {
        recs.push({
          pathId: 'quantum-algorithms',
          courseId: 'quantum-algorithms',
          title: 'Quantum Algorithms',
          description: 'Explore Grovers and Shors algorithms.',
          reason: 'Matches your goal to learn quantum algorithms.',
          difficulty: 'advanced'
        });
      }
    }
    
    return recs;
  },

  getContinueLearning(completedLessonIds: string[], currentLessonId: string | null, _currentCourseId: string | null, currentPathId: string | null): { pathId: string; courseId: string; lessonId: string; lessonTitle: string; pathTitle: string; courseTitle: string; lessonNumber: number; totalLessons: number; progress: number } | null {
    if (completedLessonIds.length === 0 && !currentLessonId) return null;
    
    let targetPathId = currentPathId;
    let targetLessonId = currentLessonId;
    
    if (!targetPathId || !targetLessonId) {
       for (const pathKey of Object.keys(PATHS) as Array<keyof typeof PATHS>) {
           const path = PATHS[pathKey];
           const uncompleted = path.lessonIds.find(id => !completedLessonIds.includes(id));
           // If they have started this path but not finished it
           if (uncompleted && path.lessonIds.some(id => completedLessonIds.includes(id))) {
               targetPathId = path.id;
               targetLessonId = uncompleted;
               break;
           }
       }
    } else {
        const path = PATHS[targetPathId as keyof typeof PATHS];
        if (path) {
            targetLessonId = path.lessonIds.find(id => !completedLessonIds.includes(id)) || null;
        }
    }
    
    if (!targetPathId || !targetLessonId) return null;
    
    const pathInfo = PATHS[targetPathId as keyof typeof PATHS];
    if (!pathInfo) return null;
    
    const lessonIndex = pathInfo.lessonIds.indexOf(targetLessonId);
    if (lessonIndex === -1) return null;
    
    const formatTitle = (id: string) => id.split('-').slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    
    const completedInCourse = pathInfo.lessonIds.filter(id => completedLessonIds.includes(id)).length;
    
    return {
      pathId: pathInfo.id,
      courseId: pathInfo.id,
      lessonId: targetLessonId,
      lessonTitle: formatTitle(targetLessonId),
      pathTitle: pathInfo.title,
      courseTitle: pathInfo.title,
      lessonNumber: lessonIndex + 1,
      totalLessons: pathInfo.lessonIds.length,
      progress: Math.round((completedInCourse / pathInfo.lessonIds.length) * 100)
    };
  }
};
