import type { Lesson } from '../../../types/curriculum';
import { QUANTUM_FOUNDATIONS_LESSONS } from './quantum-foundations';
import { QUANTUM_CIRCUIT_MASTERY_LESSONS } from './quantum-circuit-mastery';
import { QUANTUM_ALGORITHMS_LESSONS } from './quantum-algorithms';

export {
  QUANTUM_FOUNDATIONS_LESSONS,
  QUANTUM_CIRCUIT_MASTERY_LESSONS,
  QUANTUM_ALGORITHMS_LESSONS
};

export const ALL_LESSONS: Lesson[] = [
  ...QUANTUM_FOUNDATIONS_LESSONS,
  ...QUANTUM_CIRCUIT_MASTERY_LESSONS,
  ...QUANTUM_ALGORITHMS_LESSONS
];

export function getLessonById(id: string): Lesson | undefined {
  return ALL_LESSONS.find(lesson => lesson.id === id);
}

export function getLessonsForCourse(courseId: string): Lesson[] {
  return ALL_LESSONS.filter(lesson => lesson.courseId === courseId).sort((a, b) => a.order - b.order);
}
