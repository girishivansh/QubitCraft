import type { Achievement } from '../../types/curriculum';

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-lesson',
    title: 'First Lesson',
    description: 'Completed your first quantum lesson.',
    icon: 'Star',
    condition: { type: 'lessons-completed', count: 1 }
  },
  {
    id: 'knowledge-seeker',
    title: 'Knowledge Seeker',
    description: 'Completed 5 knowledge checks.',
    icon: 'Brain',
    condition: { type: 'checks-completed', count: 5 }
  },
  {
    id: 'quantum-foundations',
    title: 'Quantum Foundations',
    description: 'Completed the Quantum Foundations path.',
    icon: 'Award',
    condition: { type: 'path-complete', pathId: 'quantum-foundations' }
  },
  {
    id: 'circuit-explorer',
    title: 'Circuit Explorer',
    description: 'Built your first quantum circuit.',
    icon: 'Cpu',
    condition: { type: 'lesson-complete', lessonId: 'qf-build-first-circuit' }
  },
  {
    id: 'five-lessons',
    title: 'Dedicated Learner',
    description: 'Completed 5 lessons.',
    icon: 'BookOpen',
    condition: { type: 'lessons-completed', count: 5 }
  },
  {
    id: 'ten-checks',
    title: 'Quiz Master',
    description: 'Completed 10 knowledge checks.',
    icon: 'CheckCircle',
    condition: { type: 'checks-completed', count: 10 }
  },
  {
    id: 'circuit-mastery',
    title: 'Circuit Master',
    description: 'Completed Quantum Circuit Mastery.',
    icon: 'Zap',
    condition: { type: 'path-complete', pathId: 'quantum-circuit-mastery' }
  },
  {
    id: 'algorithm-expert',
    title: 'Algorithm Expert',
    description: 'Completed Quantum Algorithms.',
    icon: 'Trophy',
    condition: { type: 'path-complete', pathId: 'quantum-algorithms' }
  }
];
